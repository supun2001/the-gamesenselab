export type FormKind = 'waitlist' | 'team' | 'contact'
export const kinds: FormKind[] = ['waitlist', 'team', 'contact']
export const consentVersion = 'altheia-updates-v1'
const games = ['CS2', 'VALORANT', 'League of Legends', 'Dota 2', 'Fortnite', 'Other']
const categories = [
  'General',
  'Team testing',
  'Creator partnership',
  'Business enquiry',
  'Privacy request',
]
export class ValidationError extends Error {}
export function validate(
  kind: FormKind,
  input: unknown,
): Record<string, string | number | boolean | null> {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new ValidationError('Please check your form details.')
  const data = input as Record<string, unknown>
  const common = ['email', 'token', 'website']
  const fields =
    kind === 'waitlist'
      ? ['game', 'role', 'marketingConsent']
      : kind === 'team'
        ? ['name', 'game', 'teamSize', 'level', 'challenge', 'permission']
        : ['name', 'category', 'message']
  if (Object.keys(data).some((key) => ![...common, ...fields].includes(key)))
    throw new ValidationError('Unexpected form field.')
  const string = (key: string, max: number, required = false) => {
    if (data[key] === undefined && !required) return ''
    if (typeof data[key] !== 'string') throw new ValidationError(`Please check ${key}.`)
    const value = (data[key] as string).trim()
    if (value.length > max || (required && !value))
      throw new ValidationError(`Please check ${key}.`)
    return value
  }
  const email = string('email', 254, true).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new ValidationError('Enter a valid email address.')
  const game = () => {
    const value = string('game', 40, kind === 'team')
    if (value && !games.includes(value)) throw new ValidationError('Choose a listed game.')
    return value || null
  }
  if (kind === 'waitlist') {
    const role = string('role', 30)
    if (role && !['individual', 'team'].includes(role))
      throw new ValidationError('Choose your player type.')
    if (typeof data.marketingConsent !== 'boolean')
      throw new ValidationError('Please check your updates preference.')
    return {
      email,
      game: game(),
      role: role || null,
      marketing_consent: data.marketingConsent,
      consent_version: data.marketingConsent ? consentVersion : null,
    }
  }
  const name = string('name', 100, true)
  if (kind === 'team') {
    if (
      typeof data.teamSize !== 'number' ||
      !Number.isInteger(data.teamSize) ||
      data.teamSize < 2 ||
      data.teamSize > 100
    )
      throw new ValidationError('Enter a team size between 2 and 100.')
    if (data.permission !== true)
      throw new ValidationError('Please allow us to contact you about team interest.')
    return {
      name,
      email,
      game: game(),
      team_size: data.teamSize,
      level: string('level', 100) || null,
      challenge: string('challenge', 2000, true),
      contact_permission: true,
      consent_version: 'altheia-team-contact-v1',
    }
  }
  const category = string('category', 40, true)
  if (!categories.includes(category)) throw new ValidationError('Choose an enquiry category.')
  return { name, email, category, message: string('message', 4000, true) }
}
