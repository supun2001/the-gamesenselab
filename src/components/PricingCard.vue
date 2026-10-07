<script setup lang="ts">
import { money } from '../config/site'
import Button from './Button.vue'
defineProps<{
  name: string
  description: string
  cents: number
  annual?: boolean
  equivalentCents?: number
  reviews?: number
  yearlyReviews?: number
  single?: boolean
}>()
</script>
<template>
  <article :class="['pricing-card', { 'pricing-featured': name === 'Core' }]">
    <span class="eyebrow">{{
      single ? 'ONE REVIEW' : name === 'Core' ? 'BUILD YOUR HABIT' : 'GO DEEPER'
    }}</span>
    <h2>{{ name }}</h2>
    <p>{{ description }}</p>
    <div class="price">
      {{ money(cents) }}<span>{{ single ? '/ match' : annual ? '/ year' : '/ month' }}</span>
    </div>
    <p class="billing-detail">
      {{
        single
          ? 'One payment. No subscription.'
          : annual
            ? 'Billed upfront each year.'
            : 'Billed monthly once available.'
      }}
    </p>
    <p v-if="annual && !single" class="price-equivalent">
      Approximately {{ money(equivalentCents || 0) }} / month
    </p>
    <div class="review-allowance">
      {{ single ? '1 match review' : `${reviews} match reviews per month`
      }}<span v-if="annual && !single"
        >Up to {{ yearlyReviews }} reviews over the subscription year</span
      >
    </div>
    <ul v-if="!single" class="check-list">
      <li>Planned individual game-sense feedback</li>
      <li>Mistake explanations and practice suggestions</li>
      <li>Planned personal review history</li>
    </ul>
    <ul v-else class="check-list">
      <li>One supported match review</li>
      <li>Try coaching once it becomes available</li>
      <li>No recurring subscription</li>
    </ul>
    <Button to="/#waitlist" :variant="name === 'Core' ? 'primary' : 'secondary'" arrow
      >Join the waitlist</Button
    >
  </article>
</template>
