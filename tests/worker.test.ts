import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../server/worker.ts'

test('unknown API routes are safe, uncached and emit no request content', async (t) => {
  const logs: unknown[] = []
  t.mock.method(console, 'log', (event: unknown) => logs.push(event))
  const result = await worker.fetch(
    new Request('https://example.test/api/private/secret?token=do-not-log'),
    {} as Parameters<typeof worker.fetch>[1],
  )
  assert.equal(result.status, 404)
  assert.equal(result.headers.get('Cache-Control'), 'no-store')
  assert.equal(result.headers.get('X-Content-Type-Options'), 'nosniff')
  assert.match(result.headers.get('X-Request-ID')!, /^[a-f0-9-]{36}$/)
  assert.equal((logs[0] as { requestId: string }).requestId, result.headers.get('X-Request-ID'))
  assert.doesNotMatch(JSON.stringify(logs), /secret|do-not-log|token/)
  assert.deepEqual(await result.json(), { message: 'Form not found.' })
})
