<script setup lang="ts">
import { ref } from 'vue'
import Icon from './Icon.vue'
defineProps<{ interactive?: boolean }>()
const selected = ref(0)
const tabs = [
  {
    label: 'What happened',
    title: 'An early rotation. An open lane.',
    text: 'Visible in this example: players leave their positions after early pressure. The captured perspective does not confirm the opponent’s full commitment.',
    detail:
      'Observation: your team gave up map control before confirming the opponent’s commitment.',
  },
  {
    label: 'Why it mattered',
    title: 'Less information. Fewer options.',
    text: 'Leaving the lane reduced the team’s ability to confirm what happened next. A fake is one possible explanation, not a fact we can establish from this view.',
    detail:
      'Inference: the rotation may have made it easier for an opponent to take uncontested space.',
  },
  {
    label: 'A better option',
    title: 'Find a trigger before you move.',
    text: 'Hold information, communicate what is known and rotate with a clear trigger. The right response depends on the clock, resources and what teammates can confirm.',
    detail: 'Team focus: agree who confirms the rotation.',
  },
  {
    label: 'What to practise',
    title: 'One clear call. A shared response.',
    text: 'Review three rotation decisions together. For each, separate confirmed information from assumptions, name a rotation trigger and assign who will confirm it.',
    detail: 'Practice objective: make uncertainty explicit before committing.',
  },
]
function navigate(event: KeyboardEvent) {
  const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
  if (!keys.includes(event.key)) return
  event.preventDefault()
  selected.value =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? 3
        : (selected.value + (event.key === 'ArrowRight' ? 1 : 3)) % 4
  document.getElementById(`review-tab-${selected.value}`)?.focus()
}
</script>
<template>
  <div :class="['coaching-preview', { 'interactive-preview': interactive }]">
    <div class="preview-top">
      <span class="preview-brand"><Icon name="spark" /> FREYA <span>/ REVIEW</span></span
      ><span class="preview-indicator">Illustrative coaching preview</span>
    </div>
    <div
      class="tactical-board"
      role="img"
      aria-label="Illustrative tactical diagram showing a rotation path and unconfirmed space, not real match data"
    >
      <svg viewBox="0 0 540 260" fill="none" aria-hidden="true">
        <defs>
          <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M26 0H0v26" stroke="#ffffff" stroke-opacity=".04" />
          </pattern>
          <linearGradient id="trail" x1="80" y1="200" x2="420" y2="55">
            <stop stop-color="#69F0C0" />
            <stop offset="1" stop-color="#A89BFF" />
          </linearGradient>
        </defs>
        <rect width="540" height="260" fill="url(#grid)" />
        <path
          d="M45 210V50h135v50h175V44h140v170H355v-63H180v59H45Z"
          fill="#1a263c"
          stroke="#44506b"
        />
        <path
          d="M85 176V86h55v48h251V78h67v103h-63"
          stroke="#77849e"
          stroke-opacity=".4"
          stroke-width="2"
        />
        <path
          d="M110 174c80 60 76-113 205-50s72-60 114-34"
          stroke="url(#trail)"
          stroke-width="2"
          stroke-dasharray="6 5"
        />
        <circle cx="110" cy="174" r="22" fill="#69F0C0" fill-opacity=".07" />
        <circle cx="110" cy="174" r="7" fill="#69F0C0" />
        <circle cx="151" cy="184" r="5" fill="#69F0C0" />
        <circle cx="189" cy="163" r="5" fill="#69F0C0" />
        <circle cx="315" cy="124" r="6" fill="#A89BFF" />
        <circle cx="429" cy="90" r="21" stroke="#A89BFF" stroke-dasharray="3 5" />
        <text x="425" y="95" fill="#A89BFF" font-size="15">?</text>
        <text x="60" y="30" fill="#8f9eb7" font-size="9" letter-spacing="2">MAP CONTROL</text>
        <text x="365" y="240" fill="#8f9eb7" font-size="9" letter-spacing="2">
          UNCONFIRMED SPACE
        </text>
      </svg>
      <span class="board-caption"><span class="status-dot"></span> Situation: Early rotation</span>
    </div>
    <template v-if="interactive">
      <div
        class="review-tabs"
        role="tablist"
        aria-label="Explore a sample review"
        @keydown="navigate"
      >
        <button
          v-for="(tab, index) in tabs"
          :id="`review-tab-${index}`"
          :key="tab.label"
          role="tab"
          :aria-selected="selected === index"
          :tabindex="selected === index ? 0 : -1"
          :aria-controls="`review-panel-${index}`"
          @click="selected = index"
        >
          {{ tab.label }}
        </button>
      </div>
      <div
        :id="`review-panel-${selected}`"
        class="review-content"
        role="tabpanel"
        :aria-labelledby="`review-tab-${selected}`"
        tabindex="0"
      >
        <h3>{{ tabs[selected]!.title }}</h3>
        <p>{{ tabs[selected]!.text }}</p>
        <div class="practice-callout">{{ tabs[selected]!.detail }}</div>
      </div>
    </template>
    <div v-else class="preview-insights">
      <div>
        <span class="insight-label">01 / OBSERVATION</span>
        <p>Your team gave up map control before confirming the opponent’s commitment.</p>
      </div>
      <div>
        <span class="insight-label mint">02 / A BETTER OPTION</span>
        <p>Hold information, communicate what is known and rotate with a clear trigger.</p>
      </div>
      <div class="team-focus">
        <Icon name="team" />
        <p><span>Team focus</span>Agree who confirms the rotation.</p>
      </div>
    </div>
    <div class="preview-bottom">
      <span>Sample scenario · not a real match review</span><span aria-hidden="true">↗</span>
    </div>
  </div>
</template>
