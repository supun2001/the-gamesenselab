<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
const props = defineProps<{ action: string }>()
const emit = defineEmits<{ token: [value: string] }>()
const element = ref<HTMLElement | null>(null),
  error = ref('')
let widget: string | undefined,
  active = true
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
async function load() {
  if (!siteKey) {
    error.value = 'Registrations and enquiries are not open yet.'
    return
  }
  try {
    if (!window.turnstile)
      await new Promise<void>((resolve, reject) => {
        let script = document.getElementById('turnstile-script') as HTMLScriptElement | null
        const fresh = !script
        if (!script) {
          script = document.createElement('script')
          script.id = 'turnstile-script'
          script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
          script.async = true
        }
        const timer = setTimeout(() => reject(new Error('timeout')), 12000)
        script.addEventListener(
          'load',
          () => {
            clearTimeout(timer)
            resolve()
          },
          { once: true },
        )
        script.addEventListener(
          'error',
          () => {
            clearTimeout(timer)
            script?.remove()
            reject(new Error('load'))
          },
          { once: true },
        )
        if (fresh) document.head.appendChild(script)
      })
    if (!active || !element.value) return
    widget = window.turnstile?.render(element.value, {
      sitekey: siteKey,
      action: props.action,
      theme: 'dark',
      size: 'flexible',
      callback: (token: string) => {
        error.value = ''
        emit('token', token)
      },
      'expired-callback': () => emit('token', ''),
      'error-callback': () => {
        emit('token', '')
        error.value = 'Security check unavailable. Please reload and try again.'
      },
    })
  } catch {
    error.value = 'Security check unavailable. Please reload and try again.'
  }
}
defineExpose({
  reset() {
    emit('token', '')
    if (widget) window.turnstile?.reset(widget)
  },
})
onMounted(load)
onUnmounted(() => {
  active = false
  if (widget) window.turnstile?.remove(widget)
})
</script>
<template>
  <div class="bot-check">
    <div ref="element"></div>
    <p v-if="error" class="form-notice" role="status">{{ error }}</p>
  </div>
</template>
