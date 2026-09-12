<script setup>
import { consentVisible, analyticsConsent, chooseAnalytics } from '../lib/analytics-state'
</script>
<template>
  <section
    v-if="consentVisible"
    class="analytics-consent"
    aria-labelledby="analytics-consent-title"
  >
    <h2 id="analytics-consent-title">Your analytics choice</h2>
    <p>
      Allow Google Analytics to help us understand page visits and waitlist signups? Analytics
      cookies are optional. You can change your choice in Cookie settings.
    </p>
    <p v-if="analyticsConsent">
      Current choice: {{ analyticsConsent === 'accepted' ? 'allowed' : 'declined' }}.
    </p>
    <RouterLink to="/privacy">Read our Privacy Policy</RouterLink>
    <div class="button-row">
      <button type="button" class="button secondary" @click="chooseAnalytics('rejected')">
        DECLINE ANALYTICS
      </button>
      <button type="button" class="button secondary" @click="chooseAnalytics('accepted')">
        ALLOW ANALYTICS
      </button>
      <button
        v-if="analyticsConsent"
        type="button"
        class="button secondary"
        @click="consentVisible = false"
      >
        CLOSE
      </button>
    </div>
  </section>
</template>
<style scoped>
.analytics-consent {
  position: fixed;
  z-index: 50;
  bottom: 20px;
  right: 20px;
  width: min(540px, calc(100% - 40px));
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding: 24px;
  background: #11130f;
  border: 1px solid var(--gold);
  box-shadow: 0 8px 40px #0008;
}
.analytics-consent h2 {
  font-family: 'Barlow', sans-serif;
  font-size: 22px;
  line-height: 1.3;
  margin-bottom: 12px;
}
.analytics-consent p,
.analytics-consent > a {
  font-size: 13px;
}
.analytics-consent > a {
  color: var(--gold);
  text-decoration: underline;
}
.analytics-consent .button-row {
  margin-top: 18px;
  gap: 10px;
}
</style>
