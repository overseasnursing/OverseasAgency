'use client'

import { useCookieConsent } from './CookieConsentContext'

/**
 * Persistent entry point for reopening cookie settings after the initial
 * banner has been dismissed — lives in the footer alongside Privacy/Terms.
 */
export function CookiePreferencesLink() {
  const { openSettings } = useCookieConsent()
  return (
    <button
      type="button"
      onClick={openSettings}
      className="text-[13px] text-slate-400 hover:text-primary transition-colors"
    >
      Cookie Preferences
    </button>
  )
}
