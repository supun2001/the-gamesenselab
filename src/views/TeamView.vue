<script setup lang="ts">
import Button from '../components/Button.vue'
import TeamInterestForm from '../components/TeamInterestForm.vue'
import Icon from '../components/Icon.vue'
const areas = [
  {
    title: 'Communication',
    icon: 'voice',
    intro: 'Make the next call useful.',
    items: [
      'Clear, relevant callouts',
      'Separate facts from guesses',
      'Avoid unnecessary information overload',
      'Agree on actionable calls',
      'Review missed or conflicting information',
    ],
  },
  {
    title: 'Team game sense',
    icon: 'focus',
    intro: 'Build a shared picture of the round.',
    items: [
      'Shared map understanding',
      'Agreed rotation triggers',
      'Evidence-based opponent tendencies',
      'Resource and utility planning',
      'Adapt after repeated opponent strategies',
    ],
  },
  {
    title: 'Coordination',
    icon: 'team',
    intro: 'Be ready for each other.',
    items: [
      'Trade spacing',
      'Entry and support timing',
      'Crossfires',
      'Utility sequencing',
      'Retake and post-plant roles',
    ],
  },
  {
    title: 'Team review',
    icon: 'repeat',
    intro: 'Work on the problem that matters.',
    items: [
      'Separate individual decisions from team-process problems',
      'Identify the most important recurring issue',
      'Set one focused practice objective',
      'Track that issue over later sessions',
    ],
  },
]
</script>
<template>
  <section class="page-hero shell">
    <p class="eyebrow">FREYA / TEAM COACHING</p>
    <h1>Coach the connections<br /><em>between players.</em></h1>
    <p class="lead">
      Strong teams need more than five individually skilled players. They need shared information,
      clear responsibilities and coordinated decisions.
    </p>
    <div class="button-row">
      <Button to="/team-coaching#team-interest" arrow>Register team interest</Button
      ><span class="status-badge">Planned team-coaching workflows</span>
    </div>
  </section>
  <section class="section shell">
    <div class="team-areas">
      <article v-for="(area, index) in areas" :key="area.title" class="team-area">
        <div class="area-heading">
          <Icon :name="area.icon" /><span class="tiny">0{{ index + 1 }}</span>
        </div>
        <h2>{{ area.title }}</h2>
        <p class="lead">{{ area.intro }}</p>
        <ul class="check-list">
          <li v-for="item in area.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </div>
  </section>
  <section class="section tinted">
    <div class="shell review-layout">
      <div>
        <p class="eyebrow">LESS BLAME. MORE UNDERSTANDING.</p>
        <h2>Review the process.<br /><em>Practise the connection.</em></h2>
        <p>
          Sometimes the problem is not the first player’s aim. It is whether the team was ready to
          support the entry at all.
        </p>
        <p>
          Deeper team analysis may require multiple player perspectives and consented communication
          recordings. One player’s video cannot reveal everything about the whole team.
        </p>
      </div>
      <article class="team-review">
        <span class="status-badge">Planned team-coaching example</span>
        <div
          v-for="[label, content] in [
            ['Observation', 'Two players entered before support utility was ready.'],
            ['Impact', 'The first player fought without the planned support.'],
            ['Practice', 'Agree on one readiness call and rehearse the entry sequence together.'],
          ]"
          :key="label"
        >
          <p class="eyebrow">{{ label }}</p>
          <h3>{{ content }}</h3>
        </div>
        <span class="tiny">Illustrative scenario, not a real team’s performance.</span>
      </article>
    </div>
  </section>
  <section id="team-interest" class="section shell waitlist-grid">
    <div>
      <p class="eyebrow">BUILD IT WITH YOUR TEAM</p>
      <h2>What does your team<br /><em>want to work on?</em></h2>
      <p class="lead">Tell us about your shared challenges and your interest in early testing.</p>
      <div class="notice">
        <p>
          Team packages are being developed. Individual subscriptions do not automatically include a
          full five-player team package.
        </p>
      </div>
      <p>
        We only need the team representative’s details. Please don’t send personal information about
        your teammates.
      </p>
    </div>
    <div class="form-card">
      <h3>Register team interest</h3>
      <TeamInterestForm />
    </div>
  </section>
</template>
