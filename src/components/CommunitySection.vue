<script setup>
import ExternalLink from './ExternalLink.vue'
import { links } from '../config/links'
</script>
<template>
  <section id="community" class="community-section container">
    <span class="community-cross" aria-hidden="true">+</span>
    <p class="eyebrow">THE BEST IDEAS DON’T HAPPEN ALONE.</p>
    <h2>BUILD WITH US.</h2>
    <p>
      Join the GameSense Lab community, discuss game sense, share replays, follow development and
      help shape what we build.
    </p>
    <div class="button-row">
      <ExternalLink class="button primary" :href="links.discord" label="Discord"
        >JOIN DISCORD</ExternalLink
      ><ExternalLink class="button secondary" :href="links.whop" label="Whop"
        >VISIT WHOP</ExternalLink
      >
    </div>
    <span class="community-corner" aria-hidden="true">GSL / COMMUNITY</span>
  </section>
</template>
