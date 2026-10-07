import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { pages } from '../config/pages'
import { site } from '../config/site'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/freya', component: () => import('../views/FreyaView.vue') },
    { path: '/team-coaching', component: () => import('../views/TeamView.vue') },
    { path: '/pricing', component: () => import('../views/PricingView.vue') },
    { path: '/roadmap', component: () => import('../views/RoadmapView.vue') },
    { path: '/about', component: () => import('../views/AboutView.vue') },
    { path: '/faq', component: () => import('../views/FAQView.vue') },
    { path: '/contact', component: () => import('../views/ContactView.vue') },
    { path: '/privacy', component: () => import('../views/LegalView.vue') },
    { path: '/terms', component: () => import('../views/LegalView.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('../views/NotFoundView.vue') },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash)
      return {
        el: to.hash,
        top: 110,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      }
    return { top: 0 }
  },
})
router.afterEach((to) => {
  const page = pages.find((item) => item.path === to.path)
  document.title = page?.title || 'Page not found — Altheia'
  const set = (selector: string, value: string) =>
    document.querySelector(selector)?.setAttribute('content', value)
  set('meta[name="description"]', page?.description || 'This page could not be found.')
  set('meta[property="og:title"]', document.title)
  set('meta[property="og:description"]', page?.description || '')
  set('meta[name="twitter:title"]', document.title)
  set('meta[name="twitter:description"]', page?.description || '')
  set(
    'meta[name="robots"]',
    !site.url || !page || ['/privacy', '/terms'].includes(to.path)
      ? 'noindex, nofollow'
      : 'index, follow',
  )
  if (site.url && page) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = site.url + to.path
    set('meta[property="og:url"]', canonical.href)
  } else document.querySelector('link[rel="canonical"]')?.remove()
})
export default router
