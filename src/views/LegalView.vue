<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '../config/site'
const route = useRoute()
const privacy = computed(() => route.path === '/privacy')
</script>
<template>
  <section class="page-hero shell legal-hero">
    <p class="eyebrow">DRAFT / FOUNDER REVIEW REQUIRED</p>
    <h1>{{ privacy ? 'Privacy notice.' : 'Terms of use.' }}</h1>
    <p class="lead">
      This page is a draft for review before public release. It has not been independently certified
      for legal compliance.
    </p>
  </section>
  <article class="shell legal-content">
    <div class="notice">
      <p>
        <strong>Release blockers:</strong> legal entity {{ site.legalName || '[to be confirmed]' }};
        business address {{ site.address || '[to be confirmed]' }}; privacy contact
        {{ site.privacyContact || '[to be confirmed]' }}; retention schedule
        {{ site.retentionPolicy || '[to be confirmed]' }}. The founders must complete and approve
        these details before enabling public forms.
      </p>
    </div>
    <template v-if="privacy"
      ><section>
        <h2>Information we collect</h2>
        <p>
          The waitlist requires an email address. Preferred game and individual/team status are
          optional. Optional development-update consent is recorded with its version and timestamp.
          A team enquiry also collects the representative’s name, game, team size, optional
          competitive level, coaching challenge and permission to contact them. The contact form
          collects name, email, category and message.
        </p>
      </section>
      <section>
        <h2>Why we use it</h2>
        <p>
          We use waitlist information to communicate about early access, team details to review
          testing interest, and enquiries to respond to the stated request. Optional development
          updates require a separate choice. Joining the waitlist does not grant permission for
          broader marketing. The founders must confirm the applicable lawful bases before
          publication.
        </p>
      </section>
      <section>
        <h2>How submissions are processed</h2>
        <p>
          Forms pass through a same-origin Cloudflare server endpoint. It validates the input,
          checks a Cloudflare Turnstile token, enforces rate limits and writes permitted fields to
          Supabase. Signup lists are not publicly readable. Duplicate waitlist entries receive the
          same response without overwriting an existing registration or consent choice.
        </p>
        <p>
          Cloudflare receives technical request information for hosting and bot checks. The rate
          limiter stores a keyed hash derived from the request IP or submitted email in short-lived
          counters; the application does not store the raw IP in signup records. Provider security
          logs are subject to their own settings. This website does not upload gameplay or send it
          to an AI provider.
        </p>
      </section>
      <section>
        <h2>Service providers and storage</h2>
        <p>
          Cloudflare provides hosting, server endpoints and Turnstile bot protection. Supabase
          stores submissions and rate-limit counters. Google Fonts serves the site’s typography and
          receives standard browser request information. No optional analytics, advertising trackers
          or user profiling SDKs are installed. The founders must review provider contracts, storage
          regions and international-transfer safeguards before release.
        </p>
      </section>
      <section>
        <h2>Retention</h2>
        <p>
          Registration and enquiry retention: [founders must specify purpose-based periods and
          deletion procedures]. Rate-limit counters expire after short request windows and are
          removed during subsequent rate-limit checks. Provider log retention: [confirm in provider
          settings]. Do not publish without an approved retention schedule.
        </p>
      </section>
      <section>
        <h2>Your choices and requests</h2>
        <p>
          You can decline development updates and still join the waitlist. To withdraw a consent
          choice, request access, correct information or request deletion, use the
          <RouterLink to="/contact">Contact form</RouterLink> and select Privacy request. Before
          public forms open, the founders must assign a monitored privacy contact and a process for
          verifying and handling requests.
        </p>
      </section>
      <section>
        <h2>Future features</h2>
        <p>
          Gameplay capture, voice analysis and deeper team review may require additional information
          and permissions. Before introducing these features, we will explain the actual data flow,
          consent requirements, providers and retention. No current website submission is sent to a
          model provider.
        </p>
      </section></template
    >
    <template v-else
      ><section>
        <h2>A pre-launch website</h2>
        <p>
          Altheia is developing Freya. A working prototype exists, but the public product is not yet
          available. This website provides information and collects interest. It does not currently
          perform gameplay analysis, sell subscriptions or process payments.
        </p>
      </section>
      <section>
        <h2>Waitlist and team interest</h2>
        <p>
          Registering interest does not guarantee admission, a release date, a particular feature or
          a subscription. Development updates are optional and separate from early-access contact.
          Team packages are being developed; individual plans do not automatically include a
          five-player team package.
        </p>
      </section>
      <section>
        <h2>Proposed pricing and usage</h2>
        <p>
          Prices are shown in USD and are planned launch prices, subject to validation. Annual
          examples involve an upfront yearly payment with monthly review allowances. The proposed
          usage rule is that allowances renew monthly and do not roll over. Sales terms, billing,
          taxes, cancellations and refund arrangements must be approved before any checkout is
          introduced. No free trial or free-access period is offered by this website.
        </p>
      </section>
      <section>
        <h2>Coaching and examples</h2>
        <p>
          Illustrative previews use sample scenarios. No coach can guarantee a rank increase. Freya
          is being developed to support learning and better decisions, with uncertainty made
          explicit. Supported features and modes will be evaluated against relevant game and
          platform rules before release.
        </p>
      </section>
      <section>
        <h2>Responsible use</h2>
        <p>
          Submit accurate contact information and only information you are authorised to share. Do
          not include sensitive credentials or other players’ personal details. Do not abuse or
          attempt to bypass the forms’ security controls.
        </p>
      </section>
      <section>
        <h2>Founder review before publication</h2>
        <p>
          Legal entity, jurisdiction, age eligibility, intellectual-property provisions, limitation
          terms, consumer rights, complaint handling and the legal contact: [to be confirmed and
          reviewed]. These draft terms are not a substitute for that review.
        </p>
      </section>
      <section>
        <h2>Questions</h2>
        <p>
          Use the <RouterLink to="/contact">Contact page</RouterLink> for enquiries. The approved
          legal and privacy contact will be added before public release.
        </p>
      </section></template
    >
  </article>
</template>
