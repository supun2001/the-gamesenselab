# Send confirmation emails as GameSense Lab

Supabase remains the account, password-hash, verification-token, profile, and waitlist store. A custom SMTP provider delivers the confirmation email from `verification@thegamesenselab.com`. The provider necessarily processes recipients, message contents, and delivery logs; this does not create a second application user database. SMTP does not replace Supabase Auth.

## Configure the sender

Use the existing **Namecheap Private Email** mailbox. The domain is registered at Namecheap, DNS is managed in Cloudflare, and the website is hosted on GitHub Pages. Email DNS records belong in Cloudflare; the website hosting does not need to change.

1. In Namecheap Private Email, confirm the mailbox is active. Use a current mailbox password; never commit it to this project.
2. In Cloudflare DNS, check the following records. The public DNS check during setup found both MX records and the SPF record below, but no DKIM record at either documented selector and no DMARC record. These are observations, not changes applied to your DNS.

   | Type | Name                      | Content                                                  | Priority |
   | ---- | ------------------------- | -------------------------------------------------------- | -------- |
   | MX   | @                         | `mx1.privateemail.com`                                   | 10       |
   | MX   | @                         | `mx2.privateemail.com`                                   | 10       |
   | TXT  | @                         | `v=spf1 include:spf.privateemail.com ~all`               | —        |
   | TXT  | Namecheap's DKIM selector | Exact DKIM value from your Namecheap Private Email panel | —        |
   | TXT  | `_dmarc`                  | Your reviewed DMARC policy                               | —        |

   Copy the DKIM name and value exactly from Namecheap. Namecheap documents `privateemail._domainkey` for subscriptions purchased on or after June 2, 2026, and `default._domainkey` for older subscriptions. Do not invent the key. Start a new DMARC rollout with monitoring (`v=DMARC1; p=none`) if needed, then move to quarantine/reject after confirming all legitimate senders authenticate; preserve a stronger existing policy. Only include a reporting address if that mailbox exists and you intend it to receive reports. Avoid duplicate SPF records and preserve the GitHub Pages A/CNAME records. Use TTL Auto.

3. In Supabase **Authentication → Email → SMTP Settings** (or Custom SMTP in Authentication settings), enable custom SMTP and enter:

   | Setting      | Value                                        |
   | ------------ | -------------------------------------------- |
   | Sender email | `verification@thegamesenselab.com`           |
   | Sender name  | `GameSense Lab`                              |
   | SMTP host    | `mail.privateemail.com`                      |
   | Port         | `465` (TLS)                                  |
   | Username     | `verification@thegamesenselab.com`           |
   | Password     | Your current Namecheap mailbox SMTP password |

   Namecheap also supports port `587` with STARTTLS. If your mailbox plan requires an app password for SMTP, use the credential specified by Namecheap for that plan. Enter the password only in Supabase's SMTP settings, never in a `VITE_*` variable, GitHub source, or browser code. A mailbox password is not a Supabase dashboard login.

4. Under **Authentication → Sign In / Providers → Email**, enable **Confirm email**. If the dashboard offers **Allow unverified email sign in**, leave it disabled. This is the server-side enforcement. The app also checks confirmation before displaying the dashboard.
5. Under Authentication's email templates, choose **Confirm signup**, set the subject to **Confirm your GameSense Lab email**, and paste `supabase/confirm-signup.html`. Keep `{{ .ConfirmationURL }}` intact; it is Supabase’s token-bearing verification URL. Disable link tracking in the mail provider to avoid changing that URL.
6. Keep the Site URL and redirect allowlist described in the main README. The Vue application uses PKCE and a base-URL callback; open the email in the browser used for signup.
7. Review Supabase Auth email rate limits after configuring SMTP, and align them with your provider’s allowed sending rate.

## Verify the complete flow

- Register a new test account using an address you control. Confirm the message arrives from `verification@thegamesenselab.com`.
- Before clicking the email, try signing in: Supabase must return `email_not_confirmed`, and no dashboard should open.
- Click the email confirmation, then sign in. Confirm the user exists in Authentication → Users and the display name is in `public.user_profiles`.
- Test an incorrect password and a nonexistent account; both should fail authentication. There is no public query exposing whether an email is registered.
- Accounts created while confirmation was disabled were automatically confirmed. Turning the setting back on does not prove ownership of those older addresses; use a new test account to validate this flow.

No DNS or Supabase SMTP settings have been changed by adding these files. The Supabase dashboard required sign-in, so SMTP configuration and live delivery testing remain pending.

References: [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [email templates](https://supabase.com/docs/guides/auth/auth-email-templates), [auth configuration](https://supabase.com/docs/guides/auth/general-configuration).

Namecheap references: [SMTP settings](https://www.namecheap.com/support/knowledgebase/article.aspx/1179/2175/general-private-email-configuration-for-mail-clients-and-mobile-devices/), [Cloudflare DNS records](https://www.namecheap.com/support/knowledgebase/article.aspx/9967/2176/how-to-set-up-dns-records-for-namecheap-email-service-with-cloudflare-cpanel-and-private-email/).
