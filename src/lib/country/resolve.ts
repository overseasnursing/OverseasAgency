import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSourceCountryByName } from '@/lib/data/countryList'
import { isSourceCountryEnabled } from '@/lib/db/country-settings'
import { readPreferredCountryCookie, readSuggestedCountryCookie } from '@/lib/cookies/sourceCountry'
import type { ResolvedSourceCountry } from '@/types/sourceCountry'

const PLATFORM_DEFAULT = 'India'

async function toResolved(name: string): Promise<ResolvedSourceCountry | null> {
  const entry = getSourceCountryByName(name)
  if (!entry) return null
  if (!(await isSourceCountryEnabled(name))) return null
  return {
    name:           entry.name,
    isoCode:        entry.isoCode,
    phoneCode:      entry.phoneCode      ?? '',
    currencyCode:   entry.currencyCode   ?? 'INR',
    currencySymbol: entry.currencySymbol ?? '₹',
    enabled:        true,
  }
}

function defaultResolved(): ResolvedSourceCountry {
  const fallback = getSourceCountryByName(PLATFORM_DEFAULT)!
  return {
    name:           fallback.name,
    isoCode:        fallback.isoCode,
    phoneCode:      fallback.phoneCode      ?? '+91',
    currencyCode:   fallback.currencyCode   ?? 'INR',
    currencySymbol: fallback.currencySymbol ?? '₹',
    enabled:        true,
  }
}

/**
 * Resolves the source country.
 *
 * Pass `explicit` when the caller already has a definitive value — e.g. the
 * admin form saving a specific agency's own source_country (Phase 1). That
 * value is validated/normalized and returned directly; this path never reads
 * the current visitor's own cookies or profile, since an admin editing
 * someone else's data must not be influenced by their own browsing preference.
 *
 * Call with no argument to resolve the CURRENT VISITOR's context, in
 * priority order:
 *   1. Logged-in profile (users.preferred_source_country)
 *   2. pref_country cookie (explicit prior choice)
 *   3. suggested_country cookie (geo hint set by middleware)
 *   4. Platform default (India)
 *
 * The no-argument form reads cookies/session — only call it from a Server
 * Action or Route Handler invoked after the initial page load (e.g. the
 * client-side country context's mount effect), never from a page/layout
 * server component. Calling it there would opt every page that includes
 * that layout into dynamic rendering, which Phase 2 explicitly must not do.
 */
export async function resolveSourceCountry(explicit?: string | null): Promise<ResolvedSourceCountry> {
  if (explicit !== undefined) {
    const trimmed = explicit?.trim()
    if (trimmed) {
      const resolved = await toResolved(trimmed)
      if (resolved) return resolved
    }
    return defaultResolved()
  }

  // 1. Logged-in profile
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = createAdminClient() as any
      const { data } = await db
        .from('users')
        .select('preferred_source_country')
        .eq('id', user.id)
        .maybeSingle()
      if (data?.preferred_source_country) {
        const resolved = await toResolved(data.preferred_source_country)
        if (resolved) return resolved
      }
    }
  } catch {
    // Auth/DB lookup failed — fall through to cookie-based resolution rather
    // than blocking. Guests must work perfectly regardless.
  }

  // 2. Explicit cookie choice
  const prefCookie = await readPreferredCountryCookie()
  if (prefCookie) {
    const resolved = await toResolved(prefCookie)
    if (resolved) return resolved
  }

  // 3. Geo-suggested cookie (middleware)
  const suggestedCookie = await readSuggestedCountryCookie()
  if (suggestedCookie) {
    const resolved = await toResolved(suggestedCookie)
    if (resolved) return resolved
  }

  // 4. Default
  return defaultResolved()
}
