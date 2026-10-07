<script setup lang="ts">
defineProps<{ stage: string; title: string; status: string; items: string[]; index: number }>()
</script>
<template>
  <article class="roadmap-stage">
    <div class="roadmap-time">
      <span class="roadmap-dot" :class="{ active: index === 0 }"></span
      ><span class="eyebrow">{{ stage }}</span
      ><span class="tiny">{{ status }}</span>
    </div>
    <div class="roadmap-content">
      <h2>{{ title }}</h2>
      <ul>
        <li v-for="item in items" :key="item">{{ item }}</li>
      </ul>
    </div>
  </article>
</template>
