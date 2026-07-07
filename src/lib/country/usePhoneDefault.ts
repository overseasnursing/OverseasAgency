'use client'

import { useEffect, useRef } from 'react'
import { useSourceCountry } from './context'

/**
 * Defaults an empty phone/WhatsApp field to the resolved source country's
 * dial code, exactly once, the moment the real (cookie/profile-aware) value
 * resolves. Never overwrites a value the visitor has already typed — the
 * emptiness check runs only on that one transition, not on every keystroke.
 *
 * Shared by every public form that collects a phone number, so the
 * defaulting rule lives in one place instead of being reimplemented per form.
 */
export function usePhoneDefault(value: string, onDefault: (value: string) => void) {
  const { country, ready } = useSourceCountry()
  const appliedRef = useRef(false)

  useEffect(() => {
    if (!ready || appliedRef.current) return
    appliedRef.current = true
    if (!value.trim() && country.phoneCode) {
      onDefault(`${country.phoneCode} `)
    }
    // Only re-run when `ready` flips — `value`/`onDefault` are read at that
    // moment via closure, not tracked, so typing afterward never re-triggers this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])
}
