import test from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizeEmail,
  validateWaitlist,
  validateAuth,
  waitlistPayload,
} from '../src/lib/validation.js'

const entry = { first_name: 'Hanzo', email: 'player@example.com', main_game: 'VALORANT', rank: '' }
test('VALORANT name and tagline are trimmed and saved separately', () => {
  const form = { ...entry, valorant_name: ' Hanzo ', valorant_tagline: ' #EUW ' }
  assert.equal(validateWaitlist(form), '')
  assert.deepEqual(waitlistPayload(form), {
    ...entry,
    rank: null,
    valorant_name: 'Hanzo',
    valorant_tagline: 'EUW',
  })
})
test('Riot ID is optional but incomplete or malformed IDs are rejected', () => {
  assert.equal(validateWaitlist(entry), '')
  for (const patch of [
    { valorant_name: 'Hanzo' },
    { valorant_tagline: '#EUW' },
    { valorant_name: 'Hanzo#EUW', valorant_tagline: 'EUW' },
    { valorant_name: 'Hanzo', valorant_tagline: 'E UW' },
    { valorant_name: 'Hanzo', valorant_tagline: '##EUW' },
    { valorant_name: 'H'.repeat(81), valorant_tagline: 'EUW' },
    { valorant_name: 'Hanzo', valorant_tagline: 'E'.repeat(33) },
  ])
    assert.ok(validateWaitlist({ ...entry, ...patch }))
})
test('switching games does not submit hidden VALORANT identity fields', () => {
  const form = { ...entry, main_game: 'CS2', valorant_name: 'Hanzo', valorant_tagline: '##invalid' }
  assert.equal(validateWaitlist(form), '')
  const payload = waitlistPayload(form)
  assert.equal(payload.valorant_name, null)
  assert.equal(payload.valorant_tagline, null)
})
test('valid waitlist accepts optional rank and normalizes email', () => {
  assert.equal(validateWaitlist(entry), '')
  assert.equal(normalizeEmail(' Player@EXAMPLE.com '), 'player@example.com')
})
test('waitlist rejects invalid fields before submission', () => {
  for (const patch of [
    { first_name: ' ' },
    { email: 'player@' },
    { email: 'a b@example.com' },
    { main_game: 'unknown' },
    { rank: 'a'.repeat(81) },
  ]) {
    assert.ok(validateWaitlist({ ...entry, ...patch }))
  }
})
test('signup requires a display name and matching strong-enough passwords', () => {
  const form = {
    display_name: 'Hanzo',
    email: entry.email,
    password: 'test-pass-123',
    confirm: 'test-pass-123',
  }
  assert.equal(validateAuth(form, true), '')
  for (const patch of [
    { display_name: '' },
    { password: 'short', confirm: 'short' },
    { confirm: 'different' },
    { email: 'invalid' },
  ]) {
    assert.ok(validateAuth({ ...form, ...patch }, true))
  }
})
test('login does not apply new-password rules to existing credentials', () => {
  assert.equal(validateAuth({ email: entry.email, password: 'legacy' }), '')
  assert.ok(validateAuth({ email: entry.email, password: '' }))
})
