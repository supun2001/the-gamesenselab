<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
function focusMain() {
  document.getElementById('main')?.focus()
  document.getElementById('main')?.scrollIntoView()
}
</script>
<template>
  <a class="skip-link" href="#main" @click.prevent="focusMain">Skip to content</a><Navbar />
  <main id="main" tabindex="-1"><RouterView /></main>
  <Footer />
</template>
