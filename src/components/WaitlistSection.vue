<script setup lang="ts">
import WaitlistForm from './WaitlistForm.vue'
</script>
<template>
  <section id="waitlist" class="section waitlist-section">
    <div class="shell waitlist-grid">
      <div>
        <p class="eyebrow">BE PART OF WHAT’S NEXT</p>
        <h2>Help shape the next generation of <em>game coaching.</em></h2>
        <p class="lead">
          Join the waitlist for development updates and opportunities to take part in early testing.
        </p>
        <div class="waitlist-note">
          <span class="status-dot"></span> Built with players. Better together.
        </div>
      </div>
      <div class="form-card">
        <p class="eyebrow">YOUR NEXT CHAPTER</p>
        <h3>A place on the waitlist.</h3>
        <WaitlistForm />
      </div>
    </div>
  </section>
</template>
