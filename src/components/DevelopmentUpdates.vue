<script setup>
import { updates } from '../config/updates'
function dateLabel(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}
</script>
<template>
  <section id="development" class="development-section">
    <div class="container section">
      <div class="updates-heading">
        <div>
          <p class="eyebrow">03 / BEHIND THE BUILD</p>
          <h2>BUILDING IN PUBLIC.</h2>
        </div>
        <p>
          We share development updates every week so early members can follow the project from
          prototype to launch.
        </p>
      </div>
      <p class="sample-note">
        A preview of our development journal. Sample entries below will be replaced with real
        updates.
      </p>
      <div class="updates-grid">
        <article v-for="update in updates" :key="update.week" class="update-card">
          <img
            v-if="update.image"
            :src="update.image"
            :alt="update.title"
            loading="lazy"
            width="500"
            height="280"
          />
          <div class="update-top">
            <span>WEEK {{ update.week }}</span
            ><span class="update-status">{{ update.status }}</span>
          </div>
          <h3>{{ update.title }}</h3>
          <p>{{ update.description }}</p>
          <div class="update-bottom">
            <time v-if="update.date" :datetime="update.date">{{ dateLabel(update.date) }}</time
            ><span v-else>Date to be announced</span><span aria-hidden="true">↗</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
