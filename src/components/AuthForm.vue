<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase, configurationMessage } from '../lib/supabase'
import { session, authError } from '../lib/auth'
import { normalizeEmail, validateAuth } from '../lib/validation'
import { authErrorMessage } from '../lib/auth-errors'
import { signInVerified } from '../lib/verified-auth'
const props = defineProps({ signup: Boolean })
const router = useRouter()
const form = reactive({ display_name: '', email: '', password: '', confirm: '' })
const loading = ref(false),
  error = ref(''),
  success = ref(false)
async function submit() {
  if (loading.value) return
  authError.value = ''
  error.value = validateAuth(form, props.signup)
  if (error.value) return
  if (!supabase) {
    error.value = configurationMessage
    return
  }
  loading.value = true
  try {
    if (props.signup) {
      const { error: failure } = await supabase.auth.signUp({
        email: normalizeEmail(form.email),
        password: form.password,
        options: {
          data: { display_name: form.display_name.trim() },
          emailRedirectTo: new URL(import.meta.env.BASE_URL, window.location.origin).href,
        },
      })
      if (failure) throw failure
      success.value = true
      form.password = ''
      form.confirm = ''
    } else {
      session.value = await signInVerified(supabase, {
        email: normalizeEmail(form.email),
        password: form.password,
      })
      await router.replace('/dashboard')
    }
  } catch (failure) {
    error.value = authErrorMessage(failure, props.signup)
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="auth-layout container">
    <div class="auth-story">
      <p class="eyebrow">GAMESENSE LAB / MEMBERS</p>
      <h1>YOUR MIND.<br /><span class="gold">YOUR EDGE.</span></h1>
      <p>Read the Player. Understand the Decision.<br />Build Better Game Sense.</p>
      <span class="badge"><i class="status-dot"></i> AI COACH IN DEVELOPMENT</span>
    </div>
    <div class="auth-panel">
      <p class="eyebrow">{{ signup ? 'THE NEXT CHAPTER STARTS HERE' : 'GOOD TO SEE YOU AGAIN' }}</p>
      <h2>{{ signup ? 'Create your account.' : 'Welcome back.' }}</h2>
      <p>
        {{
          signup ? 'Join the beginning of GameSense Lab.' : 'Sign in to your GameSense Lab account.'
        }}
      </p>
      <div v-if="success" class="success-panel" role="status">
        <span class="success-check">✓</span>
        <h3>Check your email.</h3>
        <p>
          Check your inbox for a confirmation link before signing in. If you already have an
          account, sign in instead.
        </p>
        <RouterLink class="button primary" to="/login">CONTINUE TO SIGN IN ↗</RouterLink>
      </div>
      <form v-else @submit.prevent="submit" novalidate :aria-busy="loading">
        <label v-if="signup"
          >Display name<input
            v-model="form.display_name"
            name="display_name"
            autocomplete="nickname"
            maxlength="80"
            required
            placeholder="Your player name" /></label
        ><label
          >Email address<input
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            maxlength="254"
            required
            placeholder="you@example.com" /></label
        ><label
          >Password<input
            v-model="form.password"
            name="password"
            type="password"
            :autocomplete="signup ? 'new-password' : 'current-password'"
            :minlength="signup ? 8 : undefined"
            required
            :placeholder="signup ? 'At least 8 characters' : 'Your password'" /></label
        ><label v-if="signup"
          >Confirm password<input
            v-model="form.confirm"
            name="confirm_password"
            type="password"
            autocomplete="new-password"
            required
            placeholder="Repeat your password"
        /></label>
        <p v-if="error || authError" class="form-error" role="alert">{{ error || authError }}</p>
        <button class="button primary full-width" :disabled="loading">
          {{ loading ? 'PLEASE WAIT…' : signup ? 'CREATE ACCOUNT' : 'SIGN IN' }}
          <span aria-hidden="true">↗</span>
        </button>
        <p v-if="signup" class="form-note">
          By creating an account, you agree to our <RouterLink to="/terms">Terms</RouterLink> and
          acknowledge our <RouterLink to="/privacy">Privacy Policy</RouterLink>.
        </p>
      </form>
      <p class="auth-switch">
        {{ signup ? 'Already have an account?' : 'New to GameSense Lab?' }}
        <RouterLink :to="signup ? '/login' : '/signup'"
          >{{ signup ? 'Sign in' : 'Create an account' }} ↗</RouterLink
        >
      </p>
    </div>
  </div>
</template>
