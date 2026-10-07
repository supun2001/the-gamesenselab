<script setup lang="ts">
import Button from '../components/Button.vue'
import CoachingPreview from '../components/CoachingPreview.vue'
import FeatureCard from '../components/FeatureCard.vue'
import Icon from '../components/Icon.vue'
import { features } from '../config/site'
</script>
<template>
  <section class="page-hero shell">
    <p class="eyebrow">MEET FREYA / BY ALTHEIA</p>
    <h1>A little more context.<br /><em>A different way to grow.</em></h1>
    <p class="lead">
      Your gaming companion and coach, being built around the decisions that shape your play—and the
      people you play with.
    </p>
    <div class="button-row">
      <Button to="/#waitlist" arrow>Join the waitlist</Button
      ><span class="muted">Prototype built. Public access coming soon.</span>
    </div>
  </section>
  <section class="section shell">
    <div class="three-grid">
      <article
        class="editorial-card"
        v-for="(item, index) in [
          [
            'Companion',
            'A place to think things through.',
            'Approachable explanations, gaming support and reflection. Freya’s companion vision starts with helping you ask better questions about your own play.',
          ],
          [
            'Individual coaching',
            'Understand your own decisions.',
            'Positioning, fight selection, information gathering, timing and opponent reads. Planned review tools focus on your options and what you knew at the time.',
          ],
          [
            'Team coaching',
            'Connect the decisions.',
            'Shared information, coordinated actions, role clarity and communication. Planned team workflows look at how your decisions fit together.',
          ],
        ]"
        :key="item[0]"
      >
        <span class="eyebrow">0{{ index + 1 }} / {{ item[0] }}</span>
        <h2>{{ item[1] }}</h2>
        <p>{{ item[2] }}</p>
      </article>
    </div>
  </section>
  <section id="review" class="section tinted">
    <div class="shell review-layout">
      <div>
        <p class="eyebrow">EXPLORE AN EXAMPLE</p>
        <h2>See the moment.<br /><em>Understand the thinking.</em></h2>
        <p>
          This interactive sample shows the kind of reflection we’re working towards. Explore each
          step of the review.
        </p>
        <div class="notice">
          <Icon name="focus" />
          <p>
            Visible evidence and inference are different things. Freya should explain uncertainty,
            not claim access to hidden enemy information.
          </p>
        </div>
        <p class="tiny">
          Illustrative sample data. This is not a live product demonstration or a real match result.
        </p>
      </div>
      <CoachingPreview interactive />
    </div>
  </section>
  <section class="section shell">
    <div class="section-heading">
      <div>
        <p class="eyebrow">THE PRODUCT DIRECTION</p>
        <h2>Built for thoughtful improvement.</h2>
      </div>
      <p>Feature scope, supported games and review timing will be confirmed through testing.</p>
    </div>
    <div class="feature-grid">
      <FeatureCard v-for="feature in features" :key="feature.title" v-bind="feature" />
    </div>
  </section>
  <section class="shell compact-cta">
    <div>
      <p class="eyebrow">YOUR PERSPECTIVE MATTERS</p>
      <h2>Help us build a better companion.</h2>
    </div>
    <Button to="/#waitlist" arrow>Join the waitlist</Button>
  </section>
</template>
