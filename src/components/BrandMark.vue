<script setup>
import { artwork } from '../config/links'
</script>
<template>
  <span class="brand"
    ><img v-if="artwork.logo" :src="artwork.logo" alt="" class="brand-symbol" /><svg
      v-else
      class="brand-symbol"
      viewBox="0 0 44 44"
      aria-hidden="true"
    >
      <path d="M32 9H15L5 22l10 13h19V21H22v6h5v2h-9l-5-7 5-7h14z" fill="currentColor" /></svg
    ><span>GAMESENSE<span class="brand-lab">LAB</span></span></span
  >
</template>
