# GameSense Lab

Vue 3 + Vite + Vue Router + Supabase. A responsive coming-soon site for an AI coaching product **in development**, initially focused on VALORANT. Static output runs on GitHub Pages with hash routing; no application backend is required.

## Local development

Use Node.js 22.12+ (Node 24 also works).

```sh
npm ci
cp .env.example .env
# Fill in the two public Supabase values in .env.
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. Restart Vite after changing environment variables.

```sh
npm test
npm run build
npm run preview
```

Without credentials, the marketing pages still render and forms explain that registration is not open. They never pretend to save a submission. Live integration requires your own Supabase project. No credentials, production account, or DNS changes are included in the source deliverable.

## Supabase setup

For confirmation mail from **verification@thegamesenselab.com**, follow [EMAIL_SETUP.md](supabase/EMAIL_SETUP.md). A branded template is supplied in `supabase/confirm-signup.html`. Keep Confirm email enabled: login and protected navigation now also check email confirmation in the application.

1. Create a project at Supabase and wait for database provisioning.
2. Open **SQL Editor → New query**, paste `supabase/schema.sql`, and run it once against a new project. It creates both tables, constraints, RLS policies, profile triggers, and the restricted status RPC in a transaction. For an existing schema, use a reviewed migration instead of rerunning this initial schema.
3. Under the project's API settings / Connect dialog, copy the project URL and **publishable** key into `.env`:

   ```dotenv
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
   ```

   The client also accepts `VITE_SUPABASE_ANON_KEY` as a legacy fallback; a configured publishable key takes precedence. Never use the service-role or secret key. Vite public variables become visible in the browser; RLS and database grants provide the security boundary.

4. In **Authentication → Sign In / Providers**, enable Email, keep email confirmation enabled, and set a minimum password length of at least 8. Configure your SMTP provider for production email delivery.
5. In **Authentication → URL Configuration**, set Site URL to `https://thegamesenselab.com`. Add these Redirect URLs:

   ```text
   https://thegamesenselab.com
   https://thegamesenselab.com/
   https://thegamesenselab.com/#/login
   https://thegamesenselab.com/#/dashboard
   http://localhost:5173
   http://localhost:5173/
   ```

6. Signup passes the application base URL as `emailRedirectTo`. PKCE uses a query parameter for its callback so it does not conflict with Vue's hash routes. Open confirmation emails in the same browser/device that started signup. After verification, use Sign In to reach the dashboard. If Vite uses another port, add that exact origin too.
7. If testing the repository domain first, also allow `https://supun2001.github.io/the-gamesenselab/` and use that as Site URL until switching to your custom domain.

See [Supabase redirect configuration](https://supabase.com/docs/guides/auth/redirect-urls) and [profile triggers](https://supabase.com/docs/guides/auth/managing-user-data).

### Existing database: add VALORANT identity fields

Run `supabase/migrations/20260910_waitlist_valorant_identity.sql` once in Supabase SQL Editor **before deploying the updated waitlist form**. It adds nullable `valorant_name` and `valorant_tagline` columns and the required INSERT grants while preserving current rows and RLS. Do not rerun the full initial schema on your existing database. New projects use the updated `supabase/schema.sql` instead and should not also run this migration.

The form shows these optional fields when VALORANT is selected; users must fill both or neither. A leading `#` is removed from the stored tagline, so `Hanzo#EUW` is stored as `Hanzo` and `EUW`. This captures self-reported identity; it does not verify Riot account ownership. Existing waitlist members are not overwritten by duplicate submissions.

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

## GitHub Pages deployment

Repository: `supun2001/the-gamesenselab`.

1. Commit the source and `package-lock.json` to `main` and push it to GitHub.
2. Open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Under **Settings → Secrets and variables → Actions → Repository secrets**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. Push to `main` or run **Actions → Deploy to GitHub Pages → Run workflow**. The workflow installs locked dependencies, tests, builds with those secrets, uploads `dist`, and deploys using official Pages actions. If your default branch differs, change the workflow branch filter.
5. Inspect the deployment run and open its published URL.

**Build-time variables:** Vite replaces `VITE_*` values during `npm run build`. GitHub Pages cannot read `.env` at runtime. Changing repository secrets requires a new build/deployment. Secrets prevent accidental source exposure, but the public client key is still present in the deployed browser code by design.

For a local production build instead, create an ignored `.env.production` with the same values, run `npm ci` then `npm run build`, and publish the contents of `dist` through your chosen Pages branch publishing setup. Do not upload `.env` files. The supplied workflow is the recommended deployment path.

### Custom domain and Cloudflare DNS

The configured Vite base is `/` for `https://thegamesenselab.com`. `public/CNAME` is copied into the build for compatibility with branch deployments. For Actions deployments, set the custom domain in GitHub Pages settings; the CNAME file alone does not configure it.

1. Verify domain ownership in your GitHub account's **Settings → Pages** using the exact TXT name/value GitHub provides. Add that TXT in Cloudflare and keep it after verification.
2. In the repository's **Settings → Pages → Custom domain**, enter `thegamesenselab.com` and save before changing traffic records.
3. In **Cloudflare → thegamesenselab.com → DNS → Records**, add the following. Use **DNS only** (grey cloud), TTL **Auto**. Replace conflicting A/AAAA/CNAME web records for the same names; preserve unrelated MX and TXT records.

| Type  | Name | Content             | Proxy    |
| ----- | ---- | ------------------- | -------- |
| A     | @    | 185.199.108.153     | DNS only |
| A     | @    | 185.199.109.153     | DNS only |
| A     | @    | 185.199.110.153     | DNS only |
| A     | @    | 185.199.111.153     | DNS only |
| CNAME | www  | supun2001.github.io | DNS only |

Do not include the repository name or `https://` in the CNAME target. This setup uses Cloudflare DNS with GitHub hosting. Leave records DNS only so GitHub handles HTTPS directly. Do not add wildcard records.

4. Confirm the domain's registrar uses the exact Cloudflare nameservers assigned to this zone.
5. Wait for GitHub's DNS check and certificate, then enable **Enforce HTTPS**. DNS/certificate propagation can take up to 24 hours. GitHub redirects `www` to the apex when both are configured.
6. Confirm the homepage and `/#/login`, `/#/signup`, and `/#/dashboard` routes work on reload. Update the Supabase Site URL/redirect list to the production values above.

Optional verification:

```sh
dig thegamesenselab.com A +short
dig www.thegamesenselab.com CNAME +short
```

DNS values and domain setup: [GitHub custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). DNS-only behaviour: [Cloudflare proxy status](https://developers.cloudflare.com/dns/proxy-status/).

**Before the domain is active:** temporarily set `base: '/the-gamesenselab/'` in `vite.config.js`, remove the repository custom-domain setting if configured, and omit `public/CNAME` from that temporary branch build. Deploy to `https://supun2001.github.io/the-gamesenselab/`. Set the base back to `/` and restore the CNAME file when moving to the custom domain. Use the matching Supabase redirect URL. Hash routes require no `404.html` workaround.

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
