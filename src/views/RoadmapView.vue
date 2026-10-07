<script setup lang="ts">
import { roadmap } from '../config/site'
import RoadmapStage from '../components/RoadmapStage.vue'
import Button from '../components/Button.vue'
</script>
<template>
  <section class="page-hero shell">
    <p class="eyebrow">OUR DIRECTION, IN THE OPEN</p>
    <h1>A thoughtful start.<br /><em>A long-term ambition.</em></h1>
    <p class="lead">
      Build. Test. Listen. Improve. Our roadmap starts with a working prototype and grows through
      evidence, not promises.
    </p>
    <div class="notice inline-notice">
      Directional and subject to change. These stages are relative to launch, not guaranteed release
      dates.
    </div>
  </section>
  <section class="shell roadmap-list">
    <RoadmapStage
      v-for="(stage, index) in roadmap"
      :key="stage.title"
      v-bind="stage"
      :index="index"
    />
  </section>
  <section class="shell compact-cta">
    <div>
      <p class="eyebrow">FOLLOW THE WORK</p>
      <h2>Be part of the next chapter.</h2>
    </div>
    <Button to="/#waitlist" arrow>Join the waitlist</Button>
  </section>
</template>
