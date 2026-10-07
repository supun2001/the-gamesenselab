/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_TURNSTILE_SITE_KEY?: string
}
interface Window {
  turnstile?: {
    render: (element: HTMLElement, options: Record<string, unknown>) => string
    reset: (id: string) => void
    remove: (id: string) => void
  }
}
