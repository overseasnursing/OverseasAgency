'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X, ShieldCheck, BarChart3 } from 'lucide-react'
import { useCookieConsent } from './CookieConsentContext'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative w-10 h-6 rounded-full flex-shrink-0 transition-colors ${
        checked ? 'bg-primary' : 'bg-slate-200'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-card transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export function CookieSettingsModal() {
  const { preferences, isSettingsOpen, closeSettings, acceptAll, savePreferences } = useCookieConsent()
  const [analytics, setAnalytics] = useState(preferences.analytics)
  const panelRef = useRef<HTMLDivElement>(null)

  // Sync local toggle state whenever the modal (re)opens with current saved preference.
  useEffect(() => {
    if (isSettingsOpen) setAnalytics(preferences.analytics)
  }, [isSettingsOpen, preferences.analytics])

  // Lock background scroll while open.
  useEffect(() => {
    if (!isSettingsOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isSettingsOpen])

  // Focus the panel on open so screen readers announce it immediately.
  useEffect(() => {
    if (isSettingsOpen) panelRef.current?.focus()
  }, [isSettingsOpen])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      closeSettings()
      return
    }
    if (e.key !== 'Tab' || !panelRef.current) return

    const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  if (!isSettingsOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop — this modal IS an explicit, user-initiated action, so a backdrop is appropriate here */}
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={closeSettings}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-card shadow-card-lg animate-slide-up outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 id="cookie-settings-title" className="text-[17px] font-bold text-slate-900">
            Cookie Settings
          </h2>
          <button
            onClick={closeSettings}
            aria-label="Close cookie settings"
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Categories */}
        <div className="px-6 flex flex-col gap-4">
          {/* Necessary */}
          <div className="flex items-start justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck size={15} className="text-primary" />
              </div>
              <div>
                <p className="text-[13.5px] font-semibold text-slate-800">Necessary Cookies</p>
                <p className="text-[12.5px] text-slate-500 leading-relaxed mt-0.5">
                  Required for security, authentication, and core website functionality.
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-1">Always enabled &middot; cannot be disabled</p>
              </div>
            </div>
            <Toggle checked disabled label="Necessary cookies (always enabled)" />
          </div>

          {/* Analytics */}
          <div className="flex items-start justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BarChart3 size={15} className="text-primary" />
              </div>
              <div>
                <p className="text-[13.5px] font-semibold text-slate-800">Analytics Cookies</p>
                <p className="text-[12.5px] text-slate-500 leading-relaxed mt-0.5">
                  Help us understand how visitors use OverseasNursing so we can improve the platform.
                </p>
              </div>
            </div>
            <Toggle checked={analytics} onChange={setAnalytics} label="Analytics cookies" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 px-6 pt-5 pb-6">
          <button
            onClick={() => { savePreferences({ necessary: true, analytics }); closeSettings() }}
            className="h-10 px-4 bg-primary hover:bg-primary-hover text-white text-[13.5px] font-semibold rounded-xl transition-colors"
          >
            Save Preferences
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => { acceptAll(); closeSettings() }}
              className="flex-1 h-10 px-4 border border-slate-200 hover:border-slate-300 text-slate-700 text-[13px] font-semibold rounded-xl transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={closeSettings}
              className="flex-1 h-10 px-4 text-slate-500 hover:bg-slate-100 text-[13px] font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
