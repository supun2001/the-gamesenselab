<script setup lang="ts">
import { site } from '../config/site'
</script>

<template>
  <span class="brand">
    <span class="brand-symbol" aria-hidden="true">
      <img :src="site.wordmark" alt="" width="84" height="84" />
    </span>
    <span class="brand-wordmark">AVARAXIA <small>LABS</small></span>
  </span>
</template>
