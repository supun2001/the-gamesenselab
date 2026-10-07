<script setup lang="ts">
import Button from '../components/Button.vue'
const founders = [
  {
    name: 'Supun',
    initial: 'S',
    role: 'Product & coaching',
    text: 'Product vision, coaching methodology, marketing and business strategy.',
  },
  {
    name: 'Sandeepa',
    initial: 'S',
    role: 'Engineering',
    text: 'Technical development and engineering.',
  },
  {
    name: 'Zohiab',
    initial: 'Z',
    role: 'Business & strategy',
    text: 'Business management, marketing and strategy.',
  },
]
</script>
<template>
  <section class="page-hero shell">
    <p class="eyebrow">THIS IS ALTHEIA</p>
    <h1>Built around how players think<br /><em>and teams improve.</em></h1>
    <p class="lead">
      We bring competitive gaming experience, software engineering and business strategy together
      around one question: how can we make learning from a game more useful?
    </p>
  </section>
  <section class="section shell about-story">
    <p class="eyebrow">OUR POINT OF VIEW</p>
    <div>
      <h2>The result is only<br /><em>part of the story.</em></h2>
      <p>
        A good decision can end in a lost fight. A bad habit can hide behind a win. Improvement
        starts when we look beyond the outcome and understand the choices that created it.
      </p>
      <p>
        We’re building Freya to help players reflect on those choices—and to help teams build a
        shared understanding. Our working prototype is a beginning. Testing with real people will
        shape what comes next.
      </p>
    </div>
  </section>
  <section class="section tinted">
    <div class="shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">THE PEOPLE BEHIND THE WORK</p>
          <h2>Different perspectives.<br />A shared direction.</h2>
        </div>
        <p>A small founding team focused on building a useful, thoughtful coaching experience.</p>
      </div>
      <div class="founder-grid">
        <article v-for="founder in founders" :key="founder.name" class="founder-card">
          <div class="founder-avatar" aria-hidden="true">{{ founder.initial }}</div>
          <span class="eyebrow">{{ founder.role }}</span>
          <h3>{{ founder.name }}</h3>
          <p>{{ founder.text }}</p>
        </article>
      </div>
    </div>
  </section>
  <section class="shell compact-cta">
    <div>
      <p class="eyebrow">LET’S TALK</p>
      <h2>A question, an idea, a different perspective?</h2>
    </div>
    <Button to="/contact" variant="secondary" arrow>Get in touch</Button>
  </section>
</template>
