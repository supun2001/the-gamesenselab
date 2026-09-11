import { createClient } from 'npm:@supabase/supabase-js@2.116.0'
import nodemailer from 'npm:nodemailer@9.1.1'
import { html, text, subject } from './email.js'
import { createWorker } from './worker.js'

function required(name: string): string {
  const value = Deno.env.get(name)
  if (!value) throw new Error(`Missing configuration: ${name}`)
  return value
}
const secret = required('WAITLIST_WORKER_SECRET')
const user = required('WAITLIST_SMTP_USER')
const transport = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  secure: true,
  auth: { user, pass: required('WAITLIST_SMTP_PASSWORD') },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  disableFileAccess: true,
  disableUrlAccess: true,
})
const db = createClient(required('SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { persistSession: false, autoRefreshToken: false },
})
type Job = { waitlist_id: string; email: string; attempts: number; claim_token: string }
async function update(job: Job, patch: Record<string, unknown>) {
  const { data, error } = await db
    .from('waitlist_email_queue')
    .update(patch)
    .eq('waitlist_id', job.waitlist_id)
    .eq('claim_token', job.claim_token)
    .eq('status', 'sending')
    .select('waitlist_id')
  if (error || data?.length !== 1) throw new Error('Queue update failed')
}
Deno.serve(
  createWorker({
    secret,
    claim: async () => {
      const { data, error } = await db.rpc('claim_waitlist_email')
      if (error) throw new Error('Queue claim failed')
      return data?.[0] ?? null
    },
    send: async (job: Job) => {
      const result = await transport.sendMail({
        from: { name: 'GameSense Lab', address: user },
        to: { address: job.email, name: '' },
        replyTo: 'contact@thegamesenselab.com',
        messageId: `<waitlist-${job.waitlist_id}@thegamesenselab.com>`,
        subject,
        html,
        text,
        headers: {
          'List-Unsubscribe': '<mailto:contact@thegamesenselab.com?subject=Waitlist%20unsubscribe>',
        },
      })
      if (!result.accepted?.length)
        throw Object.assign(new Error('SMTP rejected recipient'), { code: 'EENVELOPE' })
    },
    complete: (job: Job) =>
      update(job, {
        status: 'sent',
        sent_at: new Date().toISOString(),
        last_error: null,
      }),
    fail: (job: Job, failureCode: string) =>
      update(job, {
        status: job.attempts >= 5 ? 'failed' : 'pending',
        last_error: failureCode,
        available_at: new Date(Date.now() + 2 ** job.attempts * 60000).toISOString(),
      }),
  }),
)
