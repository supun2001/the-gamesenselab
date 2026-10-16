<script setup lang="ts">
import { ref, watch } from 'vue'
import { accountUser, accountReady, passwordRecovery, supabase } from '../lib/supabase'
import Button from '../components/Button.vue'
const mode = ref<'login' | 'signup' | 'reset'>('login')
const newEmail = ref('')
const activeAction = ref('')
function formatDate(value?: string) {
  if (!value) return 'Not available'
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(value))
}
const email = ref(''),
  password = ref(''),
  confirmPassword = ref(''),
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
    newEmail.value = ''
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
  confirmPassword.value = ''
})
async function submit() {
  if (!supabase || busy.value) return
  if (
    mode.value === 'signup' &&
    !passwordRecovery.value &&
    password.value !== confirmPassword.value
  ) {
    message.value = ''
    error.value = 'Passwords do not match. Please enter the same password in both fields.'
    return
  }
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
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (result.error) throw result.error
      message.value = 'If an account exists for this email, you’ll receive a password reset link.'
    } else if (mode.value === 'signup') {
      const result = await supabase.auth.signUp({
        email: address,
        password: password.value,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmed`,
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
    confirmPassword.value = ''
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
async function changeEmail() {
  if (!supabase || !accountUser.value || busy.value) return
  const address = newEmail.value.trim().toLowerCase()
  message.value = ''
  error.value = ''
  if (address === accountUser.value.email?.toLowerCase()) {
    error.value = 'Enter a different email address.'
    return
  }
  busy.value = true
  activeAction.value = 'email'
  try {
    const result = await supabase.auth.updateUser(
      { email: address },
      { emailRedirectTo: `${window.location.origin}/account` },
    )
    if (result.error) throw result.error
    accountUser.value = result.data.user
    newEmail.value = ''
    message.value =
      result.data.user.email === address
        ? 'Your email address has been updated.'
        : 'Email change requested. Check your new inbox and, if required, your current inbox to confirm the change.'
  } catch {
    error.value = 'Unable to change your email. Please try again.'
  } finally {
    busy.value = false
    activeAction.value = ''
  }
}
async function sendPasswordReset() {
  if (!supabase || !accountUser.value?.email || busy.value) return
  busy.value = true
  activeAction.value = 'password'
  message.value = ''
  error.value = ''
  try {
    const result = await supabase.auth.resetPasswordForEmail(accountUser.value.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (result.error) throw result.error
    message.value =
      'Password reset requested. Check your inbox for a link to choose a new password.'
  } catch {
    error.value = 'Unable to send a password reset email. Please try again.'
  } finally {
    busy.value = false
    activeAction.value = ''
  }
}
</script>
<template>
  <section class="page-hero shell">
    <p class="eyebrow">YOUR AVARAXIA LABS ACCOUNT</p>
    <h1 v-if="accountUser && !passwordRecovery">Make yourself <em>at home.</em></h1>
    <h1 v-else>A place to <em>start.</em></h1>
    <p v-if="accountUser && !passwordRecovery" class="lead">
      Manage your profile, email address and account security.
    </p>
    <p v-else class="lead">
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
        <dl class="account-details">
          <div>
            <dt>Email address</dt>
            <dd>{{ accountUser.email }}</dd>
          </div>
          <div>
            <dt>Email status</dt>
            <dd>{{ accountUser.email_confirmed_at ? 'Confirmed' : 'Awaiting confirmation' }}</dd>
          </div>
          <div>
            <dt>Member since</dt>
            <dd>{{ formatDate(accountUser.created_at) }}</dd>
          </div>
          <div>
            <dt>Last sign in</dt>
            <dd>{{ formatDate(accountUser.last_sign_in_at) }}</dd>
          </div>
        </dl>
        <section class="settings-section" aria-labelledby="profile-heading">
          <h3 id="profile-heading">Profile</h3>
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
        </section>
        <section class="settings-section" aria-labelledby="email-heading">
          <h3 id="email-heading">Change email address</h3>
          <p class="form-note">
            Use an address you can access. You may need to confirm the change from both your current
            and new inboxes.
          </p>
          <p v-if="accountUser.new_email" class="form-notice">
            Pending email change: {{ accountUser.new_email }}
          </p>
          <form class="form-grid" @submit.prevent="changeEmail">
            <label
              >New email address<input
                v-model="newEmail"
                type="email"
                required
                maxlength="254"
                autocomplete="email"
                :disabled="busy"
            /></label>
            <Button type="submit" :disabled="busy">{{
              activeAction === 'email' ? 'Requesting change…' : 'Change email'
            }}</Button>
          </form>
        </section>
        <section class="settings-section" aria-labelledby="security-heading">
          <h3 id="security-heading">Password &amp; security</h3>
          <p class="form-note">
            We’ll send a secure reset link to {{ accountUser.email }} so you can choose a new
            password.
          </p>
          <Button :disabled="busy || !accountUser.email" @click="sendPasswordReset">{{
            activeAction === 'password' ? 'Sending…' : 'Send password reset email'
          }}</Button>
        </section>
        <section class="settings-section" aria-labelledby="access-heading">
          <h3 id="access-heading">Early access</h3>
          <p class="form-note">
            Your account and waitlist registration are separate.
            <RouterLink to="/#waitlist">Join the waitlist</RouterLink> for early access.
          </p>
        </section>
        <section class="settings-section" aria-labelledby="help-heading">
          <h3 id="help-heading">Help &amp; privacy</h3>
          <p class="form-note">
            Need help with your account or want to request removal of your data?
            <RouterLink to="/contact">Contact us</RouterLink>. Read our
            <RouterLink to="/privacy">privacy notice</RouterLink>.
          </p>
          <Button :disabled="busy" @click="signOut">Sign out</Button>
        </section>
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
          <label v-if="mode === 'signup' && !passwordRecovery"
            >Confirm password<input
              v-model="confirmPassword"
              type="password"
              required
              minlength="8"
              autocomplete="new-password"
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
          <RouterLink to="/reset-password">Forgot password?</RouterLink>
        </div>
      </template>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <p v-if="message" class="form-notice" role="status">{{ message }}</p>
    </div>
  </section>
</template>
<style scoped>
.account-section {
  max-width: 760px;
  padding-top: 0;
}
.settings-section {
  margin-top: 32px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
}
.settings-section h3 {
  margin: 0 0 12px;
}
.account-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin: 24px 0 0;
}
.account-details dt {
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 6px;
}
.account-details dd {
  margin: 0;
  overflow-wrap: anywhere;
}
.form-note a {
  color: var(--mint);
  text-decoration: underline;
}
@media (max-width: 520px) {
  .account-details {
    grid-template-columns: 1fr;
  }
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
.account-actions button,
.account-actions a {
  color: var(--mint, #63edc3);
  text-decoration: underline;
  background: none;
  border: 0;
  cursor: pointer;
}
</style>
