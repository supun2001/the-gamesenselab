import { handleForm, type Env } from './handler.ts'

export default {
  async fetch(request: Request, env: WorkerBindings & Env): Promise<Response> {
    const pathname = new URL(request.url).pathname
    const form = /^\/api\/([^/]+)\/?$/.exec(pathname)
    if (form) return handleForm(request, env, form[1])
    if (pathname === '/api' || pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ message: 'Form not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      })
    }
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<WorkerBindings & Env>
