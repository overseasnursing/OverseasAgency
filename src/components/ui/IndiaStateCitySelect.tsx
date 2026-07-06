'use client'

import React, { useMemo, useRef, useEffect } from 'react'
import { FormSelect } from './FormSelect'
import { INDIA_STATES } from '@/lib/data/indiaLocations'

/**
 * India-only state/city cascade for public forms (scam reports, reviews)
 * that only ever collect an Indian home location. Deliberately avoids
 * `country-state-city` (a ~2MB-gzipped world dataset) — see
 * src/lib/data/indiaLocations.ts for why. Use `LocationCascade` instead
 * when a form genuinely needs non-India states/cities.
 */
interface IndiaStateCitySelectProps {
  state: string | null
  city?: string | null
  onStateChange: (label: string | null) => void
  onCityChange?: (label: string | null) => void
  className?: string
}

export function IndiaStateCitySelect({
  state,
  city = null,
  onStateChange,
  onCityChange,
  className = '',
}: IndiaStateCitySelectProps) {
  const stateOptions = useMemo(
    () => INDIA_STATES.map((s) => ({ label: s.name, value: s.code })),
    [],
  )

  const selectedState = useMemo(
    () => INDIA_STATES.find((s) => s.name === state),
    [state],
  )

  const cityOptions = useMemo(
    () => selectedState ? selectedState.cities.map((c) => ({ label: c, value: c })) : [],
    [selectedState],
  )

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
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold text-slate-600">State</label>
        <FormSelect
          options={stateOptions}
          value={state}
          onChange={(label) => onStateChange(label)}
          placeholder="Select state…"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold text-slate-600">City</label>
        <FormSelect
          options={cityOptions}
          value={city}
          onChange={(label) => onCityChange?.(label)}
          placeholder={selectedState ? 'Select city…' : 'Select state first'}
          disabled={!selectedState}
        />
      </div>
    </div>
  )
}
