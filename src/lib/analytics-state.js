import { ref } from 'vue'
import { createAnalytics } from './analytics'
export const analytics = createAnalytics(window)
export const consentVisible = ref(analytics.consent === null)
export const analyticsConsent = ref(analytics.consent)
export function chooseAnalytics(value) {
  analytics.choose(value)
  analyticsConsent.value = analytics.consent
  consentVisible.value = false
}
