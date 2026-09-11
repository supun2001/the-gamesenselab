# Activate waitlist welcome emails

This is separate from the Auth confirmation template. New `public.waitlist` inserts queue a branded welcome email in the same transaction. A scheduled Edge Function sends through your existing Namecheap Private Email mailbox. The frontend needs no SMTP credentials or extra request. Existing waitlist entries are not automatically emailed.

The message includes your wording, logo, offer conditions, and the Gamesense AI Coach Whop link. Preview `supabase/waitlist-welcome.html`. Edit the source in `supabase/functions/waitlist-welcome/email.js`, then redeploy the function to change future emails. Do not put this email in **Confirm signup**.

## 1. Add the queue

Run `supabase/migrations/20260911_waitlist_welcome_email.sql` in your project's SQL Editor. This works with your existing waitlist table; do not rerun `schema.sql`. New projects should run the migration after `schema.sql` too.

## 2. Add server secrets

In **Supabase → Edge Functions → Secrets**, add:

| Name                     | Value                                    |
| ------------------------ | ---------------------------------------- |
| `WAITLIST_SMTP_USER`     | `verification@thegamesenselab.com`       |
| `WAITLIST_SMTP_PASSWORD` | Your current Namecheap SMTP app password |
| `WAITLIST_WORKER_SECRET` | A new random secret of at least 32 bytes |

Generate the worker secret with a password manager or `openssl rand -hex 32`. Store the **same value** in **Supabase Vault** under the name `waitlist_worker_secret`. The cron job reads that Vault value; it must match the Edge Function secret. Never put either secret in `VITE_*`, GitHub files, or this document. Supabase provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` automatically to the function.

The worker uses `mail.privateemail.com:465` over TLS and replies go to `contact@thegamesenselab.com`. Auth SMTP settings are not automatically shared with Edge Functions, so the separate SMTP secret is necessary.

## 3. Deploy the function

From the project directory, using the Supabase CLI:

```sh
npx supabase login
npx supabase functions deploy waitlist-welcome --project-ref xhlvxxeaobztxohjuhko
```

The checked-in `supabase/config.toml` disables platform JWT verification for this worker. Its own private `X-Worker-Secret` header authenticates every request instead. Do not call it from the frontend or put the worker secret in browser code. If deploying through the dashboard, upload all three files from the function directory and disable **Verify JWT** for this function.

## 4. Activate the schedule

Run `supabase/schedule-waitlist-email.sql` in the SQL Editor. It enables `pg_cron` and `pg_net` and schedules the worker every minute. No website redeployment is needed to activate this feature on the existing waitlist form.

## 5. Verify delivery

Join the waitlist with a **new email address you control**. Within about a minute (plus SMTP delivery time), it should receive the welcome message. A duplicate email is rejected by the existing unique constraint and does not create another message.

Inspect delivery state in SQL Editor:

```sql
select waitlist_id, status, attempts, sent_at, last_error, created_at
from public.waitlist_email_queue
order by created_at desc
limit 50;
```

`sent` means SMTP accepted the message, not proof that it reached the inbox. Check spam too. `pending` retries after 2, 4, 8 and 16 minutes; after five failed attempts it becomes `failed`. An interrupted job can be reclaimed after its five-minute lease expires. Check the function logs, Cron job history and `net._http_response` for invocation problems. A 401 indicates mismatched worker secrets; `smtp_send_failed` requires checking the mailbox credential, provider limits and connectivity. No raw SMTP errors, addresses or passwords are logged by application code.

After fixing a failed job, retry just that row:

```sql
update public.waitlist_email_queue
set status = 'pending', attempts = 0, available_at = now(),
    claim_token = null, last_error = null
where waitlist_id = 'REPLACE_WITH_WAITLIST_UUID' and status = 'failed';
```

Each invocation sends at most three messages. Reduce the schedule or batch if necessary to stay within your mailbox's sending allowance. A large backlog takes longer than one minute. Claims prevent simultaneous sends and sent jobs are skipped; SMTP cannot guarantee exactly-once delivery if a process stops after provider acceptance but before recording success. Retries reuse a stable Message-ID, but a rare duplicate is still possible.

To pause sending: `select cron.unschedule('gamesense-waitlist-welcome');`. Queueing continues while paused. For an unsubscribe request, remove the person's waitlist row; its queued message is deleted by the foreign key cascade. Monitor the contact inbox for these requests. A message already being sent cannot be recalled.

Implementation prepared locally; activation and real SMTP delivery must be verified in your project. Do not bulk backfill old signups without deciding to send them this message.

References: [Supabase scheduled functions](https://supabase.com/docs/guides/functions/schedule-functions), [Supabase SMTP function example](https://github.com/supabase/supabase/blob/master/examples/edge-functions/supabase/functions/send-email-smtp/index.ts).
