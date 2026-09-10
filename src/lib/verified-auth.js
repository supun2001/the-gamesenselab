export const isEmailVerified = (user) => Boolean(user?.id && user?.email_confirmed_at)

// Supabase's Confirm email setting enforces this on the server. This check also
// prevents the UI from accepting an unconfirmed user returned by a session flow.
export async function signInVerified(client, credentials) {
  const { data, error } = await client.auth.signInWithPassword(credentials)
  if (error) throw error
  if (!data?.session || !isEmailVerified(data.user)) {
    await client.auth.signOut({ scope: 'local' })
    throw { code: 'email_not_confirmed' }
  }
  return data.session
}

export async function getVerifiedSession(client) {
  const { data, error } = await client.auth.getSession()
  if (error) throw error
  if (!data.session) return null
  // Verify with Supabase instead of trusting only browser-stored user data.
  const { data: verified, error: verificationError } = await client.auth.getUser()
  if (verificationError) throw verificationError
  if (!isEmailVerified(verified.user)) return null
  return { ...data.session, user: verified.user }
}
