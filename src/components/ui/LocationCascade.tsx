'use client'

import React, { useMemo, useEffect, useRef } from 'react'
import { FormSelect } from './FormSelect'
import {
  getAllCountries,
  getStatesOfCountry,
  getCitiesOfState,
  findCountryIso,
  findStateIso,
  INDIA_ISO,
} from '@/lib/data/locationPicker'

/**
 * mode:
 *  'country-state-city' — full three-level cascade
 *  'state-city'         — state + city only (country locked to India)
 *  'country-only'       — single country select
 */
export type LocationCascadeMode = 'country-state-city' | 'state-city' | 'country-only'

interface LocationCascadeProps {
  mode?: LocationCascadeMode
  /** Display name of selected country (stored in DB, not ISO code) */
  country?: string | null
  /**
   * Directly supply a country ISO code to drive the state/city lists
   * without showing a country selector (e.g. when country is already chosen elsewhere).
   */
  countryIsoOverride?: string | null
  /** Display name of selected state */
  state: string | null
  /** Display name of selected city */
  city?: string | null
  onCountryChange?: (label: string | null) => void
  onStateChange: (label: string | null) => void
  onCityChange?: (label: string | null) => void
  /** Additional wrapper className */
  className?: string
}

export function LocationCascade({
  mode = 'state-city',
  country = null,
  countryIsoOverride = null,
  state,
  city = null,
  onCountryChange,
  onStateChange,
  onCityChange,
  className = '',
}: LocationCascadeProps) {
  const allCountries = useMemo(() => getAllCountries(), [])

  // Resolve ISO codes from display names for cascading lookups
  const countryIso = useMemo(() => {
    if (countryIsoOverride) return countryIsoOverride
    if (mode === 'state-city') return INDIA_ISO
    if (!country) return null
    return findCountryIso(country)
  }, [mode, country, countryIsoOverride])

  const stateIso = useMemo(() => {
    if (!countryIso || !state) return null
    return findStateIso(countryIso, state)
  }, [countryIso, state])

  const stateOptions  = useMemo(() => countryIso ? getStatesOfCountry(countryIso) : [], [countryIso])
  const cityOptions   = useMemo(() => (countryIso && stateIso) ? getCitiesOfState(countryIso, stateIso) : [], [countryIso, stateIso])

  // When country changes, reset downstream
  const prevCountryRef = useRef(country)
  useEffect(() => {
    if (prevCountryRef.current !== country) {
      prevCountryRef.current = country
      onStateChange(null)
      onCityChange?.(null)
    }
  }, [country]) // eslint-disable-line react-hooks/exhaustive-deps

  // When state changes, reset city
  const prevStateRef = useRef(state)
  useEffect(() => {
    if (prevStateRef.current !== state) {
      prevStateRef.current = state
      onCityChange?.(null)
    }
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Country — shown only in 'full' mode */}
      {mode === 'country-state-city' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-slate-600">Country</label>
          <FormSelect
            options={allCountries}
            value={country ?? null}
            onChange={(label) => onCountryChange?.(label)}
            placeholder="Select country…"
          />
        </div>
      )}

      {/* State */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold text-slate-600">State</label>
        <FormSelect
          options={stateOptions}
          value={state}
          onChange={(label) => onStateChange(label)}
          placeholder={countryIso ? 'Select state…' : 'Select country first'}
          disabled={!countryIso}
        />
      </div>

      {/* City — hidden in 'country-only' mode */}
      {mode !== 'country-only' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-slate-600">City</label>
          <FormSelect
            options={cityOptions}
            value={city ?? null}
            onChange={(label) => onCityChange?.(label)}
            placeholder={stateIso ? 'Select city…' : 'Select state first'}
            disabled={!stateIso}
          />
        </div>
      )}
    </div>
  )
}

/** Convenience: a standalone country-only select matching form input styling */
export function CountrySelect({
  value,
  onChange,
  placeholder = 'Select country…',
}: {
  value: string | null
  onChange: (label: string | null) => void
  placeholder?: string
}) {
  const allCountries = useMemo(() => getAllCountries(), [])
  return (
    <FormSelect
      options={allCountries}
      value={value}
      onChange={(label) => onChange(label)}
      placeholder={placeholder}
    />
  )
}
