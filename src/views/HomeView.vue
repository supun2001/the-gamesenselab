<script setup lang="ts">
import Button from '../components/Button.vue'
import Icon from '../components/Icon.vue'
import FeatureCard from '../components/FeatureCard.vue'
import DemoVideo from '../components/DemoVideo.vue'
import WaitlistSection from '../components/WaitlistSection.vue'
import { features, site } from '../config/site'
const values = [
  {
    icon: 'focus',
    title: 'Read the situation.',
    text: 'Understand positioning, timing, available information and likely options. Give every decision a little more context.',
  },
  {
    icon: 'paths',
    title: 'Understand the opponent.',
    text: 'Identify repeated behaviour and develop evidence-based reads. Notice a pattern without treating a prediction as a certainty.',
  },
  {
    icon: 'team',
    title: 'Act together.',
    text: 'Improve communication, trade timing, roles and coordinated decisions. Turn individual understanding into a shared plan.',
  },
]
</script>
<template>
  <section class="landing-hero" aria-labelledby="landing-title">
    <div class="landing-hero-art" aria-hidden="true"></div>
    <svg class="landing-trajectories" viewBox="0 0 780 300" fill="none" aria-hidden="true">
      <path
        d="M15 235C210 205 295 165 410 168s210-65 340-155"
        stroke="#69F0C0"
        stroke-width="1.4"
      />
      <path d="M60 245c210-80 330-12 500-93S710 104 775 64" stroke="#A89BFF" stroke-width="1.1" />
      <path
        d="M40 260c160-55 330-45 475-90S657 84 740 77"
        stroke="#A89BFF"
        stroke-opacity=".5"
        stroke-width="1"
      />
      <circle cx="750" cy="13" r="4" fill="#69F0C0" />
      <circle cx="560" cy="152" r="3" fill="#A89BFF" />
      <circle cx="775" cy="64" r="4" fill="#A89BFF" />
    </svg>
    <div class="shell landing-hero-inner">
      <div class="landing-copy">
        <p class="eyebrow">
          FREYA BY ALTHEIA <span class="landing-kicker-line" aria-hidden="true"></span> PROTOTYPE
          BUILT
        </p>
        <h1 id="landing-title">Meet Freya.</h1>
        <p>Your AI companion for game sense and teamwork.</p>
        <Button to="/#waitlist" arrow>Join the waitlist</Button>
        <span class="landing-status"><span class="status-dot"></span>{{ site.launch.stage }}</span>
      </div>
      <div class="landing-feature-row" aria-label="What Freya is being built to support">
        <article class="landing-feature-card">
          <span class="landing-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <h2>Decision-making</h2>
          <p>Turn complex situations<br />into clear next steps.</p>
        </article>
        <article class="landing-feature-card">
          <Icon name="team" />
          <h2>Team communication</h2>
          <p>Build better coordination<br />and stronger teams.</p>
        </article>
        <article class="landing-feature-card">
          <Icon name="play" />
          <h2>Match review</h2>
          <p>Find patterns, learn faster<br />and play with purpose.</p>
        </article>
      </div>
    </div>
  </section>
  <section id="perspective" class="section">
    <div class="shell problem-grid">
      <div>
        <p class="eyebrow">BEYOND THE SCOREBOARD</p>
        <h2>You can see the mistake.<br /><em>But do you understand the decision?</em></h2>
      </div>
      <div>
        <p class="lead">A lost round rarely starts with the last shot.</p>
        <p>
          You rotate on a guess. Take a fight without support. Repeat a habit you can’t quite
          explain. And your team leaves the review with five different ideas of what went wrong.
        </p>
        <div class="problem-tags">
          <span>Unclear calls</span><span>Missed opponent patterns</span
          ><span>Repeated mistakes</span><span>Reacting too early</span
          ><span>Unsupported fights</span>
        </div>
        <p>
          Freya is being developed to connect the moment to its context—and the insight to something
          you can actually practise.
        </p>
      </div>
    </div>
  </section>
  <section class="section value-section">
    <div class="shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">A MORE COMPLETE WAY TO IMPROVE</p>
          <h2>Better decisions.<br />Stronger teams.</h2>
        </div>
        <p>
          Not just what happened.<br />Why it mattered. What you could do next.<br />And how to do
          it together.
        </p>
      </div>
      <div class="value-grid">
        <article v-for="(value, index) in values" :key="value.title" class="value-card">
          <div class="value-top">
            <Icon :name="value.icon" /><span>0{{ index + 1 }}</span>
          </div>
          <h3>{{ value.title }}</h3>
          <p>{{ value.text }}</p>
        </article>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">FROM A MOMENT TO A METHOD</p>
          <h2>Reflect. Understand.<br /><em>Put it into practice.</em></h2>
        </div>
        <p>
          The prototype uses captured gameplay. Supported capture methods and review timing are
          subject to launch validation.
        </p>
      </div>
      <div class="steps-grid">
        <article
          v-for="(step, index) in [
            ['Capture supported gameplay.', 'Start with the decisions in your own play.'],
            ['Analyse decisions and context.', 'Consider the information available in the moment.'],
            ['Review relevant moments.', 'Connect explanations to what happened.'],
            ['Practise specific improvements.', 'Give your next session a clear focus.'],
          ]"
          :key="step[0]"
        >
          <span class="step-number">0{{ index + 1 }}</span>
          <h3>{{ step[0] }}</h3>
          <p>{{ step[1] }}</p>
        </article>
      </div>
      <p class="section-footnote">
        This is our intended review workflow. Gameplay analysis and uploads are not available on
        this website.
      </p>
    </div>
  </section>
  <section id="features" class="section feature-section">
    <div class="shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">WHAT WE’RE BUILDING</p>
          <h2>More context.<br /><em>More meaningful feedback.</em></h2>
        </div>
        <p>
          A working prototype is our starting point. These planned capabilities will be validated
          before public release.
        </p>
      </div>
      <div class="feature-grid">
        <FeatureCard v-for="feature in features" :key="feature.title" v-bind="feature" />
      </div>
    </div>
  </section>
  <section class="section">
    <div class="shell team-highlight">
      <div class="team-constellation" aria-hidden="true">
        <svg viewBox="0 0 460 320" fill="none">
          <circle
            cx="230"
            cy="160"
            r="115"
            stroke="#A89BFF"
            stroke-opacity=".2"
            stroke-dasharray="3 8"
          />
          <circle cx="230" cy="160" r="75" stroke="#69F0C0" stroke-opacity=".15" />
          <path
            d="M230 45 339 125 298 253 162 253 121 125 230 45ZM230 160 230 45M230 160 339 125M230 160 298 253M230 160 162 253M230 160 121 125"
            stroke="#69F0C0"
            stroke-opacity=".45"
          />
          <g fill="#151D32" stroke="#69F0C0">
            <circle cx="230" cy="45" r="22" />
            <circle cx="339" cy="125" r="22" />
            <circle cx="298" cy="253" r="22" />
            <circle cx="162" cy="253" r="22" />
            <circle cx="121" cy="125" r="22" />
          </g>
          <g fill="#69F0C0">
            <circle cx="230" cy="45" r="5" />
            <circle cx="339" cy="125" r="5" />
            <circle cx="298" cy="253" r="5" />
            <circle cx="162" cy="253" r="5" />
            <circle cx="121" cy="125" r="5" />
          </g>
          <circle cx="230" cy="160" r="30" fill="#69F0C0" fill-opacity=".08" />
          <path d="m230 145 5 10 10 5-10 5-5 10-5-10-10-5 10-5 5-10Z" stroke="#69F0C0" /></svg
        ><span>CONNECTED DECISIONS / SHARED PURPOSE</span>
      </div>
      <div>
        <p class="eyebrow">TEAM COACHING / PLANNED</p>
        <h2>Five players.<br /><em>One shared understanding.</em></h2>
        <p>
          Freya’s team-coaching vision goes beyond individual mistakes. It considers how
          communication, timing and shared decisions influence the whole round.
        </p>
        <Button to="/team-coaching" variant="text" arrow>Explore team coaching</Button>
      </div>
    </div>
  </section>
  <section class="section demo-section">
    <div class="shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">THE THINKING BEHIND THE COACHING</p>
          <h2>See how Freya thinks.</h2>
        </div>
        <p>
          A closer look at the decisions behind the game.<br />Our explanation video is on its way.
        </p>
      </div>
      <DemoVideo />
    </div>
  </section>
  <WaitlistSection />
</template>
