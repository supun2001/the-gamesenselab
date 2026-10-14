<script setup lang="ts">
import { ref, watch } from 'vue'
import { accountUser, accountReady, passwordRecovery, supabase } from '../lib/supabase'
import Button from '../components/Button.vue'
const mode = ref<'login' | 'signup' | 'reset'>('login')
const email = ref(''),
  password = ref(''),
  displayName = ref('')
const busy = ref(false),
  message = ref(''),
  error = ref(''),
  profileLoaded = ref(false),
  profileExists = ref(false)
let profileRequest = 0
watch(
  accountUser,
  async (user) => {
    const current = ++profileRequest
    profileLoaded.value = false
    displayName.value = ''
    if (!user || !supabase) return
    const result = await supabase
      .from('user_profiles')
      .select('display_name')
      .eq('id', user.id)
      .maybeSingle()
    if (current !== profileRequest) return
    if (result.error) error.value = 'Your profile could not be loaded. Please try again.'
    else {
      profileExists.value = !!result.data
      displayName.value = result.data?.display_name ?? ''
      profileLoaded.value = true
    }
  },
  { immediate: true },
)
watch(mode, () => {
  message.value = ''
  error.value = ''
  password.value = ''
})
async function submit() {
  if (!supabase || busy.value) return
  busy.value = true
  message.value = ''
  error.value = ''
  try {
    const address = email.value.trim().toLowerCase()
    if (passwordRecovery.value) {
      const result = await supabase.auth.updateUser({ password: password.value })
      if (result.error) throw result.error
      passwordRecovery.value = false
      message.value = 'Your password has been updated.'
    } else if (mode.value === 'reset') {
      const result = await supabase.auth.resetPasswordForEmail(address, {
        redirectTo: `${window.location.origin}/account`,
      })
      if (result.error) throw result.error
      message.value = 'If an account exists for this email, you’ll receive a password reset link.'
    } else if (mode.value === 'signup') {
      const result = await supabase.auth.signUp({
        email: address,
        password: password.value,
        options: {
          emailRedirectTo: `${window.location.origin}/account`,
          data: { display_name: displayName.value.trim() },
        },
      })
      if (result.error) throw result.error
      message.value = result.data.session
        ? 'Your account is ready.'
        : 'Check your email to confirm your account, then sign in.'
    } else {
      const result = await supabase.auth.signInWithPassword({
        email: address,
        password: password.value,
      })
      if (result.error) throw result.error
    }
    password.value = ''
  } catch {
    error.value =
      mode.value === 'login' && !passwordRecovery.value
        ? 'Unable to sign in. Check your email and password, and confirm your email if needed.'
        : 'Unable to complete your request. Please try again. Passwords must meet the account security requirements.'
  } finally {
    busy.value = false
  }
}
async function saveProfile() {
  if (!supabase || !accountUser.value || busy.value || !profileLoaded.value) return
  busy.value = true
  message.value = ''
  error.value = ''
  try {
    const values = { display_name: displayName.value.trim(), updated_at: new Date().toISOString() }
    const result = profileExists.value
      ? await supabase
          .from('user_profiles')
          .update(values)
          .eq('id', accountUser.value.id)
          .select('id')
          .single()
      : await supabase
          .from('user_profiles')
          .insert({ id: accountUser.value.id, ...values })
          .select('id')
          .single()
    if (result.error) throw result.error
    profileExists.value = true
    message.value = 'Profile saved.'
  } catch {
    error.value = 'Your profile could not be saved. Please try again.'
  } finally {
    busy.value = false
  }
}
async function signOut() {
  if (!supabase || busy.value) return
  busy.value = true
  message.value = ''
  error.value = ''
  try {
    const result = await supabase.auth.signOut()
    if (result.error) throw result.error
  } catch {
    error.value = 'Unable to sign out. Please try again.'
  } finally {
    busy.value = false
  }
}
</script>
<template>
  <section class="page-hero shell">
    <p class="eyebrow">YOUR AVARAXIA LABS ACCOUNT</p>
    <h1>A place to <em>start.</em></h1>
    <p class="lead">
      Sign in with your existing account or create one. Early access and gameplay reviews are still
      coming soon.
    </p>
  </section>
  <section class="section shell account-section">
    <div class="form-card">
      <p v-if="!supabase" class="form-notice">
        Account access is being configured. Please check back soon.
      </p>
      <p v-else-if="!accountReady" role="status">Loading your account…</p>
      <template v-else-if="accountUser && !passwordRecovery">
        <h2>Your account</h2>
        <p>{{ accountUser.email }}</p>
        <form class="form-grid" @submit.prevent="saveProfile">
          <label
            >Display name<input
              v-model="displayName"
              maxlength="80"
              autocomplete="nickname"
              :disabled="!profileLoaded"
          /></label>
          <Button type="submit" :disabled="busy || !profileLoaded">{{
            busy ? 'Saving…' : 'Save profile'
          }}</Button>
        </form>
        <p class="form-note">
          Your account and waitlist registration are separate.
          <RouterLink to="/#waitlist">Join the waitlist</RouterLink> for early access.
        </p>
        <Button :disabled="busy" @click="signOut">Sign out</Button>
      </template>
      <template v-else>
        <h2>
          {{
            passwordRecovery
              ? 'Choose a new password'
              : mode === 'signup'
                ? 'Create an account'
                : mode === 'reset'
                  ? 'Reset your password'
                  : 'Sign in'
          }}
        </h2>
        <form class="form-grid" @submit.prevent="submit">
          <label v-if="!passwordRecovery"
            >Email address<input
              v-model="email"
              type="email"
              required
              maxlength="254"
              autocomplete="email"
          /></label>
          <label v-if="mode === 'signup' && !passwordRecovery"
            >Display name<input v-model="displayName" maxlength="80" autocomplete="nickname"
          /></label>
          <label v-if="mode !== 'reset' || passwordRecovery"
            >Password<input
              v-model="password"
              type="password"
              required
              :minlength="mode === 'signup' || passwordRecovery ? 8 : undefined"
              :autocomplete="
                mode === 'signup' || passwordRecovery ? 'new-password' : 'current-password'
              "
          /></label>
          <p v-if="mode === 'signup'" class="form-note">
            Use at least 8 characters. Creating an account does not subscribe you to development
            updates. Read our <RouterLink to="/privacy">privacy notice</RouterLink>.
          </p>
          <Button type="submit" :disabled="busy || !supabase">{{
            busy
              ? 'Please wait…'
              : passwordRecovery
                ? 'Update password'
                : mode === 'signup'
                  ? 'Create account'
                  : mode === 'reset'
                    ? 'Send reset link'
                    : 'Sign in'
          }}</Button>
        </form>
        <div v-if="!passwordRecovery" class="account-actions">
          <button v-if="mode !== 'login'" type="button" @click="mode = 'login'">Sign in</button>
          <button v-if="mode !== 'signup'" type="button" @click="mode = 'signup'">
            Create an account
          </button>
          <button v-if="mode !== 'reset'" type="button" @click="mode = 'reset'">
            Forgot password?
          </button>
        </div>
      </template>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <p v-if="message" class="form-notice" role="status">{{ message }}</p>
    </div>
  </section>
</template>
<style scoped>
.account-section {
  max-width: 640px;
  padding-top: 0;
}
.form-grid {
  margin-top: 24px;
  grid-template-columns: 1fr;
}
.account-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 24px;
}
.account-actions button {
  color: var(--mint, #63edc3);
  text-decoration: underline;
  background: none;
  border: 0;
  cursor: pointer;
}
</style>
