<script setup lang="ts">
import { faq } from '../config/site'
import FAQAccordion from '../components/FAQAccordion.vue'
import Button from '../components/Button.vue'
</script>
<template>
  <section class="page-hero shell">
    <p class="eyebrow">A LITTLE MORE CLARITY</p>
    <h1>Good questions.<br /><em>Straight answers.</em></h1>
    <p class="lead">What we’re building, what’s still being tested and what you can expect next.</p>
  </section>
  <section class="shell faq-container"><FAQAccordion :items="faq" /></section>
  <section class="shell compact-cta">
    <div>
      <h2>Something else on your mind?</h2>
      <p>We’d like to hear from you.</p>
    </div>
    <Button to="/contact" arrow>Ask the team</Button>
  </section>
</template>
