export type FeatureStatus = 'Prototype' | 'Planned for launch' | 'Future research'
export const site = {
  name: 'Altheia',
  product: 'Freya',
  tagline: 'Read the game. Rise together.',
  // No assumed domain, legal identity or supplied assets. Set these before public release.
  url: import.meta.env?.VITE_SITE_URL?.replace(/\/$/, '') || '',
  wordmark: '',
  mark: '',
  socialImage: '/brand/social-preview.png',
  demoVideo: '',
  privacyContact: '',
  legalName: '',
  address: '',
  retentionPolicy: '',
  launch: {
    stage: 'Prototype built. Early access coming soon.',
    salesEnabled: false,
    annualPaymentsEnabled: false,
  },
  links: { discord: '', instagram: '' },
  consentVersion: 'altheia-updates-v1',
}
export const navigation = [
  { label: 'Freya', to: '/freya' },
  { label: 'Team Coaching', to: '/team-coaching' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Roadmap', to: '/roadmap' },
  { label: 'About', to: '/about' },
]
export const features: {
  title: string
  description: string
  icon: string
  status: FeatureStatus
}[] = [
  {
    title: 'Game-sense analysis',
    description: 'Explore the information, timing and options behind a decision.',
    icon: 'focus',
    status: 'Planned for launch',
  },
  {
    title: 'Opponent patterns',
    description: 'Build reads from observed behaviour, with room for uncertainty.',
    icon: 'paths',
    status: 'Planned for launch',
  },
  {
    title: 'Positioning & rotations',
    description: 'Review the space you take, the space you leave and when you move.',
    icon: 'route',
    status: 'Planned for launch',
  },
  {
    title: 'Communication feedback',
    description: 'Understand how clear, relevant information can support a shared call.',
    icon: 'voice',
    status: 'Planned for launch',
  },
  {
    title: 'Team coordination',
    description: 'Connect individual choices to spacing, support and team responsibilities.',
    icon: 'team',
    status: 'Planned for launch',
  },
  {
    title: 'Moments with meaning',
    description: 'Revisit mistake clips alongside an explanation of the decision.',
    icon: 'play',
    status: 'Planned for launch',
  },
  {
    title: 'Personalised practice',
    description: 'Turn reflection into a specific improvement to work on next.',
    icon: 'spark',
    status: 'Planned for launch',
  },
  {
    title: 'Recurring-habit tracking',
    description: 'Explore how patterns change across reviews and practice sessions.',
    icon: 'repeat',
    status: 'Planned for launch',
  },
]
export const pricing = {
  currency: 'USD',
  annualDiscount: 30,
  usageRule: 'Match allowances renew monthly and do not roll over.',
  usageApproved: false,
  single: 349,
  plans: [
    {
      name: 'Core',
      monthlyCents: 1699,
      annualCents: 14272,
      equivalentCents: 1189,
      reviews: 8,
      yearlyReviews: 96,
      description: 'Build a consistent review habit.',
    },
    {
      name: 'Competitive',
      monthlyCents: 2699,
      annualCents: 22672,
      equivalentCents: 1889,
      reviews: 14,
      yearlyReviews: 168,
      description: 'For players who review more matches.',
    },
  ],
}
export const money = (cents: number) => `$${(cents / 100).toFixed(2)}`
export const games = ['CS2', 'VALORANT', 'League of Legends', 'Dota 2', 'Fortnite', 'Other']
export const roadmap = [
  {
    stage: 'Now',
    title: 'Prototype & validation',
    status: 'In progress',
    items: [
      'Prototype testing and a demonstration video',
      'Waitlist and user interviews',
      'Coaching-quality and cost evaluation',
    ],
  },
  {
    stage: 'Launch',
    title: 'Meet Freya',
    status: 'Planned',
    items: [
      'Public companion release after readiness checks',
      'Onboarding and customer feedback',
      'Initial support and reliability improvements',
    ],
  },
  {
    stage: 'Approx. 3–4 months after launch',
    title: 'Specialist competitive coaching',
    status: 'Proposed',
    items: [
      'First specialist competitive coaching release',
      'CS2 is the current proposed first specialist game',
      'Scope and availability subject to testing',
    ],
  },
  {
    stage: 'Years 1–3',
    title: 'Build on what works',
    status: 'Directional',
    items: [
      'Improve coaching quality and efficiency',
      'Validate team-coaching workflows and repeatable training feedback',
      'Expand to more games when evidence and resources support it',
    ],
  },
  {
    stage: 'Year 4 onward',
    title: 'Specialist model research',
    status: 'Future research',
    items: [
      'Research a specialist coaching model',
      'Build on validated gameplay and coaching methods',
      'Proceed only with suitable data permissions, funding and technical results',
    ],
  },
  {
    stage: 'Year 5 ambition',
    title: 'Learn alongside a human team',
    status: 'Ambition',
    items: [
      'Pilot a human competitive team supported by Freya',
      'Evaluate AI-assisted coaching in structured team practice',
    ],
  },
]
export const faq = [
  [
    'What is Freya?',
    'Freya by Altheia is an AI game companion and coach being developed to help players understand decisions, recognise opponent patterns and improve how they work together.',
  ],
  [
    'Is Freya available now?',
    'A working prototype has been built. Public early access is not available yet. The website collects expressions of interest; it does not analyse gameplay.',
  ],
  [
    'What is game-sense coaching?',
    'It focuses on the decisions around a fight: information, positioning, timing, resources, opponent tendencies and the objective. The aim is to understand why a choice made sense and what to practise next.',
  ],
  [
    'How is team coaching different from individual coaching?',
    'Individual review focuses on your choices. Team review explores the connections between players: shared information, roles, support timing and coordinated actions. A team-process problem is not always one player’s mistake.',
  ],
  [
    'Which game will be supported first?',
    'The roadmap begins with the Freya companion. CS2 is the current proposed first specialist competitive coaching game, approximately 3–4 months after launch. Scope, timing and availability remain subject to testing.',
  ],
  [
    'Does Freya improve my aim?',
    'Freya is not an aim trainer. It is being developed around decision-making, game sense and teamwork. Mechanics practice remains a separate part of improvement.',
  ],
  [
    'Does Freya guarantee that I will rank up?',
    'No coach can guarantee a rank increase. Freya is being developed to support learning and better decisions.',
  ],
  [
    'How will gameplay capture work?',
    'The prototype uses captured gameplay. Supported capture methods, formats and review timing are subject to launch validation. This website does not accept gameplay uploads. Supported features and modes will be evaluated against relevant game and platform rules before release.',
  ],
  [
    'Will Freya analyse team voice communication?',
    'Communication feedback is planned. Deeper team analysis may require multiple player perspectives and consented communication recordings. Collection, consent and retention details will be explained before those features are introduced.',
  ],
  [
    'What does one match review include?',
    'The proposed review covers meaningful decisions, explanations of relevant moments and focused practice suggestions for one supported match. Supported modes, limits and final scope will be confirmed before purchase is available.',
  ],
  [
    'How do monthly allowances work on an annual plan?',
    'Core proposes 8 reviews per month, up to 96 over a year. Competitive proposes 14 per month, up to 168. Annual fees are paid upfront; allowances renew monthly, not as one yearly allocation. The proposed rule is that unused reviews do not roll over.',
  ],
  [
    'Are team subscriptions included?',
    'No. Team packages are being developed. Individual subscriptions do not automatically include a full five-player team package.',
  ],
  [
    'What information does the waitlist collect?',
    'Your email is required. Preferred game and whether you are an individual player or team representative are optional. A separate, unchecked choice lets you opt into development updates. Joining the waitlist does not subscribe you to broader marketing.',
  ],
  [
    'How can I request removal of my information?',
    'Use the Contact page and choose Privacy request. The founders will use your email to respond to the request. Before public release, Altheia must confirm its privacy contact, retention policy and request-handling process; the Privacy page is currently a draft.',
  ],
]
