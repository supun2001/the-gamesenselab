<script setup>
import { consentVisible } from '../lib/analytics-state'
import BrandMark from './BrandMark.vue'
import ExternalLink from './ExternalLink.vue'
import { links, publisherDisclaimers } from '../config/links'
function backToTop() {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })
  document.getElementById('main')?.focus({ preventScroll: true })
}
</script>
<template>
  <footer class="site-footer container">
    <div class="footer-top">
      <RouterLink to="/"><BrandMark /></RouterLink>
      <p>Read the player. Change your game.</p>
      <a class="back-top" href="#main" @click.prevent="backToTop">BACK TO TOP ↑</a>
    </div>
    <div class="footer-links">
      <span>© 2026 GameSense Lab</span>
      <nav aria-label="Footer navigation">
        <button class="cookie-settings" type="button" @click="consentVisible = true">
          Cookie settings
        </button>
        <RouterLink to="/privacy">Privacy Policy</RouterLink
        ><RouterLink to="/terms">Terms</RouterLink
        ><ExternalLink :href="links.contact" label="Contact details">Contact</ExternalLink
        ><ExternalLink :href="links.discord" label="Discord">Discord</ExternalLink
        ><ExternalLink :href="links.instagram" label="Instagram">Instagram</ExternalLink
        ><ExternalLink :href="links.facebook" label="Facebook">Facebook</ExternalLink
        ><ExternalLink :href="links.whop" label="Whop">Whop</ExternalLink>
      </nav>
    </div>
    <p v-for="disclaimer in publisherDisclaimers" :key="disclaimer" class="disclaimer">
      {{ disclaimer }}
    </p>
  </footer>
</template>

<style scoped>
.cookie-settings {
  background: none;
  border: 0;
  padding: 0;
  color: inherit;
  font: inherit;
}
</style>
