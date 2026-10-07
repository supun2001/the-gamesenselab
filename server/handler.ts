import { kinds, validate, ValidationError, type FormKind } from './validation.ts'
export interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  TURNSTILE_SECRET_KEY: string
  ALLOWED_ORIGIN: string
  RATE_LIMIT_SECRET: string
  FORMS_ENABLED: string
}
type Fetcher = typeof fetch
const response = (status: number, message: string) =>
  new Response(JSON.stringify({ message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...(status === 429 ? { 'Retry-After': '60' } : {}),
    },
  })
async function fingerprint(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  )
}
async function boundedBody(request: Request) {
  if (Number(request.headers.get('Content-Length')) > 16384) throw new RangeError()
  const reader = request.body?.getReader()
  if (!reader) throw new SyntaxError()
  const chunks: Uint8Array[] = []
  let length = 0
  while (true) {
    const result = await reader.read()
    if (result.done) break
    length += result.value.length
    if (length > 16384) {
      await reader.cancel()
      throw new RangeError()
    }
    chunks.push(result.value)
  }
  const bytes = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.length
  }
  return JSON.parse(new TextDecoder().decode(bytes))
}
export async function handleForm(
  request: Request,
  env: Env,
  form: string,
  fetcher: Fetcher = fetch,
): Promise<Response> {
  if (request.method !== 'POST') return response(405, 'Use the form to submit your request.')
  if (!kinds.includes(form as FormKind)) return response(404, 'Form not found.')
  if (
    !env.SUPABASE_URL ||
    !env.SUPABASE_SERVICE_ROLE_KEY ||
    !env.TURNSTILE_SECRET_KEY ||
    !env.RATE_LIMIT_SECRET ||
    !env.ALLOWED_ORIGIN ||
    env.FORMS_ENABLED !== 'true'
  )
    return response(503, 'Registrations and enquiries are not open yet. Please try again later.')
  if (
    request.headers.get('Origin') !== env.ALLOWED_ORIGIN ||
    new URL(request.url).origin !== env.ALLOWED_ORIGIN
  )
    return response(403, 'Please submit from the Altheia website.')
  if (!request.headers.get('Content-Type')?.startsWith('application/json'))
    return response(415, 'Submit a JSON form.')
  const kind = form as FormKind
  try {
    const input = await boundedBody(request)
    const row = validate(kind, input)
    if (
      input.website ||
      typeof input.token !== 'string' ||
      !input.token ||
      input.token.length > 2048
    )
      return response(400, 'Please complete the security check and try again.')
    const ip = request.headers.get('CF-Connecting-IP')
    if (!ip) return response(503, 'The security check is unavailable. Please try again later.')
    const dbHeaders = {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    }
    const db = env.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/'
    for (const [value, limit, windowSeconds] of [
      [`ip:${ip}`, 20, 60],
      [`${kind}:${row.email}`, 5, 3600],
    ] as const) {
      const result = await fetcher(`${db}rpc/altheia_consume_rate_limit`, {
        method: 'POST',
        headers: dbHeaders,
        body: JSON.stringify({
          p_key: await fingerprint(value, env.RATE_LIMIT_SECRET),
          p_limit: limit,
          p_window_seconds: windowSeconds,
        }),
        signal: AbortSignal.timeout(8000),
      })
      if (!result.ok) throw new Error('rate storage')
      if ((await result.json()) !== true)
        return response(429, 'Too many attempts. Please wait before trying again.')
    }
    const verified = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: input.token,
        remoteip: ip,
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!verified.ok) throw new Error('security service')
    const proof = (await verified.json()) as {
      success?: boolean
      action?: string
      hostname?: string
    }
    if (
      !proof.success ||
      proof.action !== kind ||
      proof.hostname !== new URL(env.ALLOWED_ORIGIN).hostname
    )
      return response(400, 'The security check expired or failed. Please try it again.')
    const now = new Date().toISOString()
    if ((kind === 'waitlist' && row.marketing_consent) || kind === 'team') row.consent_at = now
    const table =
      kind === 'waitlist'
        ? 'altheia_waitlist?on_conflict=email'
        : kind === 'team'
          ? 'altheia_team_interest'
          : 'altheia_enquiries'
    const stored = await fetcher(db + table, {
      method: 'POST',
      headers: {
        ...dbHeaders,
        Prefer:
          kind === 'waitlist' ? 'resolution=ignore-duplicates,return=minimal' : 'return=minimal',
      },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(8000),
    })
    if (!stored.ok) throw new Error('form storage')
    return response(
      200,
      kind === 'waitlist'
        ? 'You’re on the list. We’ll contact you when early access is ready.'
        : kind === 'team'
          ? 'Your team interest has been received. We’ll contact you about testing opportunities.'
          : 'Your enquiry has been received. The Altheia team can review it securely.',
    )
  } catch (error) {
    if (error instanceof ValidationError) return response(400, error.message)
    if (error instanceof RangeError) return response(413, 'Your message is too long.')
    if (error instanceof SyntaxError) return response(400, 'Please check your form and try again.')
    return response(
      503,
      'We couldn’t save your request. Your details are still in the form; please try again later.',
    )
  }
}
