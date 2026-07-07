'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Menu, X, User, LayoutDashboard, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CountrySwitcher } from './CountrySwitcher'

const NAV_LINKS = [
  { href: '/',             label: 'Home' },
  { href: '/agencies',     label: 'Agencies' },
  { href: '/mock-tests',   label: 'Mock Test' },
  { href: '/eligibility',  label: 'Check Eligibility' },
  { href: '/scam-reports', label: 'Scam Report' },
  { href: '/countries',    label: 'Countries' },
  { href: '/exam',         label: 'Exams' },
]

export function NavbarClient() {
  const router  = useRouter()
  const dropRef = useRef<HTMLDivElement>(null)

  const [menuOpen,   setMenuOpen]   = useState(false)
  const [dropOpen,   setDropOpen]   = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  // null  = loading (same on server and client — no hydration mismatch)
  // ''    = signed out
  // name  = signed in
  const [userName, setUserName]   = useState<string | null>(null)
  const [ready,    setReady]      = useState(false)

  /* Fetch real auth state once on mount, then keep live */
  useEffect(() => {
    const supabase = createClient()

    function nameFrom(user: { user_metadata?: Record<string, string>; email?: string } | null) {
      if (!user) return ''
      return user.user_metadata?.full_name
        ?? user.user_metadata?.name
        ?? user.email?.split('@')[0]
        ?? 'Account'
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserName(nameFrom(user))
      setReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserName(nameFrom(session?.user ?? null))
      setReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  /* Scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* Close dropdown on outside click */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false)
    }
    if (dropOpen) document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [dropOpen])

  async function handleSignOut() {
    setSigningOut(true)
    setDropOpen(false)
    setMenuOpen(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    setUserName('')
    setSigningOut(false)
    router.push('/')
    router.refresh()
  }

  const isSignedIn = ready && !!userName
  const initials   = isSignedIn
    ? userName!.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : ''

  return (
    <>
      {/* Scroll shadow */}
      {scrolled && (
        <div aria-hidden="true" className="fixed top-0 left-0 right-0 h-[68px] z-40 pointer-events-none shadow-nav" />
      )}

      {/* ── Desktop auth slot ── */}
      <div className="hidden lg:flex items-center gap-2">
        {!ready ? (
          /* Skeleton — same on server & first client paint, no mismatch */
          <div className="w-24 h-9 bg-slate-100 rounded-xl animate-pulse" />
        ) : isSignedIn ? (
          /* Signed-in user chip + dropdown */
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setDropOpen(o => !o)}
              className="flex items-center gap-2 h-9 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                {initials
                  ? <span className="text-[10px] font-bold text-white leading-none">{initials}</span>
                  : <User size={12} className="text-white" />
                }
              </div>
              <span className="text-[13px] font-medium text-slate-700 max-w-[120px] truncate">
                {userName}
              </span>
            </button>

            {dropOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                <a
                  href="/dashboard"
                  onClick={() => setDropOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <LayoutDashboard size={14} className="text-slate-400" /> Dashboard
                </a>
                <div className="border-t border-slate-100" />
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <LogOut size={14} className="text-red-400" />
                  {signingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Sign-in button */
          <a
            href="/auth/login"
            className="ml-1 inline-flex items-center px-4 py-2 text-[13px] font-semibold text-primary border border-primary/25 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all"
          >
            Sign in
          </a>
        )}
      </div>

      {/* ── Mobile hamburger ── */}
      <button
        onClick={() => setMenuOpen(v => !v)}
        className="lg:hidden flex items-center justify-center w-11 h-11 -mr-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="lg:hidden absolute top-[68px] left-0 right-0 bg-white border-t border-b border-slate-100 shadow-card-md z-30">
          <div className="max-w-content mx-auto px-5 sm:px-6 py-3 flex flex-col">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="flex items-center h-12 px-1 text-[15px] font-medium text-slate-700 hover:text-primary border-b border-slate-50 last:border-none transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}

            <div className="flex items-center justify-between gap-2 py-3 border-b border-slate-50">
              <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">Country</span>
              <CountrySwitcher />
            </div>

            <div className="pt-4 pb-3 flex flex-col gap-2">
              {isSignedIn ? (
                <>
                  <div className="flex items-center gap-2 px-1 pb-2 border-b border-slate-100">
                    <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-bold text-white">{initials || '?'}</span>
                    </div>
                    <span className="text-[13px] font-medium text-slate-700 truncate">{userName}</span>
                  </div>
                  <a
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full h-11 text-[14px] font-semibold text-primary border border-primary/25 rounded-xl transition-colors"
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </a>
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex items-center justify-center gap-2 w-full h-11 text-[14px] font-semibold text-red-600 border border-red-100 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <LogOut size={15} /> {signingOut ? 'Signing out…' : 'Sign out'}
                  </button>
                </>
              ) : (
                <a
                  href="/auth/login"
                  className="flex items-center justify-center w-full h-12 text-[14px] font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in to your account
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
