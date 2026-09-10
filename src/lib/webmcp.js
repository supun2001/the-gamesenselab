import { nextTick } from 'vue'
import { validateWaitlist } from './validation.js'

// Optional progressive enhancement; no effect in browsers without WebMCP.
export function registerWaitlistTool(form) {
  if (!document.modelContext?.registerTool) return () => {}
  const lifecycle = new AbortController()
  try {
    Promise.resolve(
      document.modelContext.registerTool(
        {
          name: 'stage_waitlist_entry',
          title: 'Prepare a GameSense Lab waitlist entry',
          description:
            'Fill the visible waitlist form for review. Does not submit data or join the waitlist; the user submits the form.',
          inputSchema: {
            type: 'object',
            properties: {
              first_name: { type: 'string', maxLength: 80 },
              email: { type: 'string', maxLength: 254 },
              main_game: {
                type: 'string',
                enum: ['VALORANT', 'League of Legends', 'CS2', 'Fortnite', 'Dota 2', 'Other'],
              },
              rank: { type: 'string', maxLength: 80 },
              valorant_name: { type: 'string', maxLength: 80 },
              valorant_tagline: { type: 'string', maxLength: 33 },
            },
            required: ['first_name', 'email', 'main_game'],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          async execute(input) {
            if (
              !input ||
              typeof input !== 'object' ||
              Object.keys(input).some(
                (key) =>
                  ![
                    'first_name',
                    'email',
                    'main_game',
                    'rank',
                    'valorant_name',
                    'valorant_tagline',
                  ].includes(key),
              )
            )
              return { error: 'Invalid form input.' }
            const entry = {
              ...input,
              rank: input.rank ?? '',
              valorant_name: input.valorant_name ?? '',
              valorant_tagline: input.valorant_tagline ?? '',
            }
            if (
              [
                'first_name',
                'email',
                'main_game',
                'rank',
                'valorant_name',
                'valorant_tagline',
              ].some((key) => typeof entry[key] !== 'string')
            )
              return { error: 'Form fields must be text.' }
            const error = validateWaitlist(entry)
            if (error) return { error }
            Object.assign(form, entry)
            await nextTick()
            document.getElementById('waitlist')?.scrollIntoView()
            return { status: 'prepared_for_review', submitted: false }
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => {})
  } catch {
    /* Unsupported experimental implementations must not break the form. */
  }
  return () => lifecycle.abort()
}
