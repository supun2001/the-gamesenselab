export const games = ['VALORANT', 'League of Legends', 'CS2', 'Fortnite', 'Dota 2', 'Other']
export const normalizeEmail = (email) => email.trim().toLowerCase()
export const validEmail = (email) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const normalizeTagline = (tagline = '') => tagline.trim().replace(/^#/, '')
export function waitlistPayload(form) {
  const valorant = form.main_game === 'VALORANT'
  return {
    first_name: form.first_name.trim(),
    email: normalizeEmail(form.email),
    main_game: form.main_game,
    rank: form.rank.trim() || null,
    valorant_name: valorant ? form.valorant_name?.trim() || null : null,
    valorant_tagline: valorant ? normalizeTagline(form.valorant_tagline) || null : null,
  }
}
export function validateWaitlist(form) {
  if (!form.first_name.trim() || form.first_name.trim().length > 80)
    return 'Enter your first name (up to 80 characters).'
  if (!validEmail(normalizeEmail(form.email))) return 'Enter a valid email address.'
  if (!games.includes(form.main_game)) return 'Choose your main game.'
  if (form.rank.trim().length > 80) return 'Keep your rank under 80 characters.'
  if (form.main_game === 'VALORANT') {
    const name = form.valorant_name?.trim() || ''
    const tagline = normalizeTagline(form.valorant_tagline)
    if (name || tagline) {
      if (!name || !tagline)
        return 'Enter both your VALORANT name and tagline, or leave both blank.'
      if (name.length > 80 || name.includes('#'))
        return 'Enter your VALORANT name without the #tagline (up to 80 characters).'
      if (tagline.length > 32 || /[\s#]/.test(tagline))
        return 'Enter a tagline without spaces or extra # characters (up to 32 characters).'
    }
  }
  return ''
}
export function validateAuth(form, signup = false) {
  if (signup && (!form.display_name.trim() || form.display_name.trim().length > 80))
    return 'Enter a display name (up to 80 characters).'
  if (!validEmail(normalizeEmail(form.email))) return 'Enter a valid email address.'
  if (!form.password) return 'Enter your password.'
  if (signup && form.password.length < 8) return 'Use a password with at least 8 characters.'
  if (signup && form.password !== form.confirm) return 'Your passwords do not match.'
  return ''
}
