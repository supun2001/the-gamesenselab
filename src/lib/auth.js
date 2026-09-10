import { ref } from 'vue'
import { supabase } from './supabase'
import { getVerifiedSession, isEmailVerified } from './verified-auth'

export const session = ref(null)
export const authError = ref('')
export const authReady = (async () => {
  if (!supabase) return
  supabase.auth.onAuthStateChange((_event, value) => {
    session.value = isEmailVerified(value?.user) ? value : null
  })
  try {
    session.value = await getVerifiedSession(supabase)
  } catch {
    authError.value = 'We could not restore your session. Please sign in again.'
  }
})()
