import { handleForm, type Env } from './handler.ts'

export default {
  async fetch(request: Request, env: WorkerBindings & Env): Promise<Response> {
    const pathname = new URL(request.url).pathname
    if (pathname !== '/api' && !pathname.startsWith('/api/')) return env.ASSETS.fetch(request)
    const requestId = crypto.randomUUID()
    const started = Date.now()
    const form = /^\/api\/([^/]+)\/?$/.exec(pathname)
    let result: Response
    try {
      result = form
        ? await handleForm(request, env, form[1])
        : Response.json({ message: 'Form not found.' }, { status: 404 })
    } catch {
      result = Response.json(
        { message: 'The service is temporarily unavailable. Please try again later.' },
        { status: 503 },
      )
    }
    result.headers.set('Cache-Control', 'no-store')
    result.headers.set('X-Content-Type-Options', 'nosniff')
    result.headers.set('X-Request-ID', requestId)
    // Never log URLs, headers, bodies, emails, IPs, tokens or upstream exception messages.
    const event = {
      event: 'api_request',
      requestId,
      form: ['waitlist', 'team', 'contact'].includes(form?.[1] ?? '') ? form![1] : 'unknown',
      status: result.status,
      durationMs: Date.now() - started,
    }
    if (result.status >= 500) console.error(event)
    else console.log(event)
    return result
  },
} satisfies ExportedHandler<WorkerBindings & Env>
