<script setup>
const areas = [
  'Peeking',
  'Rotations',
  'Positioning',
  'Utility usage',
  'Fight selection',
  'Timing',
  'Decision habits',
  'Opponent behaviour',
  'Game sense',
]
</script>
<template>
  <section id="ai-coach" class="section container">
    <div class="section-heading">
      <div>
        <p class="eyebrow">01 / THE AI COACH</p>
        <h2>Your gameplay.<br />Your decisions.<br /><span class="muted">Deeper insight.</span></h2>
      </div>
      <div class="section-intro">
        <span class="badge"><i class="status-dot"></i> IN DEVELOPMENT</span>
        <p>
          Your mechanics tell only half the story. We’re developing an AI coaching system to help
          you understand the decisions that shape your games.
        </p>
        <p>
          Starting with VALORANT, we’re exploring replay analysis that turns important moments into
          opportunities to learn.
        </p>
      </div>
    </div>
    <div class="insight-grid">
      <article class="insight-card">
        <span class="card-number">01 — OBSERVE</span>
        <div class="abstract-icon" aria-hidden="true">⌖</div>
        <h3>See beyond the scoreboard.</h3>
        <p>
          Explore the positioning, peeks, and utility choices behind important gameplay moments.
        </p>
      </article>
      <article class="insight-card">
        <span class="card-number">02 — UNDERSTAND</span>
        <div class="abstract-icon" aria-hidden="true">◎</div>
        <h3>Find the pattern.</h3>
        <p>
          Recognise repeated habits, read opponent behaviour, and understand why a decision matters.
        </p>
      </article>
      <article class="insight-card">
        <span class="card-number">03 — DEVELOP</span>
        <div class="abstract-icon" aria-hidden="true">↗</div>
        <h3>Build better instincts.</h3>
        <p>
          Bring more intention to your next game with insights designed around your decision-making.
        </p>
      </article>
    </div>
    <div class="analysis-areas">
      <span class="small-label">PLANNED ANALYSIS</span>
      <div>
        <span v-for="area in areas" :key="area">{{ area }}</span>
      </div>
    </div>
  </section>
</template>
