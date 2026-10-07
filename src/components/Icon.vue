<script setup lang="ts">
defineProps<{ name?: string }>()
</script>
<template>
  <svg
    class="icon"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'arrow'"><path d="M5 12h14m-6-6 6 6-6 6" /></template>
    <template v-else-if="name === 'team'">
      <circle cx="12" cy="7" r="3" />
      <path d="M6 21v-3a6 6 0 0 1 12 0v3M3 6a3 3 0 0 0 0 6m18-6a3 3 0 0 1 0 6M2 20v-3m20 3v-3" />
    </template>
    <template v-else-if="name === 'voice'"><path d="M4 4h16v12H9l-5 4V4m4 4h8m-8 4h5" /></template>
    <template v-else-if="name === 'play'">
      <rect x="3" y="4" width="18" height="16" rx="4" />
      <path d="m10 8 6 4-6 4V8Z" />
    </template>
    <template v-else-if="name === 'route' || name === 'paths'">
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="6" r="2" />
      <path d="M5 16V9a3 3 0 0 1 6 0v6a3 3 0 0 0 6 0V8" />
    </template>
    <template v-else-if="name === 'repeat'">
      <path d="M4 9a8 8 0 0 1 14-3l2 2m0-5v5h-5M20 15a8 8 0 0 1-14 3l-2-2m0 5v-5h5" />
    </template>
    <template v-else-if="name === 'spark'">
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" />
    </template>
    <template v-else>
      <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
      <circle cx="12" cy="12" r="4" />
    </template>
  </svg>
</template>
