'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getSourceCountryByName } from '@/lib/data/countryList'
import { getSourceCountryContext, setPreferredSourceCountry, type AvailableCountry } from '@/app/actions/source-country'
import type { ResolvedSourceCountry } from '@/types/sourceCountry'

// Shown immediately on first paint, before the real (cookie/profile-aware)
// value resolves — same "safe default, then resolve after mount" shape
// NavbarClient already uses for auth state, so there's no SSR/CSR mismatch.
const DEFAULT_COUNTRY: ResolvedSourceCountry = {
  name: 'India', isoCode: 'IN', phoneCode: '+91', currencyCode: 'INR', currencySymbol: '₹', enabled: true,
}

// Matches Phase 2's stated supported set — corrected by the real fetch below
// the moment it resolves, so this is only ever visible for one paint.
const DEFAULT_AVAILABLE: AvailableCountry[] = [
  { name: 'India', isoCode: 'IN' },
  { name: 'Philippines', isoCode: 'PH' },
]

type SourceCountryContextValue = {
  country: ResolvedSourceCountry
  available: AvailableCountry[]
  /** False until the real cookie/profile-aware value has resolved. */
  ready: boolean
  setCountry: (name: string) => Promise<void>
}

const SourceCountryContext = createContext<SourceCountryContextValue | null>(null)

export function SourceCountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState]     = useState<ResolvedSourceCountry>(DEFAULT_COUNTRY)
  const [available, setAvailable]      = useState<AvailableCountry[]>(DEFAULT_AVAILABLE)
  const [ready, setReady]              = useState(false)

  useEffect(() => {
    getSourceCountryContext()
      .then(({ current, available }) => {
        setCountryState(current)
        setAvailable(available)
        setReady(true)
      })
      .catch(() => {
        // Resolution failed — keep the default and mark ready so the
        // switcher doesn't spin forever. Guests must still work perfectly.
        setReady(true)
      })
  }, [])

  const setCountry = useCallback(async (name: string) => {
    // Optimistic local update from the static Registry (no round trip) so
    // the switcher feels instant; persisted in the background, then
    // reconciled with the server's authoritative result.
    const local = getSourceCountryByName(name)
    if (local) {
      setCountryState(prev => ({
        name:           local.name,
        isoCode:        local.isoCode,
        phoneCode:      local.phoneCode      ?? prev.phoneCode,
        currencyCode:   local.currencyCode   ?? prev.currencyCode,
        currencySymbol: local.currencySymbol ?? prev.currencySymbol,
        enabled:        true,
      }))
    }
    const result = await setPreferredSourceCountry(name)
    setCountryState(result.country)
  }, [])

  const value = useMemo<SourceCountryContextValue>(
    () => ({ country, available, ready, setCountry }),
    [country, available, ready, setCountry],
  )

  return (
    <SourceCountryContext.Provider value={value}>
      {children}
    </SourceCountryContext.Provider>
  )
}

/** Components must always read the source country through this hook — never via cookies or a direct DB/action call. */
export function useSourceCountry(): SourceCountryContextValue {
  const ctx = useContext(SourceCountryContext)
  if (!ctx) throw new Error('useSourceCountry must be used within SourceCountryProvider')
  return ctx
}
