# Google Analytics 4

Measurement ID: `G-F9PJTVXGL2` (public configuration, not a secret).

The website uses a consent-gated Google tag. No Google Analytics script loads until the visitor allows analytics. The choice is stored in `gsl-analytics-consent-v1`; Cookie settings in the footer reopens the controls. Withdrawal disables analytics, deletes accessible `_ga` cookies and reloads to unload Google's listeners. Localhost and preview hosts do not send analytics.

## Google Analytics settings before deployment

In Admin → Data streams → select the website stream, turn **Enhanced measurement off**. The application explicitly sends its own page views and successful waitlist events. This avoids duplicate history-based page views and unwanted automatic form or URL collection. `send_page_view: false` alone does not disable Enhanced measurement history tracking.

Optionally mark `generate_lead` as a key event in Analytics. This event is sent only after a successful new waitlist insert, not a duplicate entry, failed request or membership lookup.

Review the property's data retention settings and choose the retention period appropriate to the site. No Ads integration or Google Signals is enabled by this application.

## Deployment and verification

Publish through the existing GitHub Pages workflow. No extra build secret is required.

1. On the deployed domain, clear the site's analytics choice and open browser Network tools. Before consent and after declining, no request to googletagmanager.com or Google Analytics should occur.
2. Allow analytics. Confirm one Google tag loads and the current page appears in Realtime. Navigate between pages; each route should send one page view. In-page anchors should not count as new page views.
3. With consent, submit a new test waitlist entry only when ready to create a real row and trigger its welcome email. Confirm `generate_lead`. A duplicate must not emit another lead.
4. Inspect event payloads: no form details, account identifiers, query strings or auth tokens should appear. Route locations are constructed from an allowlist; referrers are blank.
5. Withdraw via Cookie settings. The page reloads and analytics requests stop. Reload again to verify that rejection persists.

Local tests verify consent gating, route deduplication, payload boundaries, cookie cleanup and production-host restrictions. Actual Google delivery needs verification on the deployed site with access to the property's Realtime reports.

References:

- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/analytics/devguides/collection/ga4/views
