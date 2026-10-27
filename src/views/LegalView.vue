<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import policies from '../config/policies.json'
const route = useRoute()
const policy = computed(() => policies[route.path as keyof typeof policies] || policies['/privacy'])
function parts(text: string) {
  return text.split(/(https:\/\/[^\s]+|[\w.+-]+@[\w.-]+\.[a-z]{2,})/g).map((value) => {
    const address = value.replace(/[.,;]+$/, '')
    const href = address.startsWith('https://')
      ? address
      : address.includes('@')
        ? `mailto:${address}`
        : ''
    return { value, href, address, suffix: value.slice(address.length) }
  })
}
</script>
<template>
  <section class="page-hero shell legal-hero">
    <p class="eyebrow">AVARAXIA LABS / POLICIES</p>
    <h1>{{ policy.title }}</h1>
    <p class="lead">Policy version prepared {{ policy.date }}</p>
    <nav class="legal-nav" aria-label="Policies">
      <RouterLink to="/privacy">Privacy notice</RouterLink>
      <RouterLink to="/terms">Website and waitlist terms</RouterLink>
      <RouterLink to="/cookies">Cookies</RouterLink>
    </nav>
  </section>
  <article class="shell legal-content">
    <section v-for="section in policy.sections" :key="section.title">
      <h2>{{ section.title }}</h2>
      <p v-for="paragraph in section.paragraphs" :key="paragraph">
        <template v-for="(part, index) in parts(paragraph)" :key="index"
          ><template v-if="part.href"
            ><a :href="part.href">{{ part.address }}</a
            >{{ part.suffix }}</template
          ><template v-else>{{ part.value }}</template></template
        >
      </p>
      <ul v-if="section.bullets.length">
        <li v-for="bullet in section.bullets" :key="bullet">{{ bullet }}</li>
      </ul>
    </section>
  </article>
</template>
