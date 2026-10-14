# Avaraxia Labs · Freya

A responsive pre-launch website for **Avaraxia Labs**, built with Vue 3, TypeScript, Vite, Vue Router and Tailwind CSS. Freya is presented as a prototype-stage AI game companion and coach. No gameplay AI provider, checkout or payment collection is connected.

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

The current landing hero follows the supplied screenshot. Its original, generated background is `public/brand/freya-hero.webp`. The supplied Avaraxia Labs logo is stored at `public/brand/avaraxia-labs-logo.png`; the header displays its emblem with live text, and the favicon and sharing image use a simplified SVG rendition of that emblem. The video poster is intentional; no player or play button appears until `site.demoVideo` is configured. The default media policy supports self-hosted video. Add a reviewed provider origin to `_headers` if hosting video elsewhere.

## Secure form flow

- `POST /api/waitlist`: email required; preferred game, player type and an unchecked development-update preference optional.
- `POST /api/team`: representative name/email, game, size, optional level, challenge and required permission to contact the representative.
- `POST /api/contact`: name, email, category and message, saved as a genuine enquiry for founder review.

Cloudflare Worker endpoints validate the origin, method, content type, body size and field values, normalise email, enforce database-backed rate limits, validate Cloudflare Turnstile (success, hostname and action), then insert permitted fields in Supabase. Tokens are reset after every attempted submission. The UI retains inputs on failure.

Supabase service credentials exist only in the server environment. New tables have RLS enabled with no browser policies and explicit revoked public/anon/authenticated permissions. The secret service role is the only API actor. The database function atomically increments request counters; failures fail closed. Rate limits are 20 attempts per IP per minute and 5 per email/form per hour. Identifiers are HMAC hashes using `RATE_LIMIT_SECRET`. Limits are preliminary abuse controls, not a complete defence against distributed attacks; review observed traffic before scaling.

Waitlist emails have a lowercase unique constraint. Conflict-ignore insertion gives identical responses for new and existing entries. It does not overwrite existing data or upgrade an existing contact's marketing consent without identity verification. Consent versions and timestamps are recorded when consent is given. Consent changes and removal requests are handled through the Contact page until an authenticated preference flow exists.

No confirmation email is sent and no email delivery is claimed. Contact/team messages are stored for review in the Supabase dashboard. **A named owner must monitor these tables before enabling forms.** Automated email notifications are not implemented; if needed, configure a separate delivery service and a reliable outbox before promising them.

## Supabase setup

Use a staging project first. Apply `supabase/migrations/20261007_altheia_forms.sql` for a fresh setup. The `altheia_` database identifiers are retained for compatibility with existing records and endpoints; they are not the public brand name. Previous implementation migrations and functions were removed from the working tree; their history remains in Git. Do not replay them into a fresh environment.

The new migration is additive and does not alter or delete historical records. For an existing Supabase project, verify its migration history before applying the new migration. It creates:

- `altheia_waitlist`
- `altheia_team_interest`
- `altheia_enquiries`
- `altheia_rate_limits` and the service-role-only `altheia_consume_rate_limit` RPC

Review and disable any old scheduled email worker, old public signup endpoints and old deployment integrations before public release. Existing records are not automatically treated as consenting to a new brand's marketing. Determine how to retain, migrate or delete them through the approved privacy process. The retired setup files are available in Git history if needed for an existing database.

Verify with staging credentials that anonymous/authenticated roles cannot read, insert or update the new tables or call the limiter RPC. Submit two case-varied versions of the same email; only one row should exist and both HTTP responses should be identical. Confirm failed verification and database outages never yield success.

## Cloudflare deployment

Use the existing **avaraxia-labs** Cloudflare Worker. `server/worker.ts` handles `/api/*`; Workers Static Assets serves the built `dist` directory, route metadata, headers and custom 404 page.

1. Push this Workers migration to the connected GitHub repository. In Worker Settings → Builds, set build command `npm run build`, deploy command `npm run deploy`, and preview command `npx wrangler versions upload` (or disable preview builds).
2. Set build variables `NODE_VERSION=24` and `VITE_SITE_URL=https://avaraxialabs.com`. Add `VITE_TURNSTILE_SITE_KEY` when enabling forms.
3. Deploy and verify the website. The previous `wrangler pages deploy` command targets the deleted Pages project and must be replaced.
4. In Cloudflare DNS, remove only the obsolete CNAME records for `avaraxialabs.com` and `www.avaraxialabs.com` pointing to `altheia-web.pages.dev`. Preserve email records. Then open Worker → Domains → Add domain and attach `avaraxialabs.com`, plus `www.avaraxialabs.com` if needed. Cloudflare manages the new domain records and certificates.
5. Before enabling forms, configure Supabase and Turnstile and set Worker secrets `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, and `RATE_LIMIT_SECRET`. Never prefix secrets with `VITE_`. `ALLOWED_ORIGIN` is configured in `wrangler.toml`.
6. Keep `FORMS_ENABLED=false` until the release checks below are complete. Validate real form writes before accepting registrations.

For server testing locally:

```sh
cp .dev.vars.example .dev.vars
# Configure a staging Supabase project and Turnstile test credentials.
npm run build
npm run worker:dev
```

Use the printed local origin for `ALLOWED_ORIGIN`. Production Turnstile validation requires its returned hostname and action to match. If using official dummy Turnstile keys, use a controlled test harness with a matching test hostname/action rather than weakening the production check. Our unit tests inject verifier responses; they do not make real service calls.

`public/_headers` provides a CSP and related security headers. If adding approved third-party media, review these directives. API responses are not cached. No publicly readable signup export exists.

## Release blockers / outstanding configuration

- Confirm whether a separate brand board or alternate logo sizes are needed beyond the supplied Avaraxia Labs logo.
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

## Accounts

`/account` uses Supabase Auth for email/password sign-in, registration, password recovery, and sign-out. Existing accounts are preserved. Profile reads and writes use the existing `user_profiles` table and its owner-only RLS policies. Accounts do not automatically join the waitlist or consent to marketing.

Set production build variables `VITE_SUPABASE_URL=https://xhlvxxeaobztxohjuhko.supabase.co` and `VITE_SUPABASE_PUBLISHABLE_KEY` (public key only). In Supabase Authentication → URL Configuration, set Site URL to `https://avaraxialabs.com` and allow `https://avaraxialabs.com/account` as a redirect URL. Configure production SMTP for confirmation and recovery emails. Never include a server secret in `VITE_*`. The account page is excluded from the sitemap and has noindex metadata.

`FORMS_ENABLED=true` is now configured in Wrangler; endpoints still reject requests when required server configuration is absent. Required runtime secrets are `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, and `RATE_LIMIT_SECRET`. The public Turnstile site key must be present during the build. Verify production submissions after deploying before announcing registrations.
