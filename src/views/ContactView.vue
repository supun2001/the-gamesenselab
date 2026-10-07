<script setup lang="ts">
import SubmissionForm from '../components/SubmissionForm.vue'
</script>
<template>
  <section class="page-hero shell">
    <p class="eyebrow">START A CONVERSATION</p>
    <h1>Let’s build<br /><em>understanding.</em></h1>
    <p class="lead">
      A question about Freya, a team challenge or an idea for working together? Tell us what’s on
      your mind.
    </p>
  </section>
  <section class="section shell contact-layout">
    <div>
      <h2>One place to get in touch.</h2>
      <p>
        Use the form for general questions, team testing, creator partnerships, business enquiries
        or privacy requests.
      </p>
      <p>
        For a removal request, choose <strong>Privacy request</strong> and use the email associated
        with your registration. Please do not send passwords, payment details or teammates’ personal
        information.
      </p>
      <div class="notice">
        <p>
          We’re a pre-launch team. No response-time guarantee is offered. Messages are securely
          stored for the founders to review.
        </p>
      </div>
    </div>
    <div class="form-card">
      <h3>Send an enquiry</h3>
      <SubmissionForm kind="contact" />
    </div>
  </section>
</template>
