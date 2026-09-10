import { createRouter, createWebHashHistory } from 'vue-router'
import { authReady, session } from '../lib/auth'
import { getVerifiedSession } from '../lib/verified-auth'
import { supabase } from '../lib/supabase'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView, meta: { title: 'Play Smarter' } },
    {
      path: '/signup',
      component: () => import('../views/SignupView.vue'),
      meta: { title: 'Create Account' },
    },
    {
      path: '/login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Sign In' },
    },
    {
      path: '/dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true, title: 'Dashboard' },
    },
    {
      path: '/privacy',
      component: () => import('../views/PrivacyView.vue'),
      meta: { title: 'Privacy Policy' },
    },
    { path: '/terms', component: () => import('../views/TermsView.vue'), meta: { title: 'Terms' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash)
      return {
        el: to.hash,
        top: 100,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      }
    return { top: 0 }
  },
})
router.beforeEach(async (to) => {
  await authReady
  if (to.meta.requiresAuth && supabase) {
    try {
      session.value = await getVerifiedSession(supabase)
    } catch {
      session.value = null
    }
  }
  if (to.meta.requiresAuth && !session.value)
    return { path: '/login', query: { redirect: '/dashboard' } }
})
router.afterEach((to) => {
  document.title = `GameSense Lab | ${to.meta.title || 'Play Smarter'}`
})
export default router
