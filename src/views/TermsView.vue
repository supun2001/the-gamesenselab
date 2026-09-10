<script setup>
import LegalLayout from '../components/LegalLayout.vue'
const sections = [
  {
    title: 'Use of service',
    text: 'GameSense Lab is developing educational game-sense resources and AI coaching. This first version offers a waitlist and accounts. Complete operator details, eligibility, jurisdiction, and governing terms before production.',
  },
  {
    title: 'Digital content',
    text: 'READ THE PLAYER is presented as an educational resource. Confirm the purchase platform, delivery format, personal-use licence, availability, and any access conditions before accepting purchases.',
  },
  {
    title: 'Account rules',
    text: 'Use accurate account information, keep your credentials secure, and do not impersonate another person or attempt to access their account. Define the minimum account age and account suspension process before launch.',
  },
  {
    title: 'Acceptable use',
    text: 'Do not harass others, upload content without permission, disrupt the service, abuse forms, or attempt unauthorized access. Future replay submissions must respect other players’ privacy and applicable platform rules.',
  },
  {
    title: 'AI analysis limitations',
    text: 'The AI coach is in development. Planned analysis may be incomplete or incorrect and is intended for education. No rank improvement or competitive result is guaranteed; no analysis is available in this version.',
  },
  {
    title: 'Refunds and the early-access offer',
    text: 'Insert a clear refund and cancellation policy consistent with the sales platform and applicable consumer rights. The waitlist offer describes three months of AI access at launch for members who stay until launch; define eligibility, start dates, access limits, and fulfilment before launch. Joining does not charge you or start a subscription.',
  },
  {
    title: 'Intellectual property',
    text: 'GameSense Lab materials and third-party game assets remain subject to their respective owners’ rights. The product is independently developed and is not affiliated with or endorsed by Riot Games. Add the final content licence and takedown contact.',
  },
  {
    title: 'No cheating or unfair gameplay tools',
    text: 'The project is intended for learning and replay reflection. Do not use the service to develop or distribute cheats, gain unauthorized live enemy information, evade anti-cheat systems, or otherwise facilitate unfair gameplay.',
  },
  {
    title: 'Service changes',
    text: 'Features, supported games, and timing may change during development. Only VALORANT is planned for the first release; future games have no announced dates. Define notification and termination procedures before launch.',
  },
  {
    title: 'Contact',
    text: 'Contact details pending. Add the operator’s legal identity and a working support email, along with dispute-resolution information and all other applicable contractual requirements, before production.',
  },
]
</script>
<template><LegalLayout title="Terms" :sections="sections" /></template>
