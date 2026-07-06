'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useCookieConsent } from './CookieConsentContext'

// The settings modal is only needed once a visitor actually opens it —
// keep it out of the initial JS bundle.
const CookieSettingsModal = dynamic(
  () => import('./CookieSettingsModal').then((m) => m.CookieSettingsModal),
  { ssr: false },
)

const SHOW_DELAY_MS = 2000

export function CookieConsentBanner() {
  const { hasChosen, acceptAll, rejectOptional, openSettings, isSettingsOpen } = useCookieConsent()
  const [bannerVisible, setBannerVisible] = useState(false)

  useEffect(() => {
    if (hasChosen) return
    const timer = setTimeout(() => setBannerVisible(true), SHOW_DELAY_MS)
    return () => clearTimeout(timer)
  }, [hasChosen])

  const showBanner = !hasChosen && bannerVisible

  return (
    <>
      {showBanner && (
        <div
          role="region"
          aria-label="Cookie consent"
          // bottom-[88px] clears the fixed MobileNav bar (72px + spacing) below the md breakpoint
          className="fixed inset-x-0 bottom-[88px] md:bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6 animate-slide-up pointer-events-none"
        >
          <div className="mx-auto max-w-2xl bg-white border border-slate-200 rounded-card shadow-card-lg p-5 sm:p-6 pointer-events-auto">
            <h2 className="text-[15px] font-bold text-slate-900 mb-1.5">Your Privacy Matters</h2>
            <p className="text-[13px] text-slate-500 leading-relaxed mb-3">
              We use cookies to keep OverseasNursing secure, remember your preferences, and improve
              your experience. Optional analytics cookies help us understand how the website is used.
              You can manage your preferences at any time.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4">
              <a
                href="/privacy"
                className="text-[12px] text-slate-400 hover:text-primary transition-colors underline underline-offset-2 decoration-slate-300"
              >
                Privacy Policy
              </a>
              <a
                href="/privacy#cookies"
                className="text-[12px] text-slate-400 hover:text-primary transition-colors underline underline-offset-2 decoration-slate-300"
              >
                Cookie Policy
              </a>
              <a
                href="/terms"
                className="text-[12px] text-slate-400 hover:text-primary transition-colors underline underline-offset-2 decoration-slate-300"
              >
                Terms &amp; Conditions
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={openSettings}
                className="sm:flex-1 h-10 px-4 text-primary hover:bg-primary/5 text-[13.5px] font-semibold rounded-xl transition-colors"
              >
                Cookie Settings
              </button>
              <button
                onClick={rejectOptional}
                className="sm:flex-1 h-10 px-4 border border-slate-200 hover:border-slate-300 text-slate-700 text-[13.5px] font-semibold rounded-xl transition-colors"
              >
                Reject Optional
              </button>
              <button
                onClick={acceptAll}
                className="sm:flex-1 h-10 px-4 bg-primary hover:bg-primary-hover text-white text-[13.5px] font-semibold rounded-xl transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {isSettingsOpen && <CookieSettingsModal />}
    </>
  )
}
