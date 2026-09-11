<script setup>
import { foundations, practiceTopics, commonQuestions } from '../config/learning'
</script>

<template>
  <section id="learn" class="section learning-section" aria-labelledby="learning-title">
    <div class="container">
      <div class="section-heading">
        <div>
          <p class="eyebrow">THE VALORANT PLAYBOOK</p>
          <h2 id="learning-title">
            Build your game sense.<br /><span class="muted">One decision at a time.</span>
          </h2>
        </div>
        <div class="section-intro">
          <p>
            Learn how to get better at VALORANT with practical starting points for decision making,
            positioning, rotations and VOD review.
          </p>
          <p>Try these ideas in your own games today. Our AI coach is still in development.</p>
        </div>
      </div>
      <div class="learning-grid">
        <article v-for="(topic, index) in foundations" :key="topic.title" class="learning-card">
          <span class="card-number">0{{ index + 1 }} / FOUNDATIONS</span>
          <h3>{{ topic.title }}</h3>
          <p>{{ topic.text }}</p>
        </article>
      </div>
      <div class="learning-deep-dives">
        <div
          v-for="group in [
            { title: 'Put it into practice', topics: practiceTopics },
            { title: 'Questions from the server', topics: commonQuestions },
          ]"
          :key="group.title"
        >
          <h3 class="learning-group-title">{{ group.title }}</h3>
          <details v-for="topic in group.topics" :key="topic.title" class="learning-topic">
            <summary>{{ topic.title }}</summary>
            <p>{{ topic.text }}</p>
          </details>
        </div>
      </div>
      <RouterLink class="text-link learning-cta" :to="{ path: '/', hash: '#waitlist' }"
        >FOLLOW THE AI COACH’S DEVELOPMENT <span aria-hidden="true">↗</span></RouterLink
      >
    </div>
  </section>
</template>

<style scoped>
.learning-section {
  background: #10130e;
  border-block: 1px solid var(--line);
}
.learning-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.learning-card {
  padding: 28px;
  border: 1px solid var(--line);
  background: var(--panel);
}
.learning-card h3 {
  margin: 18px 0 14px;
  line-height: 1.3;
}
.learning-card p,
.learning-topic p {
  font-size: 14px;
  margin-bottom: 0;
}
.learning-deep-dives {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 48px;
  margin-top: 48px;
}
.learning-group-title {
  color: var(--gold);
  margin-bottom: 20px;
}
.learning-topic {
  border-bottom: 1px solid var(--line);
}
.learning-topic summary {
  padding: 18px 4px;
  cursor: pointer;
  font-size: 15px;
  line-height: 1.5;
}
.learning-topic summary::marker {
  color: var(--gold);
}
.learning-topic summary:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}
.learning-topic p {
  padding: 0 4px 22px;
}
.learning-cta {
  margin-top: 32px;
  line-height: 1.6;
}
@media (max-width: 1000px) {
  .learning-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 800px) {
  .learning-deep-dives {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
@media (max-width: 560px) {
  .learning-grid {
    grid-template-columns: 1fr;
  }
  .learning-card {
    padding: 24px;
  }
}
</style>
