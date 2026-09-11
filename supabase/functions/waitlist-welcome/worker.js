// Dependencies are injected so failure handling can be tested without sending email.
export function createWorker({ secret, claim, send, complete, fail }) {
  return async (request) => {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 })
    if (!secret || request.headers.get('x-worker-secret') !== secret) {
      return new Response('Unauthorized', { status: 401 })
    }
    let sent = 0
    let failed = 0
    try {
      // Bound each invocation and claim individually so unsent jobs are not held in a batch.
      for (let i = 0; i < 3; i++) {
        const job = await claim()
        if (!job) break
        try {
          await send(job)
        } catch {
          await fail(job)
          failed++
          continue
        }
        // If SMTP accepted but the DB is unavailable, retain the lease for recovery.
        await complete(job)
        sent++
      }
      return Response.json({ sent, failed })
    } catch {
      return Response.json(
        { error: 'Worker failed; inspect queue and function logs.' },
        { status: 500 },
      )
    }
  }
}
