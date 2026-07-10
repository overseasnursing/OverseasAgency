import { cookies } from 'next/headers'

/** Explicit user choice — trusted directly by resolveSourceCountry(). */
export const PREF_COUNTRY_COOKIE = 'pref_country'

/**
 * Geo-detected guess set by middleware (see src/middleware.ts). Lowest
 * priority in the resolver's chain — never overrides an explicit choice, and
 * middleware only sets it when neither cookie already exists.
 */
export const SUGGESTED_COUNTRY_COOKIE = 'suggested_country'

const MAX_AGE_SECONDS = 60 * 60 * 24 * 365 // 1 year

/**
 * next/headers-based helpers — for Server Components/Actions/Route Handlers
 * only. Middleware uses NextRequest/NextResponse's own cookie API instead
 * (incompatible surface) but imports the two name constants above from here
 * so the cookie name isn't duplicated as a magic string.
 */

export async function readPreferredCountryCookie(): Promise<string | null> {
  const jar = await cookies()
  return jar.get(PREF_COUNTRY_COOKIE)?.value ?? null
}

export async function readSuggestedCountryCookie(): Promise<string | null> {
  const jar = await cookies()
  return jar.get(SUGGESTED_COUNTRY_COOKIE)?.value ?? null
}

export async function writePreferredCountryCookie(name: string): Promise<void> {
  const jar = await cookies()
  jar.set(PREF_COUNTRY_COOKIE, name, { maxAge: MAX_AGE_SECONDS, path: '/', sameSite: 'lax' })
}
