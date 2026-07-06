'use client'

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import {
  type CookiePreferences,
  type ConsentChoice,
  DEFAULT_PREFERENCES,
  readStoredConsent,
  writeStoredConsent,
} from '@/lib/cookies/consent'

interface CookieConsentContextValue {
  /** False until the visitor has made a choice (accept/reject/save) — banner shows only then. */
  hasChosen: boolean
  preferences: CookiePreferences
  /** Convenience flag for gating optional analytics scripts. */
  analyticsAllowed: boolean
  acceptAll: () => void
  rejectOptional: () => void
  savePreferences: (preferences: CookiePreferences) => void
  isSettingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null)

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  // Lazy-init from localStorage so there's no flash of the wrong state after hydration.
  const [stored, setStored] = useState(() => readStoredConsent())
  const [isSettingsOpen, setSettingsOpen] = useState(false)
  const openerRef = useRef<HTMLElement | null>(null)

  const preferences = stored?.preferences ?? DEFAULT_PREFERENCES
  const hasChosen = stored !== null

  const commit = useCallback((choice: ConsentChoice, prefs: CookiePreferences) => {
    setStored(writeStoredConsent(choice, prefs))
  }, [])

  const acceptAll = useCallback(() => {
    commit('accepted-all', { necessary: true, analytics: true })
  }, [commit])

  const rejectOptional = useCallback(() => {
    commit('rejected-optional', { necessary: true, analytics: false })
  }, [commit])

  const savePreferences = useCallback((prefs: CookiePreferences) => {
    commit('custom', prefs)
  }, [commit])

  const openSettings = useCallback(() => {
    openerRef.current = document.activeElement as HTMLElement | null
    setSettingsOpen(true)
  }, [])

  const closeSettings = useCallback(() => {
    setSettingsOpen(false)
    // Return focus to whatever triggered the modal (banner button or footer link).
    openerRef.current?.focus?.()
  }, [])

  const value = useMemo<CookieConsentContextValue>(() => ({
    hasChosen,
    preferences,
    analyticsAllowed: preferences.analytics,
    acceptAll,
    rejectOptional,
    savePreferences,
    isSettingsOpen,
    openSettings,
    closeSettings,
  }), [hasChosen, preferences, acceptAll, rejectOptional, savePreferences, isSettingsOpen, openSettings, closeSettings])

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext)
  if (!ctx) throw new Error('useCookieConsent must be used within CookieConsentProvider')
  return ctx
}
