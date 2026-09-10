import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublicKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
export const isConfigured = Boolean(supabaseUrl && supabasePublicKey)
// The marketing site remains usable before the owner configures Supabase.
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabasePublicKey, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null
export const configurationMessage = 'Registration is not open just yet. Please check back soon.'
