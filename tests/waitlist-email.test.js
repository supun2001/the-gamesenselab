import test from 'node:test'
import assert from 'node:assert/strict'
import { createWorker } from '../supabase/functions/waitlist-welcome/worker.js'
import { html, text, communityUrl } from '../supabase/functions/waitlist-welcome/email.js'

const request = (secret = 'test-only') =>
  new Request('https://example.com/worker', {
    method: 'POST',
    headers: { 'x-worker-secret': secret },
  })
function fixture(overrides = {}) {
  const calls = []
  const jobs = [{ waitlist_id: 'one' }, { waitlist_id: 'two' }]
  const worker = createWorker({
    secret: 'test-only',
    claim: async () => jobs.shift(),
    send: async (job) => calls.push(`send:${job.waitlist_id}`),
    complete: async (job) => calls.push(`complete:${job.waitlist_id}`),
    fail: async (job) => calls.push(`fail:${job.waitlist_id}`),
    ...overrides,
  })
  return { worker, calls, jobs }
}
test('unauthorized calls cannot claim or send messages', async () => {
  const { worker, calls, jobs } = fixture()
  assert.equal((await worker(request('wrong'))).status, 401)
  assert.equal(jobs.length, 2)
  assert.deepEqual(calls, [])
  assert.equal((await worker(new Request('https://example.com'))).status, 405)
  assert.equal((await fixture({ secret: '' }).worker(request())).status, 401)
})
test('marks sent only after successful SMTP delivery', async () => {
  const { worker, calls } = fixture()
  assert.deepEqual(await (await worker(request())).json(), { sent: 2, failed: 0 })
  assert.deepEqual(calls, ['send:one', 'complete:one', 'send:two', 'complete:two'])
})
test('SMTP failure queues a retry and allows the next message to send', async () => {
  const { worker, calls } = fixture({
    send: async (job) => {
      if (job.waitlist_id === 'one') throw new Error('SMTP unavailable')
    },
  })
  assert.deepEqual(await (await worker(request())).json(), { sent: 1, failed: 1 })
  assert.deepEqual(calls, ['fail:one', 'complete:two'])
})
test('database failure after SMTP acceptance preserves the lease and stops the batch', async () => {
  const { worker, calls, jobs } = fixture({
    complete: async () => {
      throw new Error('DB unavailable')
    },
  })
  assert.equal((await worker(request())).status, 500)
  assert.deepEqual(calls, ['send:one'])
  assert.equal(jobs.length, 1)
})
test('each invocation is bounded even with a large backlog', async () => {
  let claimed = 0
  const { worker } = fixture({ claim: async () => ({ waitlist_id: String(++claimed) }) })
  assert.equal((await (await worker(request())).json()).sent, 3)
  assert.equal(claimed, 3)
})
test('email includes the logo, offer conditions and correct community destination', () => {
  assert.ok(html.includes('https://thegamesenselab.com/images/logo.png'))
  for (const body of [html, text]) {
    assert.ok(body.includes(communityUrl))
    assert.ok(body.includes('stay with us until launch'))
    assert.ok(body.includes('first 3 months of AI access FREE'))
    assert.ok(body.includes('contact@thegamesenselab.com'))
    assert.ok(!body.includes('ConfirmationURL'))
  }
})
