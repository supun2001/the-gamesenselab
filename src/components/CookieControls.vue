<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
const key = 'avaraxia-cookie-preferences-v1'
const measurementId = 'G-F2FWDSENLL'
const decided = ref(false)
const analytics = ref(false)
const dialog = ref<HTMLDialogElement | null>(null)
const storageError = ref('')
let loaded = false
const trackingWindow = window as typeof window & {
  dataLayer?: unknown[]
  [key: `ga-disable-${string}`]: boolean
}
function loadAnalytics() {
  if (loaded) return
  loaded = true
  trackingWindow[`ga-disable-${measurementId}`] = false
  trackingWindow.dataLayer = trackingWindow.dataLayer || []
  function gtag(..._args: unknown[]) {
    trackingWindow.dataLayer!.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)
}
function clearAnalyticsCookies() {
  const domains = location.hostname.split('.').map((_, i, parts) => parts.slice(i).join('.'))
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0]
    if (name !== '_ga' && !name?.startsWith('_ga_')) continue
    for (const domain of ['', ...domains, ...domains.map((value) => `.${value}`)]) {
      document.cookie = `${name}=; Max-Age=0; Path=/;${domain ? ` Domain=${domain};` : ''} SameSite=Lax`
    }
  }
}
function save(accepted: boolean) {
  storageError.value = ''
  try {
    localStorage.setItem(key, accepted ? 'accepted' : 'rejected')
  } catch {
    storageError.value = loaded
      ? 'Your browser could not save this choice. Your previous choice remains active.'
      : 'Your browser could not save this choice. Optional analytics stays off.'
    return
  }
  analytics.value = accepted
  decided.value = true
  dialog.value?.close()
  if (accepted) loadAnalytics()
  else {
    trackingWindow[`ga-disable-${measurementId}`] = true
    clearAnalyticsCookies()
    // A fresh document removes the loaded Google script and its event handlers.
    if (loaded) location.reload()
  }
}
function openSettings() {
  dialog.value?.showModal()
}
onMounted(() => {
  try {
    const value = localStorage.getItem(key)
    decided.value = value === 'accepted' || value === 'rejected'
    analytics.value = value === 'accepted'
  } catch {
    /* Default to no optional tracking when storage is unavailable. */
  }
  if (analytics.value) loadAnalytics()
  window.addEventListener('open-cookie-settings', openSettings)
})
onUnmounted(() => window.removeEventListener('open-cookie-settings', openSettings))
</script>
<template>
  <aside v-if="!decided" class="cookie-banner" aria-label="Cookie preferences">
    <h2>Your privacy choices</h2>
    <p>
      We use essential technologies to operate and protect this website. With your permission, we
      also use analytics to understand how the site is used. You can change your choice in Cookie
      settings. <RouterLink to="/cookies">Read our cookie notice</RouterLink>.
    </p>
    <div class="cookie-actions">
      <button type="button" @click="save(true)">Accept optional</button>
      <button type="button" @click="save(false)">Reject optional</button>
      <button type="button" @click="openSettings">Manage preferences</button>
    </div>
    <p v-if="storageError" role="alert">{{ storageError }}</p>
  </aside>
  <dialog ref="dialog" class="cookie-dialog" aria-labelledby="cookie-title">
    <h2 id="cookie-title">Cookie settings</h2>
    <p>
      Essential technologies support website delivery, security and remembering your privacy
      choices. They are always enabled.
    </p>
    <label class="checkbox-label"
      ><input v-model="analytics" type="checkbox" />Allow optional Google Analytics</label
    >
    <p>
      Analytics helps us understand website usage. Your choice does not affect your place on the
      waitlist or your email preferences.
    </p>
    <div class="cookie-actions">
      <button type="button" @click="save(analytics)">Save preferences</button>
      <button type="button" @click="save(false)">Reject optional</button>
      <button type="button" @click="dialog?.close()">Close</button>
    </div>
    <p v-if="storageError" role="alert">{{ storageError }}</p>
  </dialog>
</template>
