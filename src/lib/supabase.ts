import { createClient, type User } from '@supabase/supabase-js'
import { ref } from 'vue'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabase = url && key ? createClient(url, key) : null
export const accountUser = ref<User | null>(null)
export const accountReady = ref(false)
export const passwordRecovery = ref(false)

if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    accountUser.value = session?.user ?? null
    accountReady.value = true
    if (event === 'PASSWORD_RECOVERY') passwordRecovery.value = true
    if (event === 'SIGNED_OUT') passwordRecovery.value = false
  })
  void supabase.auth
    .getSession()
    .then(({ data, error }) => {
      if (!error) accountUser.value = data.session?.user ?? null
      accountReady.value = true
    })
    .catch(() => {
      accountReady.value = true
    })
} else accountReady.value = true
