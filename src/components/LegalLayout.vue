<script setup>
defineProps({
  title: String,
  sections: Array,
  updated: String,
  intro: Array,
  showNotice: { type: Boolean, default: true },
})
</script>
<template>
  <article class="legal-page container section">
    <p class="eyebrow">GAMESENSE LAB / {{ title }}</p>
    <h1>{{ title }}</h1>
    <p v-if="updated" class="legal-updated">Last updated: {{ updated }}</p>
    <div v-if="intro?.length" class="legal-intro">
      <p v-for="paragraph in intro" :key="paragraph">{{ paragraph }}</p>
    </div>
    <div v-if="showNotice" class="legal-notice">
      <strong>Starter template — not legal advice.</strong>
      <p>
        This page is a placeholder and must be completed and legally reviewed before production.
        Operator identity, contact information, and applicable policies remain to be confirmed.
      </p>
    </div>
    <section v-for="(section, i) in sections" :key="section.title">
      <h2>{{ String(i + 1).padStart(2, '0') }}. {{ section.title }}</h2>
      <p v-if="section.text">{{ section.text }}</p>
      <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
      <ul v-if="section.items?.length">
        <li v-for="item in section.items" :key="item">{{ item }}</li>
      </ul>
      <p v-if="section.after">{{ section.after }}</p>
      <p v-for="link in section.links" :key="link.href">
        <a :href="link.href">{{ link.label }}</a>
      </p>
    </section>
    <RouterLink class="text-link" to="/">← BACK TO HOME</RouterLink>
  </article>
</template>
