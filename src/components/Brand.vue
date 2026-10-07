<script setup lang="ts">
import { site } from '../config/site'
</script>
<template>
  <span class="brand"
    ><img
      v-if="site.wordmark"
      :src="site.wordmark"
      alt="Altheia"
      width="150"
      height="38"
    /><template v-else
      ><svg class="brand-mark" viewBox="0 0 48 42" width="40" height="36" aria-hidden="true">
        <defs>
          <linearGradient id="altheia-mint" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#8CFFD6" />
            <stop offset="1" stop-color="#4FE1BE" />
          </linearGradient>
          <linearGradient id="altheia-violet" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#CEC8FF" />
            <stop offset="1" stop-color="#917EF0" />
          </linearGradient>
        </defs>
        <path d="M3 34 16 10h10L13 34H3Z" fill="url(#altheia-mint)" />
        <path d="M28 10h7l11 24H36L28 16Z" fill="url(#altheia-violet)" />
        <path d="M19 6h11l-3 5H16l3-5Z" fill="#E4FBF5" />
        <path d="M19 25h14l3 7H15l4-7Z" fill="#0B1020" /></svg
      ><span>ALTHEIA</span></template
    ></span
  >
</template>
