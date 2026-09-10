export function authErrorMessage(failure, signup = false) {
  const messages = {
    email_not_confirmed: 'Please confirm your email before signing in.',
    signup_disabled: 'New account registration is currently disabled. Please contact support.',
    email_provider_disabled: 'Email registration is currently unavailable. Please contact support.',
    over_email_send_rate_limit:
      'The email sending limit has been reached. Please wait before trying again.',
    over_request_rate_limit: 'Too many attempts. Please wait a moment and try again.',
    email_address_invalid: 'This email address is not accepted. Please check it and try again.',
    email_address_not_authorized:
      'Confirmation emails cannot be sent to this address yet. Please contact support.',
    weak_password:
      'Your password does not meet the security requirements. Use a longer password with a mix of letters, numbers, and symbols.',
    user_already_exists: 'An account with this email already exists. Please sign in instead.',
    email_exists: 'An account with this email already exists. Please sign in instead.',
    invalid_credentials: 'Check your email and password, then try again.',
  }
  if (messages[failure?.code]) return messages[failure.code]
  if (failure?.status === 429) return messages.over_request_rate_limit
  if (failure?.name === 'AuthRetryableFetchError' || failure instanceof TypeError)
    return 'We couldn’t reach the sign-in service. Check your connection and try again.'
  if (signup && /database error saving new user/i.test(failure?.message || ''))
    return 'Your account could not be saved because of a database setup error. Please contact support.'
  if (failure?.status >= 500)
    return 'The sign-in service could not complete the request. Please try again shortly.'
  return signup
    ? 'We couldn’t create your account. Try again, or sign in if you already have an account.'
    : 'Sign in failed. Check your email and password, then try again.'
}
