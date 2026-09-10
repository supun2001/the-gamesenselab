<script setup>
import { ref } from 'vue'
defineProps({ href: String, label: String })
const notice = ref(false)
</script>
<template>
  <a v-if="href" :href="href" target="_blank" rel="noopener noreferrer"
    ><slot /> <span aria-hidden="true">↗</span></a
  ><span v-else class="unconfigured-link"
    ><button type="button" @click="notice = !notice" :aria-expanded="notice">
      <slot /> <span aria-hidden="true">↗</span></button
    ><span v-if="notice" class="link-notice" role="status"
      >{{ label || 'This link' }} is coming soon.</span
    ></span
  >
</template>
