import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { pricing, site, money } from '../src/config/site.ts'
test('planned annual fees, monthly equivalents and allowances use approved figures', () => {
  assert.equal(pricing.single, 349)
  assert.equal(money(pricing.single), '$3.49')
  for (const plan of pricing.plans) {
    assert.equal(
      plan.annualCents,
      Math.round(plan.monthlyCents * 12 * (1 - pricing.annualDiscount / 100)),
    )
    assert.equal(plan.equivalentCents, Math.round(plan.annualCents / 12))
    assert.equal(plan.yearlyReviews, plan.reviews * 12)
  }
  assert.equal(site.launch.annualPaymentsEnabled, false)
  assert.equal(site.launch.salesEnabled, false)
  assert.equal(pricing.usageApproved, false)
  assert.equal(pricing.currency, 'USD')
})
test('new database tables expose no public signup policies', () => {
  const sql = readFileSync('supabase/migrations/20261007_altheia_forms.sql', 'utf8')
  for (const name of ['waitlist', 'team_interest', 'enquiries', 'rate_limits'])
    assert.ok(sql.includes(`alter table public.altheia_${name} enable row level security`))
  assert.match(sql, /from public, anon, authenticated/)
  assert.doesNotMatch(sql, /create policy/i)
})
