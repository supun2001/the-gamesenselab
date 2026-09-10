import test from 'node:test'
import assert from 'node:assert/strict'
import { authErrorMessage } from '../src/lib/auth-errors.js'

test('signup reports configuration and email delivery failures distinctly', () => {
  assert.match(authErrorMessage({ code: 'signup_disabled' }, true), /disabled/)
  assert.match(
    authErrorMessage({ code: 'over_email_send_rate_limit', status: 429 }, true),
    /email sending limit/,
  )
  assert.match(
    authErrorMessage({ code: 'email_address_not_authorized' }, true),
    /Confirmation emails/,
  )
  assert.match(
    authErrorMessage({ message: 'Database error saving new user', status: 500 }, true),
    /database setup error/,
  )
})

test('network failure does not masquerade as invalid credentials', () => {
  assert.match(authErrorMessage({ name: 'AuthRetryableFetchError' }), /connection/)
  assert.match(authErrorMessage({ code: 'invalid_credentials' }), /email and password/)
})

test('unknown backend details are not exposed in the UI', () => {
  const message = authErrorMessage({ message: 'private database diagnostic', status: 500 }, true)
  assert.doesNotMatch(message, /private database diagnostic/)
  assert.match(message, /service/)
})
