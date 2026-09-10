<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { session } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { links } from '../config/links'
import ExternalLink from '../components/ExternalLink.vue'
const router = useRouter(),
  profile = ref(null),
  membership = ref(null),
  pending = ref(true),
  error = ref(''),
  loggingOut = ref(false)
watch(session, (value) => {
  if (!value) router.replace('/login')
})
onMounted(async () => {
  if (!session.value || !supabase) return
  try {
    const [userProfile, status] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('display_name')
        .eq('id', session.value.user.id)
        .maybeSingle(),
      supabase.rpc('my_waitlist_status'),
    ])
    profile.value = userProfile.data
    if (!status.error) membership.value = status.data
    if (userProfile.error || status.error)
      error.value = 'Some account details couldn’t load. Please refresh to try again.'
  } catch {
    error.value = 'We couldn’t load your account details. Please try again.'
  } finally {
    pending.value = false
  }
})
async function logout() {
  loggingOut.value = true
  error.value = ''
  try {
    const { error: failure } = await supabase.auth.signOut()
    if (failure) throw failure
    session.value = null
    await router.replace('/login')
  } catch {
    error.value = 'We couldn’t sign you out. Please try again.'
  } finally {
    loggingOut.value = false
  }
}
</script>
<template>
  <section v-if="session" class="container section dashboard">
    <div class="dashboard-heading">
      <div>
        <p class="eyebrow">YOUR GAMESENSE LAB</p>
        <h1>Welcome to GameSense Lab</h1>
        <p>
          <span class="gold">{{
            profile?.display_name || session.user.user_metadata?.display_name || 'Player'
          }}</span
          ><br />{{ session.user.email }}
        </p>
      </div>
      <button class="button secondary" @click="logout" :disabled="loggingOut">
        {{ loggingOut ? 'SIGNING OUT…' : 'LOGOUT' }} ↗
      </button>
    </div>
    <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    <div class="dashboard-grid">
      <article class="dashboard-card coach-card">
        <span class="badge">COMING SOON</span>
        <h2>AI Coach</h2>
        <p>Your gameplay. Your decisions. Deeper insight.</p>
        <p>
          Our first release is planned for VALORANT. Replay uploads and AI analysis are not
          available yet.
        </p>
      </article>
      <article class="dashboard-card">
        <span class="card-number">YOUR PLACE IN THE PROJECT</span>
        <h3>Waitlist Status</h3>
        <p role="status">
          {{
            pending
              ? 'Checking your waitlist status…'
              : membership === true
                ? 'You’re on the AI waitlist.'
                : membership === false
                  ? 'You haven’t joined with this verified email yet.'
                  : 'Your waitlist status is currently unavailable.'
          }}
        </p>
        <RouterLink
          v-if="membership === false"
          class="text-link"
          :to="{ path: '/', hash: '#waitlist' }"
          >JOIN THE WAITLIST ↗</RouterLink
        >
      </article>
      <article class="dashboard-card">
        <span class="card-number">FOLLOW THE BUILD</span>
        <h3>Development Updates</h3>
        <p>Follow the project from early research to launch.</p>
        <RouterLink class="text-link" :to="{ path: '/', hash: '#development' }"
          >VIEW UPDATES ↗</RouterLink
        >
      </article>
      <article class="dashboard-card">
        <span class="card-number">THE GAMESENSE LAB LIBRARY</span>
        <h3>READ THE PLAYER</h3>
        <p>The Psychology of Outsmarting Online Opponents.</p>
        <ExternalLink class="text-link" :href="links.book" label="The book"
          >GET THE BOOK</ExternalLink
        >
      </article>
      <article class="dashboard-card">
        <span class="card-number">BUILD WITH US</span>
        <h3>Discord Community</h3>
        <p>Discuss decisions, share replays, and help shape the project.</p>
        <ExternalLink class="text-link" :href="links.discord" label="Discord"
          >JOIN DISCORD</ExternalLink
        >
      </article>
    </div>
  </section>
</template>
