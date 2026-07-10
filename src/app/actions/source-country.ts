'use server'

import { createClient } from '@/lib/supabase/server'
import { writePreferredCountryCookie } from '@/lib/cookies/sourceCountry'
import { updatePreferredSourceCountry } from '@/lib/db/users'
import { getEnabledSourceCountries } from '@/lib/db/country-settings'
import { getSourceCountryByName } from '@/lib/data/countryList'
import { resolveSourceCountry } from '@/lib/country/resolve'
import type { ResolvedSourceCountry } from '@/types/sourceCountry'

export type AvailableCountry = { name: string; isoCode: string }

/**
 * Called client-side once after mount (see SourceCountryProvider) — resolves
 * the visitor's real context (profile/cookie/geo-aware) plus the current
 * enabled-country list, in one round trip so the switcher only ever needs a
 * single fetch to render its real state.
 */
export async function getSourceCountryContext(): Promise<{
  current: ResolvedSourceCountry
  available: AvailableCountry[]
}> {
  const [current, enabledNames] = await Promise.all([
    resolveSourceCountry(),
    getEnabledSourceCountries(),
  ])
  const available = enabledNames
    .map(name => getSourceCountryByName(name))
    .filter((c): c is NonNullable<typeof c> => !!c)
    .map(c => ({ name: c.name, isoCode: c.isoCode }))
  return { current, available }
}

/**
 * Persists an explicit country choice from the switcher: cookie immediately
 * (works for guests), profile sync if logged in. Returns the authoritative
 * resolved value so the caller can reconcile its optimistic local update —
 * if the requested country wasn't registered/enabled, `ok` is false and
 * `country` reflects what was actually applied (the platform default)
 * instead of silently pretending the requested change succeeded.
 */
export async function setPreferredSourceCountry(
  name: string,
): Promise<{ ok: boolean; country: ResolvedSourceCountry }> {
  const resolved = await resolveSourceCountry(name)
  if (resolved.name !== name) {
    return { ok: false, country: resolved }
  }

  await writePreferredCountryCookie(resolved.name)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await updatePreferredSourceCountry(user.id, resolved.name)
  }

  return { ok: true, country: resolved }
}
