<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { accountUser, accountReady, passwordRecovery, supabase } from '../lib/supabase'
import Button from '../components/Button.vue'
import Icon from '../components/Icon.vue'
const mode = ref<'login' | 'signup' | 'reset'>('login')
const newEmail = ref('')
const selectedPanel = ref('profile')
function selectPanel(id: string) {
  selectedPanel.value = id
  message.value = ''
  error.value = ''
}
const settingsTabs = [
  { id: 'profile', label: 'Profile', icon: 'user' },
  { id: 'security', label: 'Login & security', icon: 'lock' },
  { id: 'support', label: 'Help & access', icon: 'help' },
]
const initials = computed(() =>
  (displayName.value.trim() || accountUser.value?.email || 'A').slice(0, 2).toUpperCase(),
)
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
  activeAction.value = 'profile'
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
  <section
    :class="['page-hero shell account-hero', { 'is-signed-in': accountUser && !passwordRecovery }]"
  >
    <p class="eyebrow">YOUR AVARAXIA LABS ACCOUNT</p>
    <h1 v-if="accountUser && !passwordRecovery">
      Account settings<span class="heading-dot">.</span>
    </h1>
    <h1 v-else>A place to <em>start.</em></h1>
    <p v-if="accountUser && !passwordRecovery" class="lead">
      Manage your profile, email address and account security.
    </p>
    <p v-else class="lead">
      Sign in with your existing account or create one. Early access and gameplay reviews are still
      coming soon.
    </p>
  </section>
  <section
    :class="[
      'section shell account-section',
      { 'settings-layout': accountUser && !passwordRecovery && supabase && accountReady },
    ]"
  >
    <aside
      v-if="accountUser && !passwordRecovery && supabase && accountReady"
      class="settings-sidebar"
    >
      <div class="sidebar-identity">
        <span class="avatar">{{ initials }}</span>
        <strong>{{ displayName || 'Your account' }}</strong>
        <span>{{ accountUser.email }}</span>
      </div>
      <nav class="settings-nav" aria-label="Account settings">
        <button
          v-for="tab in settingsTabs"
          :key="tab.id"
          type="button"
          :class="{ selected: selectedPanel === tab.id }"
          :aria-current="selectedPanel === tab.id ? 'page' : undefined"
          @click="selectPanel(tab.id)"
        >
          <Icon :name="tab.icon" />{{ tab.label
          }}<span class="nav-arrow" aria-hidden="true">›</span>
        </button>
      </nav>
      <div class="sidebar-bottom">
        <span class="workspace-label">AVARAXIA LABS</span>
        <p>Read the game.<br />Rise together.</p>
        <button type="button" class="signout-link" :disabled="busy" @click="signOut">
          Sign out <Icon name="logout" />
        </button>
      </div>
    </aside>
    <div :class="['form-card', { 'settings-content': accountUser && !passwordRecovery }]">
      <p v-if="!supabase" class="form-notice">
        Account access is being configured. Please check back soon.
      </p>
      <p v-else-if="!accountReady" role="status">Loading your account…</p>
      <template v-else-if="accountUser && !passwordRecovery">
        <header class="panel-heading">
          <div>
            <p class="panel-kicker">PERSONAL SETTINGS</p>
            <h2>
              {{
                selectedPanel === 'profile'
                  ? 'Your profile'
                  : selectedPanel === 'security'
                    ? 'Login & security'
                    : 'Help & access'
              }}
            </h2>
            <p>
              {{
                selectedPanel === 'profile'
                  ? 'A few details that make this account yours.'
                  : selectedPanel === 'security'
                    ? 'Keep your sign-in details up to date.'
                    : 'Your next steps, and a little help when you need it.'
              }}
            </p>
          </div>
          <span class="status-badge" :class="{ pending: !accountUser.email_confirmed_at }"
            ><span></span
            >{{ accountUser.email_confirmed_at ? 'Verified account' : 'Unverified email' }}</span
          >
        </header>
        <button type="button" class="mobile-signout signout-link" :disabled="busy" @click="signOut">
          Sign out <Icon name="logout" />
        </button>
        <div v-if="selectedPanel === 'profile'" class="profile-banner">
          <span class="avatar avatar-large">{{ initials }}</span>
          <div>
            <strong>{{ displayName || 'Welcome to Avaraxia' }}</strong
            ><span>{{ accountUser.email }}</span>
          </div>
          <span class="member-label">MEMBER</span>
        </div>
        <section
          v-if="selectedPanel === 'profile'"
          class="settings-section"
          aria-labelledby="profile-heading"
        >
          <h3 id="profile-heading">Personal information</h3>
          <p class="form-note">Choose how you’d like to be known.</p>
          <form class="form-grid" @submit.prevent="saveProfile">
            <label
              >Display name<input
                v-model="displayName"
                maxlength="80"
                autocomplete="nickname"
                :disabled="!profileLoaded"
            /></label>
            <Button type="submit" :disabled="busy || !profileLoaded">{{
              busy && activeAction === 'profile' ? 'Saving…' : 'Save changes'
            }}</Button>
          </form>
        </section>
        <dl v-if="selectedPanel === 'profile'" class="account-details">
          <div>
            <dt>Member since</dt>
            <dd>{{ formatDate(accountUser.created_at) }}</dd>
          </div>
          <div>
            <dt>Last sign in</dt>
            <dd>{{ formatDate(accountUser.last_sign_in_at) }}</dd>
          </div>
        </dl>
        <section
          v-if="selectedPanel === 'security'"
          class="settings-section"
          aria-labelledby="email-heading"
        >
          <h3 id="email-heading">Email address</h3>
          <div class="current-email">
            <span>Current email</span><strong>{{ accountUser.email }}</strong>
          </div>
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
        <section
          v-if="selectedPanel === 'security'"
          class="settings-section"
          aria-labelledby="security-heading"
        >
          <h3 id="security-heading">Password &amp; security</h3>
          <p class="form-note">
            We’ll send a secure reset link to {{ accountUser.email }} so you can choose a new
            password.
          </p>
          <Button
            variant="secondary"
            :disabled="busy || !accountUser.email"
            @click="sendPasswordReset"
            >{{ activeAction === 'password' ? 'Sending…' : 'Send password reset email' }}</Button
          >
        </section>
        <section
          v-if="selectedPanel === 'support'"
          class="settings-section"
          aria-labelledby="access-heading"
        >
          <h3 id="access-heading">Early access</h3>
          <p class="form-note">
            Your account and waitlist registration are separate.
            <RouterLink to="/#waitlist">Join the waitlist</RouterLink> for early access.
          </p>
        </section>
        <section
          v-if="selectedPanel === 'support'"
          class="settings-section"
          aria-labelledby="help-heading"
        >
          <h3 id="help-heading">Help &amp; privacy</h3>
          <p class="form-note">
            Need help with your account or want to request removal of your data?
            <RouterLink to="/contact">Contact us</RouterLink>. Read our
            <RouterLink to="/privacy">privacy notice</RouterLink>.
          </p>
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
.signout-link.mobile-signout {
  display: none;
}
.account-hero.is-signed-in {
  padding-top: 64px;
  padding-bottom: 36px;
}
.account-hero.is-signed-in h1 {
  font-size: clamp(32px, 4vw, 48px);
  letter-spacing: -2px;
  max-width: none;
}
.account-hero.is-signed-in .lead {
  font-size: 15px;
  margin-top: 14px;
}
.heading-dot {
  color: var(--mint);
}
.account-section.settings-layout {
  max-width: 1180px;
  display: grid;
  grid-template-columns: 256px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
}
.settings-sidebar {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #10182a;
  overflow: hidden;
}
.sidebar-identity {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border-bottom: 1px solid var(--line);
}
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
  border-radius: 14px;
  background: linear-gradient(135deg, #69f0c028, #a89bff24);
  border: 1px solid #69f0c035;
  color: #a6f8db;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 1px;
}
.sidebar-identity strong {
  font-size: 15px;
  overflow-wrap: anywhere;
  max-width: 100%;
}
.sidebar-identity > span:last-child {
  font-size: 12px;
  color: var(--muted);
  overflow-wrap: anywhere;
  max-width: 100%;
}
.settings-nav {
  display: grid;
  gap: 6px;
  padding: 18px 12px;
}
.settings-nav button {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 13px 14px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: #9eabc2;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.15s,
    color 0.15s;
}
.settings-nav button:hover {
  background: #ffffff05;
  color: #f5f7fb;
}
.settings-nav button.selected {
  color: var(--mint);
  background: #69f0c00c;
  border-color: #69f0c01c;
}
.settings-nav .icon {
  width: 18px;
  height: 18px;
}
.nav-arrow {
  margin-left: auto;
  font-size: 19px;
}
.sidebar-bottom {
  padding: 24px;
  margin-top: 40px;
  border-top: 1px solid var(--line);
}
.workspace-label {
  font-size: 9px;
  letter-spacing: 2px;
  color: #7e8da8;
}
.sidebar-bottom p {
  font-size: 15px;
  color: #d0d8e7;
  line-height: 1.6;
  margin: 12px 0 26px;
}
.signout-link {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  background: #ffffff03;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px 14px;
  color: #c7d2e5;
  font-size: 12px;
  cursor: pointer;
}
.signout-link:hover:not(:disabled) {
  color: #fff;
  background: #ffffff09;
  border-color: #c8d5ff40;
}
.signout-link .icon {
  width: 16px;
  height: 16px;
}
.signout-link:disabled {
  opacity: 0.5;
  cursor: wait;
}
.form-card.settings-content {
  min-width: 0;
  padding: 32px;
  background: #111a2c;
  border-radius: 16px;
  min-height: 580px;
}
.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 26px;
  border-bottom: 1px solid var(--line);
}
.panel-kicker {
  font-size: 9px;
  letter-spacing: 2px;
  color: #7e8da8;
  margin: 0 0 10px;
}
.panel-heading h2 {
  font-size: 25px;
  letter-spacing: -0.7px;
  margin: 0;
}
.panel-heading > div > p:last-child {
  font-size: 13px;
  color: var(--muted);
  margin: 10px 0 0;
  line-height: 1.6;
}
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  white-space: nowrap;
  font-size: 10px;
  color: #8fe5bc;
  background: #69f0c00a;
  border: 1px solid #69f0c024;
  border-radius: 6px;
}
.status-badge > span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}
.status-badge.pending {
  color: #edc87b;
}
.profile-banner {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 26px 0 0;
}
.avatar-large {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  margin: 0;
  font-size: 22px;
}
.profile-banner > div {
  min-width: 0;
  display: grid;
  gap: 7px;
}
.profile-banner strong {
  font-size: 16px;
  overflow-wrap: anywhere;
}
.profile-banner > div > span {
  font-size: 12px;
  color: var(--muted);
  overflow-wrap: anywhere;
}
.member-label {
  margin-left: auto;
  font-size: 9px;
  letter-spacing: 1.5px;
  color: #8090ab;
}
.settings-content .settings-section {
  margin-top: 28px;
  padding-top: 24px;
}
.settings-content h3 {
  font-size: 15px;
  font-weight: 550;
}
.settings-content .form-note {
  font-size: 12px;
  line-height: 1.8;
  margin: 8px 0 18px;
  color: var(--muted);
}
.settings-content .form-grid {
  margin-top: 18px;
  gap: 18px;
}
.settings-content label {
  font-size: 12px;
}
.settings-content input {
  padding: 13px 15px;
  border-radius: 8px;
  min-height: 48px;
  font-size: 14px;
  background: #0b1323;
  border-color: #a0b4dd28;
}
.settings-content input:focus {
  border-color: var(--mint);
  outline: 2px solid #69f0c018;
  outline-offset: 1px;
}
.settings-content .btn {
  justify-self: start;
  min-height: 40px;
  padding: 11px 20px;
  border-radius: 8px;
  font-size: 12px;
}
.settings-content .account-details {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #0c1424;
  margin-top: 32px;
}
.settings-content .account-details dt {
  font-size: 11px;
}
.settings-content .account-details dd {
  font-size: 13px;
}
.current-email {
  display: grid;
  gap: 8px;
  padding: 16px;
  background: #0b1323;
  border: 1px solid var(--line);
  border-radius: 8px;
  margin: 20px 0;
  overflow-wrap: anywhere;
}
.current-email span {
  font-size: 11px;
  color: var(--muted);
}
.current-email strong {
  font-size: 13px;
  font-weight: 500;
}
.settings-content > .form-error,
.settings-content > .form-notice {
  padding: 14px 16px;
  border-radius: 8px;
  margin-top: 24px;
  font-size: 13px;
  line-height: 1.6;
}
.settings-content > .form-notice {
  background: #69f0c00c;
  border: 1px solid #69f0c026;
}
.settings-content > .form-error {
  background: #ff6b6b0c;
  border: 1px solid #ff6b6b26;
}
@media (max-width: 800px) {
  .account-section.settings-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .signout-link.mobile-signout {
    display: flex;
    width: auto;
    margin: 16px 0 0 auto;
  }
  .sidebar-identity,
  .sidebar-bottom {
    display: none;
  }
  .settings-nav {
    display: flex;
    padding: 8px;
    gap: 4px;
  }
  .settings-nav button {
    justify-content: center;
    padding: 12px 8px;
    font-size: 12px;
  }
  .nav-arrow {
    display: none;
  }
  .form-card.settings-content {
    min-height: 0;
  }
}
@media (max-width: 520px) {
  .form-card.settings-content {
    padding: 22px 18px;
  }
  .panel-heading {
    flex-direction: column;
  }
  .member-label {
    display: none;
  }
  .settings-nav button {
    gap: 7px;
    font-size: 11px;
  }
  .settings-nav .icon {
    width: 15px;
    height: 15px;
  }
  .settings-content .btn {
    width: 100%;
  }
}

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
