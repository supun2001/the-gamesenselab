<script setup lang="ts">
import { reactive, ref } from 'vue'
import Button from './Button.vue'
import BotCheck from './BotCheck.vue'
import { games } from '../config/site'
const props = defineProps<{ kind: 'waitlist' | 'team' | 'contact' }>()
const data = reactive({
  email: '',
  game: '',
  role: '',
  marketingConsent: false,
  name: '',
  teamSize: 5,
  level: '',
  challenge: '',
  permission: false,
  category: 'General',
  message: '',
  website: '',
})
const token = ref(''),
  busy = ref(false),
  error = ref(''),
  success = ref(''),
  bot = ref<InstanceType<typeof BotCheck> | null>(null)
async function submit() {
  if (busy.value) return
  error.value = ''
  if (!token.value) {
    error.value = 'Complete the security check before submitting.'
    return
  }
  const common = { email: data.email, website: data.website, token: token.value }
  const payload =
    props.kind === 'waitlist'
      ? { ...common, marketingConsent: data.marketingConsent }
      : props.kind === 'team'
        ? {
            ...common,
            name: data.name,
            game: data.game,
            teamSize: Number(data.teamSize),
            level: data.level,
            challenge: data.challenge,
            permission: data.permission,
          }
        : { ...common, name: data.name, category: data.category, message: data.message }
  busy.value = true
  try {
    const response = await fetch(`/api/${props.kind}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    })
    const result = (await response.json()) as { message?: string }
    if (!response.ok)
      throw new Error(result.message || 'We couldn’t save your request. Please try again.')
    success.value = result.message || 'Your request has been received.'
  } catch (failure) {
    error.value =
      failure instanceof Error &&
      !['TypeError', 'SyntaxError', 'TimeoutError'].includes(failure.name)
        ? failure.message
        : 'We couldn’t reach the signup service. Your details are still here; please try again later.'
  } finally {
    busy.value = false
    bot.value?.reset()
  }
}
</script>
<template>
  <div v-if="success" class="form-success" role="status">
    <span class="success-symbol" aria-hidden="true">✓</span>
    <h3>Thank you for being here.</h3>
    <p>{{ success }}</p>
    <span class="tiny">Read the game. Rise together.</span>
  </div>
  <form v-else class="submission-form" @submit.prevent="submit" :aria-busy="busy">
    <div class="form-grid">
      <label v-if="kind !== 'waitlist'"
        >{{ kind === 'team' ? 'Contact name' : 'Name' }} <span>*</span
        ><input v-model="data.name" name="name" autocomplete="name" maxlength="100" required
      /></label>
      <label :class="{ 'full-row': kind === 'waitlist' }"
        >Email address <span>*</span
        ><input
          v-model="data.email"
          type="email"
          name="email"
          autocomplete="email"
          maxlength="254"
          required
          placeholder="you@example.com"
      /></label>
      <label v-if="kind === 'team'"
        >Game <span>*</span
        ><select v-model="data.game" required>
          <option value="">Select a game</option>
          <option v-for="game in games" :key="game">{{ game }}</option>
        </select></label
      >
      <template v-if="kind === 'team'"
        ><label
          >Team size <span>*</span
          ><input
            v-model="data.teamSize"
            type="number"
            min="2"
            max="100"
            step="1"
            required /></label
        ><label class="full-row"
          >Competitive level (optional)<input
            v-model="data.level"
            maxlength="100"
            placeholder="e.g. amateur league, ranked stack" /></label
        ><label class="full-row"
          >Main coaching challenge <span>*</span
          ><textarea
            v-model="data.challenge"
            maxlength="2000"
            rows="4"
            required
            placeholder="What would you like to work on together?"
          ></textarea></label
      ></template>
      <template v-if="kind === 'contact'"
        ><label class="full-row"
          >Enquiry category <span>*</span
          ><select v-model="data.category" required>
            <option
              v-for="category in [
                'General',
                'Team testing',
                'Creator partnership',
                'Business enquiry',
                'Privacy request',
              ]"
              :key="category"
            >
              {{ category }}
            </option>
          </select></label
        ><label class="full-row"
          >Message <span>*</span
          ><textarea v-model="data.message" maxlength="4000" rows="5" required></textarea></label
      ></template>
    </div>
    <div class="honeypot" aria-hidden="true">
      <label
        >Leave this field empty<input
          v-model="data.website"
          name="website"
          tabindex="-1"
          autocomplete="off"
      /></label>
    </div>
    <label v-if="kind === 'waitlist'" class="checkbox-label"
      ><input v-model="data.marketingConsent" type="checkbox" /><span
        >Email me occasional Freya product news and development updates from Avaraxia Labs. I can
        unsubscribe at any time.</span
      ></label
    >
    <label v-if="kind === 'team'" class="checkbox-label"
      ><input v-model="data.permission" type="checkbox" required /><span
        >I am authorised to contact Avaraxia Labs about this team enquiry. This declaration does not
        authorise the collection of teammates’ gameplay or voice recordings.</span
      ></label
    >
    <p class="form-note" v-if="kind === 'waitlist'">
      By joining, you ask Avaraxia Labs to store your email and notify you about early access. You
      can leave at any time. Read our <RouterLink to="/privacy">Privacy Notice</RouterLink> and
      <RouterLink to="/terms">Waitlist Terms</RouterLink>. Product news and other development
      updates are optional.
    </p>
    <p class="form-note" v-else>
      We use your details to respond to this enquiry. Please do not include passwords, sensitive
      information or other people’s personal details. Read our
      <RouterLink to="/privacy">Privacy Notice</RouterLink>.
    </p>
    <BotCheck ref="bot" :action="kind" @token="token = $event" />
    <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    <Button type="submit" :disabled="busy || !token" arrow>{{
      busy
        ? 'Sending…'
        : kind === 'waitlist'
          ? 'Join the waitlist'
          : kind === 'team'
            ? 'Register team interest'
            : 'Send enquiry'
    }}</Button>
    <p class="form-note">
      {{
        kind === 'contact'
          ? 'Your message is saved for the founders to review. No email dispatch is promised.'
          : 'No payment. No subscription. Just a place in what comes next.'
      }}
    </p>
  </form>
</template>
