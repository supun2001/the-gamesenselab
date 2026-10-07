<script setup lang="ts">
import { ref } from 'vue'
import { pricing } from '../config/site'
import BillingToggle from '../components/BillingToggle.vue'
import PricingCard from '../components/PricingCard.vue'
import Button from '../components/Button.vue'
const annual = ref(false)
</script>
<template>
  <section class="page-hero shell centre">
    <p class="eyebrow">A CLEARER PLAN FOR YOUR PRACTICE</p>
    <h1>Review with purpose.<br /><em>Choose your rhythm.</em></h1>
    <p class="lead">Planned launch pricing. Subscriptions are not yet available to purchase.</p>
    <div class="pricing-controls">
      <BillingToggle v-model="annual" /><span class="tiny">ALL PRICES IN USD</span>
    </div>
  </section>
  <section class="shell pricing-grid">
    <PricingCard
      name="Single Match"
      description="One review. A fresh perspective."
      :cents="pricing.single"
      single
    /><PricingCard
      v-for="plan in pricing.plans"
      :key="plan.name"
      :name="plan.name"
      :description="plan.description"
      :cents="annual ? plan.annualCents : plan.monthlyCents"
      :annual="annual"
      :equivalent-cents="plan.equivalentCents"
      :reviews="plan.reviews"
      :yearly-reviews="plan.yearlyReviews"
    />
  </section>
  <section class="shell pricing-notes">
    <p v-if="annual">
      <strong>Annual plans are paid upfront.</strong> Save 30% compared with 12 monthly payments,
      rounded to the nearest cent. The monthly equivalent is illustrative; it is not a monthly
      payment option.
    </p>
    <p>
      <strong>Proposed usage rule:</strong> {{ pricing.usageRule }} Final usage terms will be
      confirmed before sales open.
    </p>
    <p>
      No payment is collected here. Prices, supported matches and final review scope are subject to
      launch validation.
    </p>
  </section>
  <section class="shell compact-cta">
    <div>
      <p class="eyebrow">LOOKING FOR A TEAM PACKAGE?</p>
      <h2>Let’s understand what you need.</h2>
      <p>
        Team packages are being developed. Individual plans do not automatically include a full
        five-player team package.
      </p>
    </div>
    <Button to="/team-coaching#team-interest" variant="secondary" arrow
      >Register team interest</Button
    >
  </section>
</template>
