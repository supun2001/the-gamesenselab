<script setup>
import LegalLayout from '../components/LegalLayout.vue'
import { links } from '../config/links'

const intro = [
  'GameSense Lab respects your privacy and is committed to protecting your personal information.',
  'This Privacy Policy explains how we collect, use, store, share, and protect personal information when you use our website, join our waitlist, create an account, purchase or access our digital products, join our community, or use future GameSense Lab gameplay analysis and coaching services.',
  'GameSense Lab is a competitive gaming education, coaching, and technology project focused on game sense, decision-making, replay analysis, player psychology, and AI-assisted gameplay improvement.',
]
const sections = [
  {
    title: 'Who we are',
    text: 'For the purposes of UK data protection law, the person or organisation responsible for deciding how personal information is used is the data controller. This policy concerns GameSense Lab and the website thegamesenselab.com.',
    links: [{ label: 'Contact GameSense Lab: contact@thegamesenselab.com', href: links.contact }],
  },
  {
    title: 'Information you provide',
    text: 'We may collect information you provide directly through our website, accounts, waitlist, support requests, or community interactions, including:',
    items: [
      'Name or display name and email address.',
      'Account login information, handled through Supabase authentication.',
      'Main game, player rank, and optional VALORANT name and tagline.',
      'Waitlist information and information you voluntarily provide through forms.',
      'Messages, support requests, coaching enquiries, feedback, and feature suggestions.',
      'Discord or community-related identifiers where relevant.',
    ],
  },
  {
    title: 'Future gameplay analysis information',
    text: 'Gameplay uploads and AI analysis are not available on the current website. If you later use these services, we may process information needed to provide them, including:',
    items: [
      'Gameplay recordings, replay clips, screenshots, match information, and timestamps.',
      'Visible game-state information, player decisions, positioning, and movement.',
      'Utility-use information and repeated gameplay habits.',
      'Analysis results, decision scores, and coaching recommendations.',
      'Feedback about whether an analysis was useful or accurate.',
    ],
    after:
      'We will update this policy with the actual data collected and processing arrangements before introducing these features.',
  },
  {
    title: 'Technical information',
    text: 'When you visit the website, hosting and service providers may process limited technical information such as your IP address, browser and device details, operating system, requested pages, referral information, visit timestamps, and error or security logs.',
    after:
      'If you allow analytics, Google Analytics 4 collects page visits, successful new waitlist signups, browser and device information, and cookie identifiers to help us understand website use. Google receives technical request information, including your IP address. Our custom events do not include names, emails, Riot IDs, account IDs, or form contents.',
  },
  {
    title: 'How we use information',
    text: 'We use personal information as relevant to your interaction with GameSense Lab to:',
    items: [
      'Operate the website, manage the AI waitlist, and create and manage user accounts.',
      'Provide access to purchased digital products through our product platform.',
      'Communicate requested development updates and provide customer support.',
      'Manage coaching enquiries, feedback, and feature suggestions.',
      'Improve website functionality, identify technical problems, and develop features.',
      'Maintain security and prevent fraud, spam, abuse, or misuse.',
      'Comply with applicable legal obligations.',
    ],
    after:
      'Future gameplay analysis may use submitted information to generate personalised guidance about decision-making, positioning, rotations, peeking, fight selection, timing, utility usage, gameplay habits, and opponent-reading decisions.',
  },
  {
    title: 'Lawful bases for processing',
    text: 'The lawful basis depends on the purpose for which information is processed:',
    items: [
      'Contract: where necessary to provide account access, digital products, or services you purchase or request.',
      'Consent: for optional waitlist and development communications, wider marketing you separately choose to receive, and optional processing where consent is required.',
      'Legitimate interests: for reasonable purposes such as maintaining security, preventing abuse, resolving technical issues, and improving the service, provided these interests do not override your rights.',
      'Legal obligation: where information must be processed or retained to meet applicable tax, accounting, regulatory, or other legal requirements.',
    ],
  },
  {
    title: 'AI-assisted analysis and profiling',
    text: 'Future features may use automated systems or artificial intelligence to evaluate gameplay patterns and generate coaching recommendations. This may include repeated decisions, positioning tendencies, fight selection, timing, rotations, and utility usage.',
    after:
      'AI-generated feedback may be incomplete, inaccurate, or subjective. It is coaching guidance, not an objective or guaranteed assessment of player ability. We will explain any relevant automated decision-making and its implications before introducing it.',
  },
  {
    title: 'Replay uploads and other players',
    text: 'If replay or video uploads are introduced, recordings may contain usernames, player IDs, voice chat, text chat, and other visible or audible personal information. Only upload content you are legally entitled to share, and avoid including unnecessary information about others.',
    after:
      'GameSense Lab will seek to minimise information extracted about other players and focus on what is necessary for gameplay analysis. Audio handling and any removal options will be explained before uploads become available.',
  },
  {
    title: 'Data retention',
    text: 'Personal information is retained only for as long as necessary for the purpose for which it was collected. Retention is determined by the service requested, whether your account or enquiry remains active, and applicable legal, accounting, security, or dispute-resolution requirements.',
    items: [
      'Waitlist information: while needed to manage your waitlist participation and related launch communications, subject to withdrawal or deletion requests.',
      'Account information: while needed to provide your account and handle applicable obligations after account closure.',
      'Support enquiries: while needed to resolve the enquiry and maintain necessary support or dispute records.',
      'Transaction records: for applicable tax and accounting requirements.',
      'Consent and security records: for as long as necessary to demonstrate consent or address security and abuse concerns.',
    ],
    after:
      'Retention arrangements for gameplay clips and generated analysis will be explained before those features launch. Contact us for information about retention or to request deletion.',
  },
  {
    title: 'Service providers',
    text: 'We use third-party services to operate GameSense Lab. These include:',
    items: [
      'Supabase: authentication, database storage, and user profiles.',
      'GitHub / GitHub Pages: website hosting and deployment.',
      'Cloudflare: DNS management. Any additional security, caching, or protection services depend on the deployed configuration.',
      'Whop: digital-product access, memberships, payments, and delivery where applicable.',
      'Namecheap Private Email: account confirmation and email communications. Email delivery involves processing recipient addresses and message contents.',
      'Google Analytics: optional website usage measurement, loaded only after you allow analytics.',
      'Google Fonts: serving website typography, which involves standard request information such as IP addresses.',
    ],
    after:
      'We will update this policy as providers change. Any future AI or additional analytics providers will be identified before their services process your information.',
  },
  {
    title: 'International transfers',
    text: 'Some service providers may process information outside the United Kingdom. Where international transfers take place, appropriate safeguards should be used where required by UK data protection law. You can contact us for information about the providers and transfer arrangements relevant to your data.',
  },
  {
    title: 'Payments and digital products',
    text: 'Payments and digital-product access may be handled through Whop or another identified payment provider. GameSense Lab does not collect full payment-card details through this website’s forms. Payment providers process payment information under their own privacy terms, which should be reviewed when making a purchase.',
  },
  {
    title: 'Waitlist updates and marketing',
    text: 'If you choose to receive development updates, launch announcements, or other marketing emails, we may use your email address for those purposes. You can withdraw your consent or request that these communications stop at any time by contacting us or using an unsubscribe option where provided.',
    after:
      'Joining the AI waitlist is not blanket consent for unrelated marketing. Waitlist and product updates are distinguished from wider promotional communications.',
  },
  {
    title: 'Cookies and similar technologies',
    text: 'The current website uses browser storage for Supabase authentication and session management. If you allow analytics, Google Analytics uses cookies such as _ga and _ga_F9PJTVXGL2 to distinguish visits. Your analytics choice is saved in browser storage. Advertising consent is not granted by this application. Hosting and authentication providers may use technologies necessary for their services.',
    after:
      'You can allow or decline analytics independently of using the site. Use Cookie settings in the footer to change your choice. Declining stops our analytics collection and removes accessible Google Analytics cookies; withdrawing a previous acceptance reloads the page. Withdrawal does not delete information already collected by Google Analytics.',
  },
  {
    title: 'Security',
    text: 'We take reasonable technical and organisational measures to protect personal information, including encrypted connections, secure authentication, Supabase Row Level Security, and restricted data access. Credentials used for email delivery belong in protected service settings rather than public website code.',
    after: 'No online service can guarantee absolute security.',
  },
  {
    title: 'Your privacy rights',
    text: 'Depending on the circumstances, UK data protection law may give you rights including:',
    items: [
      'To be informed about how personal information is used.',
      'To access your personal data and correct inaccurate information.',
      'To request deletion or restriction of processing.',
      'To object to certain processing.',
      'To data portability in certain circumstances.',
      'Rights relating to automated decision-making and profiling.',
      'To withdraw consent where processing is based on consent.',
    ],
    links: [{ label: 'Exercise your rights: contact@thegamesenselab.com', href: links.contact }],
  },
  {
    title: 'Account and data deletion',
    text: 'You may request deletion of your GameSense Lab account and associated personal information by contacting us. Some information may need to be retained for legal obligations, fraud prevention, dispute resolution, accounting, or security.',
    after:
      'Account-deletion requests are currently handled by email; a self-service deletion feature is not yet available.',
  },
  {
    title: 'Children’s privacy',
    text: 'Gaming services may be used by younger people, and additional safeguards may apply when processing children’s personal information. If you are a parent or guardian with questions or concerns about information a child has provided, please contact us.',
    after:
      'Age eligibility and any additional protections for future services will be set out before those services become available.',
  },
  {
    title: 'Model training and external AI services',
    text: 'The current website does not accept gameplay uploads or send gameplay to an AI provider. GameSense Lab will not use identifiable gameplay uploads to train general AI models without providing appropriate notice and, where required, obtaining permission.',
    after:
      'Before introducing external AI processing, we will explain what information is sent, why it is sent, which provider receives it, where it is processed, and the applicable retention and model-training arrangements. Any optional contribution to model improvement will be explained separately.',
  },
  {
    title: 'Changes to this policy',
    text: 'We may update this Privacy Policy when features, service providers, AI services, legal requirements, or data-processing practices change. The latest version will be published on this page with an updated date.',
  },
  {
    title: 'Complaints',
    text: 'If you have concerns about how GameSense Lab uses your personal information, please contact us. You may also have the right to complain to the UK Information Commissioner’s Office (ICO).',
    links: [
      { label: 'Visit the ICO complaints page', href: 'https://ico.org.uk/make-a-complaint/' },
    ],
  },
  {
    title: 'Contact',
    text: 'For privacy questions, data requests, or account-deletion requests, contact GameSense Lab.',
    links: [
      { label: 'contact@thegamesenselab.com', href: links.contact },
      { label: 'thegamesenselab.com', href: 'https://thegamesenselab.com' },
    ],
  },
]
</script>
<template>
  <LegalLayout
    title="Privacy Policy"
    updated="September 2026"
    :intro="intro"
    :sections="sections"
    :show-notice="false"
  />
</template>
