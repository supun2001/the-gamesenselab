<script setup lang="ts">
import { site } from '../config/site'
import Icon from './Icon.vue'
</script>
<template>
  <div class="demo-video">
    <video
      v-if="site.demoVideo"
      controls
      preload="metadata"
      :src="site.demoVideo"
      aria-label="Freya explanation video"
    ></video>
    <div v-else class="demo-poster">
      <div class="demo-orbit" aria-hidden="true"><Icon name="spark" /></div>
      <span class="eyebrow">A LOOK INSIDE FREYA</span>
      <h3>Every decision has a story.</h3>
      <p>Demo video coming soon</p>
      <span class="tiny">Our prototype walkthrough is in preparation.</span>
    </div>
  </div>
</template>
