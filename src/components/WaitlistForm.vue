<script setup>
import { computed, reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import { bookWaitlistOpen } from '../lib/book-waitlist'
import { bookPdfUrl } from '../config/book'
import { downloadBook } from '../lib/book-download'
import { analytics } from '../lib/analytics-state'
import { session, authReady } from '../lib/auth'
import { registerWaitlistTool } from '../lib/webmcp'
import { supabase, configurationMessage } from '../lib/supabase'
import { games, waitlistPayload, validateWaitlist } from '../lib/validation'
const props = defineProps({ modal: Boolean })
const bookRequested = computed(() => props.modal)
const hintId = computed(() => (props.modal ? 'book-riot-id-hint' : 'riot-id-hint'))
const downloading = ref(false)
const downloadMessage = ref('')
let attemptedDownload = false
async function getBook() {
  if (!success.value || downloading.value) return
  downloading.value = true
  downloadMessage.value = ''
  try {
    await downloadBook(bookPdfUrl)
    downloadMessage.value = 'Your PDF download has started. You can download it again below.'
  } catch (failure) {
    downloadMessage.value = failure.message || 'The download failed. Please try again.'
  } finally {
    downloading.value = false
  }
}
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
  success = ref(false),
  checking = ref(true)
watch([success, checking, bookRequested], ([joined, busy, requested]) => {
  if (joined && !busy && requested && !attemptedDownload) {
    attemptedDownload = true
    getBook()
  }
})
let identityVersion = 0
let unregister = () => {}
watch(
  () => [session.value?.user?.id, session.value?.user?.email],
  async () => {
    const version = ++identityVersion
    success.value = false
    attemptedDownload = false
    downloadMessage.value = ''
    error.value = ''
    checking.value = true
    await authReady
    if (version !== identityVersion) return
    form.email = session.value?.user?.email || ''
    try {
      if (supabase && session.value?.user) {
        const { data, error: failure } = await supabase.rpc('my_waitlist_status')
        if (version === identityVersion && !failure) success.value = data === true
      }
    } catch {
      // Keep signup available if the status check is temporarily unavailable.
    } finally {
      if (version === identityVersion) checking.value = false
    }
  },
  { immediate: true },
)
onMounted(() => {
  watch(
    [checking, success, bookWaitlistOpen],
    ([busy, joined, popupOpen]) => {
      unregister()
      unregister =
        !props.modal && !popupOpen && !busy && !joined ? registerWaitlistTool(form) : () => {}
    },
    { immediate: true },
  )
})
onUnmounted(() => {
  identityVersion++
  unregister()
})
async function submit() {
  if (loading.value || checking.value || success.value) return
  error.value = validateWaitlist(form)
  if (error.value) return
  if (!supabase) {
    error.value = configurationMessage
    return
  }
  loading.value = true
  const version = identityVersion
  try {
    const { error: failure } = await supabase.from('waitlist').insert(waitlistPayload(form))
    if (version !== identityVersion) return
    if (failure && failure.code !== '23505') {
      error.value = 'We couldn’t save your place. Please try again shortly.'
      return
    }
    success.value = true
    if (!failure) analytics.waitlistJoined()
    unregister()
  } catch {
    if (version === identityVersion)
      error.value = 'We couldn’t connect. Check your connection and try again.'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <section
    :id="modal ? undefined : 'waitlist'"
    :class="modal ? 'modal-waitlist' : 'waitlist-section'"
  >
    <div :class="modal ? 'modal-waitlist-layout' : 'container waitlist-layout'">
      <div v-if="!modal" class="waitlist-copy">
        <p class="eyebrow">YOUR NEXT ADVANTAGE STARTS HERE</p>
        <h2>JOIN EARLY.<br />GET <span class="gold">1 MONTH FREE.</span></h2>
        <p>
          Join the waitlist and stay with us until launch to receive your first 1 month of AI access
          free.
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
        <p v-if="bookRequested && !success" class="book-waitlist-message" role="status">
          Join the waiting list to get READ THE PLAYER. After you successfully join, your PDF will
          download automatically.
        </p>
        <div class="form-header">
          <span class="small-label">RESERVE YOUR PLACE</span
          ><span class="gold" aria-hidden="true">✳</span>
        </div>
        <div v-if="checking" class="success-panel" role="status" aria-live="polite">
          <p>Checking your waitlist status…</p>
        </div>
        <div v-else-if="success" class="success-panel" role="status">
          <span class="success-check" aria-hidden="true">✓</span>
          <h3>You’re on the list.</h3>
          <p>Your place is saved. We’ll email you with launch updates.</p>
          <div class="book-download-panel">
            <button
              v-if="bookPdfUrl"
              type="button"
              class="button primary"
              :disabled="downloading"
              @click="getBook"
            >
              {{ downloading ? 'DOWNLOADING…' : 'DOWNLOAD THE BOOK PDF' }}
            </button>
            <p v-else>The book PDF is being prepared. Your waitlist place is saved.</p>
            <p v-if="downloadMessage" role="status">{{ downloadMessage }}</p>
          </div>
          <RouterLink v-if="session" class="button secondary" to="/dashboard"
            >GO TO DASHBOARD ↗</RouterLink
          >
          <RouterLink v-else class="button secondary" to="/signup">CREATE AN ACCOUNT ↗</RouterLink>
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
                  :aria-describedby="hintId"
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
                  :aria-describedby="hintId"
                />
              </label>
            </template>
          </div>
          <p v-if="form.main_game === 'VALORANT'" :id="hintId" class="form-note">
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

<style scoped>
.modal-waitlist .waitlist-panel {
  padding: 0;
  border: 0;
  box-shadow: none;
}
.modal-waitlist .form-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
@media (max-width: 560px) {
  .modal-waitlist .form-grid {
    grid-template-columns: 1fr;
  }
}

.book-waitlist-message {
  border-left: 2px solid var(--gold);
  padding-left: 14px;
  color: #f0f0eb;
  font-size: 14px;
}
.book-download-panel {
  margin-block: 20px;
}
.book-download-panel p {
  margin-top: 12px;
}
</style>
