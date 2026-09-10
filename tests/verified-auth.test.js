import test from 'node:test'
import assert from 'node:assert/strict'
import { getVerifiedSession, signInVerified } from '../src/lib/verified-auth.js'

test('unverified login is signed out and never returns a session', async () => {
  let signedOut = false
  const client = {
    auth: {
      signInWithPassword: async () => ({
        data: { session: {}, user: { id: 'user-1', email_confirmed_at: null } },
      }),
      signOut: async () => {
        signedOut = true
        return {}
      },
    },
  }
  await assert.rejects(signInVerified(client, {}), { code: 'email_not_confirmed' })
  assert.equal(signedOut, true)
})

test('verified login returns the authenticated session', async () => {
  const session = { access_token: 'test-only' }
  const client = {
    auth: {
      signInWithPassword: async () => ({
        data: { session, user: { id: 'user-1', email_confirmed_at: '2026-09-10T00:00:00Z' } },
      }),
    },
  }
  assert.equal(await signInVerified(client, {}), session)
})

test('invalid credentials stop login without an account-existence lookup', async () => {
  const client = {
    auth: { signInWithPassword: async () => ({ error: { code: 'invalid_credentials' } }) },
  }
  await assert.rejects(signInVerified(client, {}), { code: 'invalid_credentials' })
})

test('restored session checks the server user instead of trusting local confirmation', async () => {
  const client = {
    auth: {
      getSession: async () => ({
        data: { session: { user: { id: 'user-1', email_confirmed_at: 'locally-edited' } } },
      }),
      getUser: async () => ({ data: { user: { id: 'user-1', email_confirmed_at: null } } }),
    },
  }
  assert.equal(await getVerifiedSession(client), null)
  client.auth.getUser = async () => ({ error: new Error('Session expired') })
  await assert.rejects(getVerifiedSession(client), /Session expired/)
})
