import test from 'node:test'
import assert from 'node:assert/strict'
import { handleForm, type Env } from '../server/handler.ts'
import { validate } from '../server/validation.ts'
const env: Env = {
  ALLOWED_ORIGIN: 'https://example.test',
  SUPABASE_URL: 'https://db.example.test',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
  TURNSTILE_SECRET_KEY: 'test-turnstile',
  RATE_LIMIT_SECRET: 'test-only-hmac-secret',
  FORMS_ENABLED: 'true',
}
const input = {
  email: ' Player@Example.COM ',
  game: 'CS2',
  role: 'individual',
  marketingConsent: false,
  token: 'verified-test-token',
  website: '',
}
const request = (body: unknown = input, options: RequestInit = {}) =>
  new Request('https://example.test/api/waitlist', {
    method: 'POST',
    headers: {
      Origin: env.ALLOWED_ORIGIN,
      'Content-Type': 'application/json',
      'CF-Connecting-IP': '192.0.2.1',
    },
    body: JSON.stringify(body),
    ...options,
  })
function services(
  options: { rate?: boolean; proof?: object; fail?: 'db' | 'rate' | 'verify' } = {},
) {
  const stored: Record<string, unknown>[] = [],
    limiter: Record<string, unknown>[] = []
  let calls = 0
  const fakeFetch: typeof fetch = async (url, init) => {
    calls++
    const path = String(url)
    if (path.includes('/rpc/')) {
      limiter.push(JSON.parse(String(init?.body)))
      return options.fail === 'rate'
        ? new Response('', { status: 500 })
        : Response.json(options.rate ?? true)
    }
    if (path.includes('siteverify'))
      return options.fail === 'verify'
        ? new Response('', { status: 500 })
        : Response.json(
            options.proof ?? { success: true, action: 'waitlist', hostname: 'example.test' },
          )
    stored.push(JSON.parse(String(init?.body)))
    assert.ok((init?.headers as Record<string, string>).apikey === env.SUPABASE_SERVICE_ROLE_KEY)
    return new Response(null, { status: options.fail === 'db' ? 500 : 201 })
  }
  return { fakeFetch, stored, limiter, calls: () => calls }
}
test('normalises waitlist email and stores only intended fields', async () => {
  const service = services()
  const result = await handleForm(request(), env, 'waitlist', service.fakeFetch)
  assert.equal(result.status, 200)
  assert.deepEqual(service.stored[0], {
    email: 'player@example.com',
    game: 'CS2',
    role: 'individual',
    marketing_consent: false,
    consent_version: null,
  })
  assert.match((await result.json()).message, /You’re on the list/)
  assert.ok(service.limiter.every((row) => /^[a-f0-9]{64}$/.test(String(row.p_key))))
  assert.ok(!JSON.stringify(service.limiter).includes('192.0.2.1'))
})
test('records optional marketing consent version and timestamp', async () => {
  const service = services()
  await handleForm(
    request({ ...input, marketingConsent: true }),
    env,
    'waitlist',
    service.fakeFetch,
  )
  assert.equal(service.stored[0]?.consent_version, 'altheia-updates-v1')
  assert.ok(Number.isFinite(Date.parse(String(service.stored[0]?.consent_at))))
})
test('duplicate waitlist uses conflict-ignore semantics and identical responses', async () => {
  const seen = new Map<string, unknown>()
  const base = services().fakeFetch
  const fakeFetch: typeof fetch = async (url, init) => {
    if (!String(url).includes('altheia_waitlist')) return base(url, init)
    assert.match(String(url), /on_conflict=email/)
    assert.equal(
      (init?.headers as Record<string, string>).Prefer,
      'resolution=ignore-duplicates,return=minimal',
    )
    const row = JSON.parse(String(init?.body))
    if (!seen.has(row.email)) seen.set(row.email, row)
    return new Response(null, { status: 201 })
  }
  const results = await Promise.all([
    handleForm(request(), env, 'waitlist', fakeFetch),
    handleForm(
      request({ ...input, email: 'player@example.com', marketingConsent: true }),
      env,
      'waitlist',
      fakeFetch,
    ),
  ])
  assert.equal(seen.size, 1)
  assert.deepEqual(await results[0]!.json(), await results[1]!.json())
  assert.equal(
    (seen.get('player@example.com') as { marketing_consent: boolean }).marketing_consent,
    false,
  )
})
test('invalid email, enum, consent, type, length and extra fields fail before service calls', async () => {
  for (const change of [
    { email: 'bad' },
    { role: 'admin' },
    { game: 'bad' },
    { marketingConsent: 'yes' },
    { email: {} },
    { email: 'a'.repeat(260) },
    { isAdmin: true },
  ]) {
    const service = services()
    assert.equal(
      (await handleForm(request({ ...input, ...change }), env, 'waitlist', service.fakeFetch))
        .status,
      400,
    )
    assert.equal(service.calls(), 0)
  }
})
test('requires bot proof and rejects filled honeypot', async () => {
  for (const change of [{ token: '' }, { token: 'a'.repeat(2049) }, { website: 'bot.example' }]) {
    const service = services()
    assert.equal(
      (await handleForm(request({ ...input, ...change }), env, 'waitlist', service.fakeFetch))
        .status,
      400,
    )
    assert.equal(service.stored.length, 0)
  }
})
test('invalid, expired or mismatched bot proof never writes a record', async () => {
  for (const proof of [
    { success: false },
    { success: true, action: 'contact', hostname: 'example.test' },
    { success: true, action: 'waitlist', hostname: 'foreign.test' },
  ]) {
    const service = services({ proof })
    assert.equal((await handleForm(request(), env, 'waitlist', service.fakeFetch)).status, 400)
    assert.equal(service.stored.length, 0)
  }
})
test('rate limiting is enforced and reports a retry delay', async () => {
  const service = services({ rate: false })
  const result = await handleForm(request(), env, 'waitlist', service.fakeFetch)
  assert.equal(result.status, 429)
  assert.equal(result.headers.get('Retry-After'), '60')
  assert.equal(service.stored.length, 0)
})
test('service failures fail closed without exposing errors or credentials', async () => {
  for (const fail of ['db', 'rate', 'verify'] as const) {
    const result = await handleForm(request(), env, 'waitlist', services({ fail }).fakeFetch)
    assert.equal(result.status, 503)
    assert.doesNotMatch(await result.text(), /test-service-key|player@example|SQL/)
  }
})
test('missing production configuration and disabled forms never write', async () => {
  for (const key of Object.keys(env)) {
    const service = services()
    assert.equal(
      (await handleForm(request(), { ...env, [key]: '' }, 'waitlist', service.fakeFetch)).status,
      503,
    )
    assert.equal(service.calls(), 0)
  }
})
test('request guards reject foreign origins, methods, content types and large bodies', async () => {
  const service = services()
  assert.equal(
    (
      await handleForm(
        new Request('https://example.test/api/waitlist'),
        env,
        'waitlist',
        service.fakeFetch,
      )
    ).status,
    405,
  )
  assert.equal(
    (
      await handleForm(
        request(input, {
          headers: { Origin: 'https://other.test', 'Content-Type': 'application/json' },
        }),
        env,
        'waitlist',
        service.fakeFetch,
      )
    ).status,
    403,
  )
  assert.equal(
    (
      await handleForm(
        request(input, { headers: { Origin: env.ALLOWED_ORIGIN, 'Content-Type': 'text/plain' } }),
        env,
        'waitlist',
        service.fakeFetch,
      )
    ).status,
    415,
  )
  assert.equal(
    (
      await handleForm(
        request({ ...input, website: 'a'.repeat(17000) }),
        env,
        'waitlist',
        service.fakeFetch,
      )
    ).status,
    413,
  )
  assert.equal(
    (await handleForm(request(null, { body: 'bad json' }), env, 'waitlist', service.fakeFetch))
      .status,
    400,
  )
  assert.equal(service.calls(), 0)
})
test('team interest validates permission and persists representative details', async () => {
  const body = {
    email: 'captain@example.com',
    name: 'Captain',
    game: 'CS2',
    teamSize: 5,
    level: '',
    challenge: 'Our readiness calls conflict.',
    permission: true,
    token: 'proof',
    website: '',
  }
  const service = services({ proof: { success: true, action: 'team', hostname: 'example.test' } })
  assert.equal((await handleForm(request(body), env, 'team', service.fakeFetch)).status, 200)
  assert.equal(service.stored[0]?.team_size, 5)
  assert.equal(service.stored[0]?.contact_permission, true)
  assert.throws(() => validate('team', { ...body, permission: false }))
  assert.throws(() => validate('team', { ...body, teamSize: 0 }))
  assert.throws(() => validate('team', { ...body, teammates: ['private'] }))
})
test('contact stores an enquiry and does not claim email delivery', async () => {
  const body = {
    email: 'person@example.com',
    name: 'Person',
    category: 'Privacy request',
    message: 'Please remove my information.',
    token: 'proof',
    website: '',
  }
  const service = services({
    proof: { success: true, action: 'contact', hostname: 'example.test' },
  })
  const result = await handleForm(request(body), env, 'contact', service.fakeFetch)
  assert.equal(result.status, 200)
  assert.equal(service.stored[0]?.category, 'Privacy request')
  assert.doesNotMatch((await result.json()).message, /email.*sent/i)
})
