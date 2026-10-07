# Altheia · Freya

A responsive pre-launch website for **Altheia**, built with Vue 3, TypeScript, Vite, Vue Router and Tailwind CSS. Freya is presented as a prototype-stage AI game companion and coach. No gameplay AI provider, analytics SDK, account system, checkout or payment collection is connected.

## Run locally

Requires Node.js 24 or later.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

The Vite server previews the website. It does **not** run the Cloudflare API endpoints. Without a public Turnstile sitekey the forms clearly say registration is not open; they never pretend a submission succeeded.

```sh
npm test
npm run build
npm run preview
```

`build` runs Vue/TypeScript checking, Vite, then route-specific HTML metadata generation. It includes all ten routes, a branded PNG sharing preview, an app icon, sitemap and robots configuration. Without `VITE_SITE_URL`, indexing is disabled and canonical URLs are omitted. Privacy and Terms remain noindex drafts even when a domain is configured. The fallback 404 page is noindex.

## Routes and content

Home `/`, Freya `/freya`, Team Coaching `/team-coaching`, Pricing `/pricing`, Roadmap `/roadmap`, About `/about`, FAQ `/faq`, Contact `/contact`, Privacy `/privacy`, Terms `/terms`.

Branding, links, demo URL, feature statuses, founder approval placeholders, pricing and launch flags: `src/config/site.ts`. Route titles/descriptions: `src/config/pages.ts`. Theme tokens and responsive styles: `src/assets/styles/main.css` (including Tailwind v4). All unknown feature capabilities are labelled Planned for launch. The prototype as a whole is confirmed; no individual capability is claimed as publicly available.

The current landing hero follows the supplied screenshot. Its original, generated background is `public/brand/freya-hero.webp`. The geometric mark, text wordmark, favicon and sharing image are **temporary design placeholders**, not reproductions of an approved logo. Replace `public/brand/` assets and set `site.wordmark` and `site.mark` to approved asset URLs when final branding is available. The video poster is intentional; no player or play button appears until `site.demoVideo` is configured. The default media policy supports self-hosted video. Add a reviewed provider origin to `_headers` if hosting video elsewhere.

## Secure form flow

- `POST /api/waitlist`: email required; preferred game, player type and an unchecked development-update preference optional.
- `POST /api/team`: representative name/email, game, size, optional level, challenge and required permission to contact the representative.
- `POST /api/contact`: name, email, category and message, saved as a genuine enquiry for founder review.

Cloudflare Pages Functions validate the origin, method, content type, body size and field values, normalise email, enforce database-backed rate limits, validate Cloudflare Turnstile (success, hostname and action), then insert permitted fields in Supabase. Tokens are reset after every attempted submission. The UI retains inputs on failure.

Supabase service credentials exist only in the server environment. New tables have RLS enabled with no browser policies and explicit revoked public/anon/authenticated permissions. The secret service role is the only API actor. The database function atomically increments request counters; failures fail closed. Rate limits are 20 attempts per IP per minute and 5 per email/form per hour. Identifiers are HMAC hashes using `RATE_LIMIT_SECRET`. Limits are preliminary abuse controls, not a complete defence against distributed attacks; review observed traffic before scaling.

Waitlist emails have a lowercase unique constraint. Conflict-ignore insertion gives identical responses for new and existing entries. It does not overwrite existing data or upgrade an existing contact's marketing consent without identity verification. Consent versions and timestamps are recorded when consent is given. Consent changes and removal requests are handled through the Contact page until an authenticated preference flow exists.

No confirmation email is sent and no email delivery is claimed. Contact/team messages are stored for review in the Supabase dashboard. **A named owner must monitor these tables before enabling forms.** Automated email notifications are not implemented; if needed, configure a separate delivery service and a reliable outbox before promising them.

## Supabase setup

Use a staging project first. Apply `supabase/migrations/20261007_altheia_forms.sql` for a fresh Altheia setup. Previous implementation migrations and functions were removed from the working tree; their history remains in Git. Do not replay them into a fresh Altheia environment.

The new migration is additive and does not alter or delete historical records. For an existing Supabase project, verify its migration history before applying the new migration. It creates:

- `altheia_waitlist`
- `altheia_team_interest`
- `altheia_enquiries`
- `altheia_rate_limits` and the service-role-only `altheia_consume_rate_limit` RPC

Review and disable any old scheduled email worker, old public signup endpoints and old deployment integrations before public release. Existing records are not automatically treated as consenting to a new brand's marketing. Determine how to retain, migrate or delete them through the approved privacy process. The retired setup files are available in Git history if needed for an existing database.

Verify with staging credentials that anonymous/authenticated roles cannot read, insert or update the new tables or call the limiter RPC. Submit two case-varied versions of the same email; only one row should exist and both HTTP responses should be identical. Confirm failed verification and database outages never yield success.

## Cloudflare deployment

Use **Cloudflare Pages**, which runs the repository's `functions/` folder. Static GitHub Pages cannot run these server endpoints. The previous GitHub auto-deploy workflow is now validation-only, so a commit does not overwrite the old live site unexpectedly.

Create a **Pages** project, not a Workers project. Workers Builds defaults to `npx wrangler deploy`; that command fails here with “Missing entry-point to Worker script or to assets directory” because this repository has a Pages `wrangler.toml` and Pages Functions. In Cloudflare's Create an app flow, choose **Continue to Pages → Connect to Git**. Do not attach this repository to the existing `the-gamesenselab` Worker build.

1. Create a Pages project using this repository. Build command: `npm run build`. Output directory: `dist`. Set Node version to 24.
2. Configure a Turnstile widget for the exact production hostname. Use a separate widget for staging/preview. Set browser build variables `VITE_TURNSTILE_SITE_KEY` and `VITE_SITE_URL` (the approved HTTPS origin with no path).
3. Set server secrets in Pages Settings: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, `RATE_LIMIT_SECRET` (a long random value). Never prefix secrets with `VITE_`.
4. Set server variable `ALLOWED_ORIGIN` to the exact site origin. Cross-origin requests are rejected; no wildcard CORS is enabled.
5. Review all release blockers below, then change `FORMS_ENABLED` from `false` to `true` in `wrangler.toml` for the approved release. Keep staging configuration separate. The checked-in default fails closed.
6. Deploy via Pages Git integration or `npm run deploy` after Cloudflare authentication. The CLI will ask you to select/create the Pages project. No production deployment has been performed automatically.
7. Test real Turnstile + Supabase writes and the live legal/contact process. Verify direct loads and refreshes for every route. Metadata HTML is emitted per route; unknown routes use the custom noindex 404 page.

For server testing locally:

```sh
cp .dev.vars.example .dev.vars
# Configure a staging Supabase project and Turnstile test credentials.
npm run build
npm run pages:dev
```

Use the printed local origin for `ALLOWED_ORIGIN`. Production Turnstile validation requires its returned hostname and action to match. If using official dummy Turnstile keys, use a controlled test harness with a matching test hostname/action rather than weakening the production check. Our unit tests inject verifier responses; they do not make real service calls.

`public/_headers` provides a CSP and related security headers. If adding approved third-party media, review these directives. API responses are not cached. No publicly readable signup export exists.

## Release blockers / outstanding configuration

- Approved Altheia wordmark, mark and brand board; replace temporary brand assets.
- Real production domain; configure `VITE_SITE_URL`, `ALLOWED_ORIGIN`, DNS and TLS.
- Supabase staging/live projects, applied migration, server secret and verified RLS.
- Turnstile widget/sitekey, secret and hostname configuration.
- Long random rate-limit HMAC secret.
- Founders' legal entity, address, privacy contact, retention schedule, lawful bases, processor/transfer review and reviewed Terms/Privacy. Placeholders are intentionally visible in the drafts.
- A monitored enquiry/privacy-request workflow and consent-withdrawal/deletion procedure.
- Approved age eligibility and any additional safeguards for young players.
- Confirmed feature statuses, supported capture methods, review timing and match-review scope before launch.
- Demo video; current poster truthfully says coming soon.
- Final usage-rule approval. Annual payments stay disabled (`annualPaymentsEnabled: false`) pending the 30% discount unit-economics review, particularly Competitive. All purchase functionality remains disabled.
- Retirement of legacy forms, scheduled emails, old-domain assets and hosting automation; keep historical data secure.

## Verification scope

Automated tests cover server validation, origin/body guards, bot proof, rate limiting, storage failures, duplicate-safe request semantics, consent recording, annual price calculations and access-policy declarations. They use mocked services and do not substitute for applying the migration, testing concurrent uniqueness on PostgreSQL, or real end-to-end production delivery.
