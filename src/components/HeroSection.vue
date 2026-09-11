<script setup>
import ExternalLink from './ExternalLink.vue'
import { links, artwork } from '../config/links'
</script>
<template>
  <section class="hero" aria-labelledby="hero-title">
    <div
      class="hero-art"
      :style="artwork.banner ? { backgroundImage: `url(${artwork.banner})` } : {}"
      role="img"
      aria-label="A solitary competitor in a dark, cinematic tactical environment"
    ></div>
    <div class="hero-grid"></div>
    <div class="container hero-inner">
      <div class="eyebrow">
        <span class="status-dot"></span> THE NEXT CHAPTER OF COMPETITIVE GAMING
      </div>
      <p class="hero-brand">GAMESENSE LAB</p>
      <h1 id="hero-title">PLAY<br /><span>SMARTER.</span></h1>
      <h2>AI-Powered Gameplay Coaching Is Coming.</h2>
      <p class="hero-description">
        We’re building AI-powered coaching to help you improve game sense in VALORANT, understand
        your decision making, and review positioning, rotations and utility usage in your gameplay.
      </p>
      <div class="button-row">
        <RouterLink class="button primary" :to="{ path: '/', hash: '#waitlist' }"
          >JOIN THE WAITLIST <span aria-hidden="true">↗</span></RouterLink
        ><ExternalLink class="button secondary" :href="links.discord" label="Our community"
          >JOIN THE COMMUNITY</ExternalLink
        >
      </div>
      <div class="hero-footnote">
        <span class="tiny-cross">+</span> Read the Player. Understand the Decision.<br
          class="mobile-only"
        />
        Build Better Game Sense.
      </div>
      <div class="hero-coordinate" aria-hidden="true">GSL / PROJECT 001 <span>EST. 2026</span></div>
    </div>
    <div class="hero-side-label" aria-hidden="true">INTELLIGENCE IS YOUR ADVANTAGE —</div>
    <div class="hero-bottom">
      <span><i class="status-dot"></i> IN DEVELOPMENT</span><span>BUILT FOR THE WAY YOU THINK.</span
      ><a href="#/#ai-coach" aria-label="Explore the AI coach">SCROLL TO EXPLORE ↓</a>
    </div>
  </section>
  <div class="release-strip">
    <span class="eyebrow">FIRST RELEASE</span
    ><strong><span class="valorant-mark" aria-hidden="true">Ⅴ</span> VALORANT</strong
    ><span class="release-divider"></span>
    <p>Better decisions. A different kind of advantage.</p>
    <span class="small-label">THE GAME STARTS IN YOUR MIND <span class="gold">↗</span></span>
  </div>
</template>
