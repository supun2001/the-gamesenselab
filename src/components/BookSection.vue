<script setup>
import ExternalLink from './ExternalLink.vue'
import { artwork, links } from '../config/links'
const features = [
  'H.A.N.Z.O. Framework',
  '30 human behaviour patterns',
  'Identify and counter behaviours',
  'Replay analysis',
  'Decision-making exercises',
  '30-day game-sense programme',
]
</script>
<template>
  <section id="book" class="section container book-layout">
    <div class="book-stage">
      <img
        v-if="artwork.book"
        :src="artwork.book"
        alt="READ THE PLAYER: The Psychology of Outsmarting Online Opponents, by Supun ‘Hanzo’ Hasanka"
        loading="lazy"
        width="591"
        height="844"
      />
      <div v-else class="book-preview" aria-label="Typographic preview of READ THE PLAYER">
        <span class="book-kicker">THE GAMESENSE LAB LIBRARY / 01</span>
        <div class="book-title">READ<br />THE<br /><span>PLAYER.</span></div>
        <p>THE PSYCHOLOGY OF<br />OUTSMARTING ONLINE OPPONENTS</p>
        <div class="book-rule"></div>
        <span class="book-bottom">UNDERSTAND THE MIND.<br />CHANGE THE GAME.</span
        ><span class="book-publisher">GAMESENSE LAB</span>
      </div>
      <span class="book-caption">A DIFFERENT KIND OF PLAYBOOK.</span>
    </div>
    <div class="book-copy">
      <p class="eyebrow">02 / THE BOOK</p>
      <h2>Your next level<br />starts in your mind.</h2>
      <h3>READ THE PLAYER</h3>
      <p class="book-subtitle">The Psychology of Outsmarting Online Opponents</p>
      <p>
        A practical game-sense guide based on 9 years of competitive gaming experience. Learn to
        read opponent behaviour, recognise patterns, understand timing and make smarter decisions.
      </p>
      <ul class="book-features">
        <li v-for="feature in features" :key="feature">{{ feature }}</li>
      </ul>
      <ExternalLink class="button primary" :href="links.book" label="The book"
        >GET THE BOOK</ExternalLink
      >
      <p class="authenticity">
        “This is not random AI-generated gaming advice. The ideas, examples and frameworks are based
        on my own competitive gaming experience. AI was only used for some visual artwork.”
      </p>
    </div>
  </section>
</template>
