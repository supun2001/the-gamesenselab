<script setup lang="ts">
import { nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import CookieControls from './components/CookieControls.vue'
const route = useRoute()
watch(
  () => route.path,
  async () => {
    await nextTick()
    document.getElementById('main')?.focus({ preventScroll: true })
  },
)
</script>
<template>
  <a class="skip-link" href="#main">Skip to content</a><SiteHeader />
  <main id="main" tabindex="-1"><RouterView /></main>
  <SiteFooter />
  <CookieControls />
</template>
