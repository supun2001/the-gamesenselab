<script setup lang="ts">
import { ref } from 'vue'
import {
  accountReady,
  accountUser,
  passwordRecovery,
  supabase,
  authLinkFailed,
} from '../lib/supabase'
import Button from '../components/Button.vue'

const email = ref(''),
  password = ref(''),
  confirmation = ref('')
const busy = ref(false),
  done = ref(false),
  message = ref(''),
  error = ref('')
async function submit() {
  if (!supabase || busy.value) return
  error.value = ''
  message.value = ''
  const recovering = passwordRecovery.value && !!accountUser.value && !authLinkFailed
  if (recovering && password.value !== confirmation.value) {
    error.value = 'Passwords do not match. Please enter the same password in both fields.'
    return
  }
  busy.value = true
  try {
    if (recovering) {
      const result = await supabase.auth.updateUser({ password: password.value })
      if (result.error) throw result.error
      password.value = ''
      confirmation.value = ''
      passwordRecovery.value = false
      done.value = true
    } else {
      const result = await supabase.auth.resetPasswordForEmail(email.value.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (result.error) throw result.error
      message.value = 'If an account exists for this email, you’ll receive a password reset link.'
    }
  } catch {
    error.value = recovering
      ? 'Unable to update your password. Use at least 8 characters and try again, or request a new reset link.'
      : 'Unable to send a reset link. Please try again.'
  } finally {
    busy.value = false
  }
}
</script>
<template>
  <section class="page-hero shell">
    <p class="eyebrow">YOUR AVARAXIA LABS ACCOUNT</p>
    <h1>Reset your <em>password.</em></h1>
    <p class="lead">Get back to your account with a new password.</p>
  </section>
  <section class="section shell auth-section">
    <div class="form-card">
      <p v-if="!supabase" class="form-notice">
        Account access is being configured. Please check back soon.
      </p>
      <p v-else-if="!accountReady" role="status">Checking your reset link…</p>
      <template v-else-if="done">
        <h2>Password updated</h2>
        <p role="status">Your new password is ready to use.</p>
        <Button to="/account">Continue to your account</Button>
      </template>
      <template v-else>
        <h2>
          {{
            passwordRecovery && accountUser && !authLinkFailed
              ? 'Choose a new password'
              : 'Request a reset link'
          }}
        </h2>
        <p v-if="authLinkFailed" class="form-error" role="alert">
          This reset link is invalid or has expired. Request a new link below.
        </p>
        <form class="form-grid" @submit.prevent="submit">
          <template v-if="passwordRecovery && accountUser && !authLinkFailed">
            <label
              >New password<input
                v-model="password"
                type="password"
                required
                minlength="8"
                autocomplete="new-password"
            /></label>
            <label
              >Confirm new password<input
                v-model="confirmation"
                type="password"
                required
                minlength="8"
                autocomplete="new-password"
            /></label>
            <p class="form-note">Use at least 8 characters.</p>
          </template>
          <label v-else
            >Email address<input
              v-model="email"
              type="email"
              required
              maxlength="254"
              autocomplete="email"
          /></label>
          <Button type="submit" :disabled="busy">{{
            busy
              ? 'Please wait…'
              : passwordRecovery && accountUser && !authLinkFailed
                ? 'Update password'
                : 'Send reset link'
          }}</Button>
        </form>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <p v-if="message" class="form-notice" role="status">{{ message }}</p>
        <p class="form-note"><RouterLink to="/account">Back to your account</RouterLink></p>
      </template>
    </div>
  </section>
</template>
<style scoped>
.auth-section {
  max-width: 640px;
  padding-top: 0;
}
.form-grid {
  margin-top: 24px;
  grid-template-columns: 1fr;
}
</style>
