<script setup lang="ts">
import Icon from './Icon.vue'
import StatusBadge from './StatusBadge.vue'
defineProps<{ title: string; description: string; icon: string; status: string }>()
</script>
<template>
  <article class="feature-card">
    <Icon :name="icon" />
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <StatusBadge :status="status" />
  </article>
</template>
