/**
 * Cookie consent storage — pure functions, no React dependency, so any
 * future script (analytics, embeds) can check consent without importing
 * the context/provider.
 */

export type ConsentChoice = 'accepted-all' | 'rejected-optional' | 'custom'

export interface CookiePreferences {
  necessary: true
  analytics: boolean
}

export interface StoredConsent {
  version: number
  choice: ConsentChoice
  preferences: CookiePreferences
  updatedAt: string
}

// Bump this when the cookie policy materially changes — every visitor,
// including ones who already chose, will be re-prompted.
export const COOKIE_POLICY_VERSION = 1

const STORAGE_KEY = 'on_cookie_consent'

export const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
}

export function readStoredConsent(): StoredConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredConsent
    if (parsed.version !== COOKIE_POLICY_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function writeStoredConsent(choice: ConsentChoice, preferences: CookiePreferences): StoredConsent {
  const record: StoredConsent = {
    version: COOKIE_POLICY_VERSION,
    choice,
    preferences,
    updatedAt: new Date().toISOString(),
  }
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
    } catch {
      // localStorage unavailable (private browsing / disabled) — the choice
      // won't persist and the banner will reappear next visit. Non-fatal.
    }
  }
  return record
}

/** Read-only helper for non-React consumers (e.g. a future analytics loader). */
export function hasAnalyticsConsent(): boolean {
  return readStoredConsent()?.preferences.analytics === true
}
