# GameSense Lab

## Copyright

© 2026 GameSense Lab. All rights reserved.

This project, including its source code, design, branding, written content, frameworks, documentation, and related materials, is the intellectual property of GameSense Lab and Supun “Hanzo” Hasanka unless otherwise stated.

No part of this project may be copied, reproduced, redistributed, modified, published, sold, or used commercially without prior written permission.

Unauthorized use, redistribution, or reproduction of this project or its contents is strictly prohibited.

### Data and security

- `waitlist` stores first name, normalized email, main game, optional rank, optional VALORANT name and tagline, UUID, and creation date. A unique email constraint prevents duplicates, including case variants because the database requires lowercase trimmed emails. Database checks validate fields independently of the browser.
- Anonymous and authenticated clients can insert only the six submission columns. They cannot select, update, or delete waitlist rows. The frontend uses `.insert()` without `.select()`.
- Duplicate submissions produce a friendly already-registered message. As with any direct anonymous insert plus unique constraint, repeated attempts can reveal whether a guessed address exists through the duplicate error. For stronger enumeration resistance and rate limits, replace direct inserts with a rate-limited Edge Function returning an identical response for new/duplicate submissions. This first version has no server-side bot throttling; browser validation is not an abuse control.
- `my_waitlist_status()` accepts no arguments, looks up the caller using `auth.uid()`, requires a verified email, and returns a boolean. Only authenticated users can execute it; it never returns another user's email or row.
- Profile SELECT/INSERT/UPDATE policies use `auth.uid() = id`. A restricted security-definer trigger creates the profile on signup, including when confirmation means there is no browser session yet. Display name is stored in signup metadata; the dashboard reads the profile, with metadata as a fallback.
- Logout and auth changes immediately remove protected dashboard access. Route protection is for navigation; RLS protects the actual data.
- Collecting waitlist addresses does not send weekly email automatically. Configure an email delivery workflow and unsubscribe handling before sending updates. Do not use the public client key for administrative exports.

### Live verification after configuration

1. Submit a valid waitlist entry; confirm the success message and row in the Supabase owner dashboard. Retry with different email capitalization and confirm the duplicate state.
2. Use the publishable key to attempt SELECT from `waitlist`; it must be denied. Try an invalid game or untrimmed/mixed-case email directly through the API; the database must reject it.
3. Register two accounts, confirm their emails, and sign in. Confirm display names, logout, and the dashboard redirect when signed out.
4. As account A, read/update account B's profile; no row should be readable or changeable. Confirm `my_waitlist_status()` returns only A's membership and cannot accept an arbitrary email. Anonymous RPC execution must fail.
5. Test expired sessions, network loss, and an invalid password. Forms should remain usable and show a friendly error.

## Content and artwork

- All social, book, and contact links are in `src/config/links.js`. The supplied Discord, Whop, book, Facebook, Instagram, and contact email destinations are configured there and reused across the site. Update them in this one file when needed. Empty links show an explicit coming-soon notice.
- Place your GS logo in `public/images/logo.png`, banner in `public/images/banner.png`, and book cover in `public/images/book-cover.png`. Then set `artwork.logo`, `artwork.banner`, and `artwork.book` to `import.meta.env.BASE_URL + 'images/logo.png'` etc. This works for custom domains and repository subpaths. The existing mark, original generated hero (`public/images/hero.jpg`), and typographic book preview work until you add final brand assets. Keep images optimized; use a transparent logo and a 2:3 book cover.
- The hero artwork is original AI-generated scene imagery, not official VALORANT artwork. Its descriptive source is in `public/images/README.md`.
- Development updates are in `src/config/updates.js`; replace sample cards with real entries. Set dates to ISO `YYYY-MM-DD`; `null` deliberately displays “Date to be announced”. Optional images use an asset URL and load lazily.
- Update publisher disclaimers in `src/config/links.js` as additional games are introduced. Only VALORANT is planned for the initial release; future titles are labelled as exploration.
- The three-month offer is implemented as waitlist copy. No billing, access grant, beta invitation, or subscription fulfilment is implemented; define launch eligibility/fulfilment before launch.
- The Privacy Policy uses the supplied September 2026 draft, with readable sections and contact@thegamesenselab.com. Outstanding business decisions from that draft are recorded in `docs/privacy-editorial-notes.md`. Terms still uses the initial starter content. No analytics/tracking SDK or marketing cookie is installed. Supabase uses local browser storage for the authenticated session. Google Fonts requests are used for typography.
- SEO title, canonical, Open Graph, and Twitter summary metadata live in `index.html`; routes update document titles. Add a real sharing image and its absolute metadata URL if desired. Hash-route pages share the static server metadata; no false route-specific social previews are claimed.

## Structure

```text
src/
  components/        Navigation, hero, sections, forms, shared links
  views/             Home, signup, login, dashboard, privacy, terms
  config/            Link/artwork configuration and editorial updates
  lib/               Supabase client, auth state, validation
  router/            Hash routes and authentication guard
  assets/styles/     Shared responsive design tokens and CSS
supabase/schema.sql  Initial database schema, grants, policies, triggers, RPC
tests/               Form validation tests
.github/workflows/   GitHub Pages build and deployment
public/              CNAME, favicon, optimized artwork
```

Accessibility includes labelled inputs, inline status/error announcements, visible focus indicators, a skip link, semantic landmarks, keyboard navigation, mobile menu labels, and reduced-motion support. No heavy animation framework is used. The dashboard and secondary views are lazy-loaded. Automated local tests validate form rules; production authentication and SQL policy verification require a configured Supabase project.

An optional, feature-detected WebMCP tool `stage_waitlist_entry` can prepare the visible waitlist form for user review; it never submits it. Unsupported browsers continue normally. No supported native WebMCP validation context was available during implementation, so native tool registration is not claimed as verified.
