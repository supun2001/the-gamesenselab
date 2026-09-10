<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { registerWaitlistTool } from '../lib/webmcp'
import { supabase, configurationMessage } from '../lib/supabase'
import { games, waitlistPayload, validateWaitlist } from '../lib/validation'
const form = reactive({
  first_name: '',
  email: '',
  main_game: 'VALORANT',
  rank: '',
  valorant_name: '',
  valorant_tagline: '',
})
const loading = ref(false),
  error = ref(''),
  success = ref(false)
let unregister = () => {}
onMounted(() => {
  unregister = registerWaitlistTool(form)
})
onUnmounted(() => unregister())
async function submit() {
  if (loading.value) return
  error.value = validateWaitlist(form)
  if (error.value) return
  if (!supabase) {
    error.value = configurationMessage
    return
  }
  loading.value = true
  try {
    const { error: failure } = await supabase.from('waitlist').insert(waitlistPayload(form))
    if (failure) {
      error.value =
        failure.code === '23505'
          ? 'This email is already on the waitlist. You’re all set.'
          : 'We couldn’t save your place. Please try again shortly.'
      return
    }
    success.value = true
    unregister()
  } catch {
    error.value = 'We couldn’t connect. Check your connection and try again.'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <section id="waitlist" class="waitlist-section">
    <div class="container waitlist-layout">
      <div class="waitlist-copy">
        <p class="eyebrow">YOUR NEXT ADVANTAGE STARTS HERE</p>
        <h2>JOIN EARLY.<br />GET <span class="gold">3 MONTHS FREE.</span></h2>
        <p>
          Join the waitlist and stay with us until launch to receive your first 3 months of AI
          access free.
        </p>
        <ul class="benefit-list">
          <li>Weekly development updates</li>
          <li>Early feature previews</li>
          <li>Closed beta opportunities</li>
          <li>Help shape the product with your feedback</li>
        </ul>
        <span class="small-label">FIRST RELEASE: VALORANT <span class="gold">↗</span></span>
      </div>
      <div class="waitlist-panel">
        <div class="form-header">
          <span class="small-label">RESERVE YOUR PLACE</span
          ><span class="gold" aria-hidden="true">✳</span>
        </div>
        <div v-if="success" class="success-panel" role="status">
          <span class="success-check" aria-hidden="true">✓</span>
          <h3>You’re on the list.</h3>
          <p>You’re on the list. Welcome to the beginning of GameSense Lab.</p>
          <RouterLink class="button secondary" to="/signup">CREATE AN ACCOUNT ↗</RouterLink>
        </div>
        <form v-else @submit.prevent="submit" :aria-busy="loading" novalidate>
          <div class="form-grid">
            <label
              >First name <span>*</span
              ><input
                v-model="form.first_name"
                name="first_name"
                autocomplete="given-name"
                placeholder="Your first name"
                required
                maxlength="80" /></label
            ><label
              >Email address <span>*</span
              ><input
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                required
                maxlength="254" /></label
            ><label
              >Main game <span>*</span
              ><select v-model="form.main_game" name="main_game" required>
                <option v-for="game in games" :key="game">{{ game }}</option>
              </select></label
            ><label
              >Current rank <span class="optional">(optional)</span
              ><input v-model="form.rank" name="rank" placeholder="e.g. Diamond 2" maxlength="80"
            /></label>
            <template v-if="form.main_game === 'VALORANT'">
              <label
                >VALORANT name <span class="optional">(optional)</span>
                <input
                  v-model="form.valorant_name"
                  name="valorant_name"
                  placeholder="e.g. Hanzo"
                  maxlength="80"
                  autocomplete="off"
                  aria-describedby="riot-id-hint"
                />
              </label>
              <label
                >Tagline <span class="optional">(optional)</span>
                <input
                  v-model="form.valorant_tagline"
                  name="valorant_tagline"
                  placeholder="e.g. #EUW"
                  maxlength="33"
                  autocomplete="off"
                  autocapitalize="off"
                  spellcheck="false"
                  aria-describedby="riot-id-hint"
                />
              </label>
            </template>
          </div>
          <p v-if="form.main_game === 'VALORANT'" id="riot-id-hint" class="form-note">
            Your Riot ID is your name + #tagline, for example Hanzo#EUW. Enter both fields or leave
            both blank.
          </p>
          <p v-if="error" class="form-error" role="alert">{{ error }}</p>
          <button class="button primary full-width" :disabled="loading">
            {{ loading ? 'SAVING YOUR PLACE…' : 'JOIN THE WAITLIST' }}
            <span aria-hidden="true">↗</span>
          </button>
          <p class="form-note">
            By joining, you agree to receive waitlist and development emails. Unsubscribe at any
            time. Read our <RouterLink to="/privacy">Privacy Policy</RouterLink>.
          </p>
        </form>
      </div>
    </div>
  </section>
</template>
