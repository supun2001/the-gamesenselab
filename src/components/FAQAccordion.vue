<script setup lang="ts">
defineProps<{ items: string[][] }>()
</script>
<template>
  <div class="faq-list">
    <details v-for="(item, index) in items" :key="item[0]">
      <summary>
        <span class="faq-number">{{ String(index + 1).padStart(2, '0') }}</span
        ><span>{{ item[0] }}</span
        ><span class="faq-plus" aria-hidden="true">+</span>
      </summary>
      <p>{{ item[1] }}</p>
    </details>
  </div>
</template>
