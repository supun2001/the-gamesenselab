<script setup lang="ts">
import { ref, watch } from 'vue'
import { accountReady, supabase, authLinkFailed } from '../lib/supabase'
import Button from '../components/Button.vue'

const checking = ref(true),
  confirmed = ref(false)
watch(
  accountReady,
  async (ready) => {
    if (!ready) return
    try {
      if (supabase && !authLinkFailed) {
        const { data, error } = await supabase.auth.getUser()
        confirmed.value = !error && !!data.user?.email_confirmed_at
      }
    } catch {
      confirmed.value = false
    } finally {
      checking.value = false
    }
  },
  { immediate: true },
)
</script>
<template>
  <section class="page-hero shell">
    <p class="eyebrow">YOUR AVARAXIA LABS ACCOUNT</p>
    <h1>Email <em>confirmation.</em></h1>
    <p class="lead">Your next step starts here.</p>
  </section>
  <section class="section shell auth-section">
    <div class="form-card">
      <p v-if="checking" role="status">Checking your email confirmation…</p>
      <template v-else-if="confirmed">
        <h2>Your email is confirmed</h2>
        <p role="status">Welcome to Avaraxia Labs. Your account is ready.</p>
        <Button to="/account">Continue to your account</Button>
        <p class="form-note">
          Your account and waitlist registration are separate.
          <RouterLink to="/#waitlist">Join the waitlist</RouterLink> for early access.
        </p>
      </template>
      <template v-else>
        <h2>We couldn’t confirm your email</h2>
        <p role="alert">
          Your confirmation link may have expired or already been used. Try signing in if you’ve
          already confirmed your email.
        </p>
        <Button to="/account">Go to sign in</Button>
      </template>
    </div>
  </section>
</template>
<style scoped>
.auth-section {
  max-width: 640px;
  padding-top: 0;
}
</style>
