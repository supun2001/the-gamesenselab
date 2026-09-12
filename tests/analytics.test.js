import test from 'node:test'
import assert from 'node:assert/strict'
import { createAnalytics, consentKey, measurementId } from '../src/lib/analytics.js'

function setup(saved = null, hostname = 'thegamesenselab.com') {
  const scripts = [],
    cookies = []
  let reloads = 0
  const browser = {
    localStorage: {
      getItem: () => saved,
      setItem: (_, value) => {
        saved = value
      },
    },
    location: {
      hostname,
      reload: () => {
        reloads++
      },
    },
    document: {
      createElement: () => ({}),
      head: { appendChild: (script) => scripts.push(script) },
      get cookie() {
        return '_ga=123; _ga_F9PJTVXGL2=456; auth=keep'
      },
      set cookie(value) {
        cookies.push(value)
      },
    },
  }
  const analytics = createAnalytics(browser)
  const events = () =>
    (browser.dataLayer || []).map((args) => [...args]).filter((args) => args[0] === 'event')
  return { analytics, browser, scripts, cookies, events, reloads: () => reloads }
}

test('no Google script or events before consent or after rejection', () => {
  const ctx = setup()
  ctx.analytics.page('/', 'Home')
  ctx.analytics.waitlistJoined()
  ctx.analytics.choose('rejected')
  ctx.analytics.page('/privacy', 'Privacy')
  assert.equal(ctx.scripts.length, 0)
  assert.deepEqual(ctx.events(), [])
})

test('acceptance sends only current page; repeat calls do not duplicate it', () => {
  const ctx = setup()
  ctx.analytics.page('/', 'Home')
  ctx.analytics.page('/privacy', 'Privacy')
  ctx.analytics.choose('accepted')
  ctx.analytics.choose('accepted')
  ctx.analytics.page('/privacy', 'Privacy')
  assert.equal(ctx.scripts.length, 1)
  assert.equal(ctx.events().length, 1)
  assert.equal(ctx.events()[0][2].page_path, '/privacy')
  ctx.analytics.page('/', 'Home')
  assert.equal(ctx.events().length, 2)
})

test('payloads exclude arbitrary URLs and supplied lead data', () => {
  const ctx = setup('accepted')
  ctx.analytics.page('/', 'Home')
  ctx.analytics.page('/login?token=secret', 'Sensitive')
  ctx.analytics.waitlistJoined({ email: 'private@example.com', name: 'Private' })
  const payload = JSON.stringify(ctx.events())
  assert.doesNotMatch(payload, /secret|private@example|Sensitive/)
  assert.equal(ctx.events()[1][1], 'generate_lead')
  assert.equal(ctx.events()[1][2].page_referrer, '')
})

test('withdrawal disables collection, clears only GA cookies and reloads', () => {
  const ctx = setup('accepted')
  ctx.analytics.page('/', 'Home')
  ctx.analytics.choose('rejected')
  ctx.analytics.waitlistJoined()
  ctx.analytics.page('/privacy', 'Privacy')
  assert.equal(ctx.events().length, 1)
  assert.equal(ctx.browser[`ga-disable-${measurementId}`], true)
  assert.equal(ctx.reloads(), 1)
  assert.equal(ctx.cookies.length, 6)
  assert.ok(ctx.cookies.every((cookie) => !cookie.includes('auth=')))
})

test('local previews never load Google even with consent', () => {
  const ctx = setup('accepted', 'localhost')
  ctx.analytics.page('/', 'Home')
  ctx.analytics.waitlistJoined()
  assert.equal(ctx.scripts.length, 0)
})

test('unavailable storage does not break consent or page navigation', () => {
  const ctx = setup()
  ctx.browser.localStorage = {
    getItem() {
      throw Error('blocked')
    },
    setItem() {
      throw Error('blocked')
    },
  }
  const analytics = createAnalytics(ctx.browser)
  analytics.page('/', 'Home')
  analytics.choose('accepted')
  assert.equal(analytics.consent, 'accepted')
  assert.equal(ctx.scripts.length, 1)
  assert.equal(consentKey, 'gsl-analytics-consent-v1')
})
