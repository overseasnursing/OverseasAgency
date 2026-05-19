'use client'

import React, { useState } from 'react'
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const supabase = createClient()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // email confirmations disabled — user is immediately active
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-[24px] font-bold text-slate-900 mb-2">Create account</h1>
          <p className="text-[14px] text-slate-500">
            Join nurses sharing experiences to protect each other
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">

          <form onSubmit={handleSignUp} className="flex flex-col gap-3">

            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5" htmlFor="name">
                Display name
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (shown on reviews)"
                  required
                  autoComplete="name"
                  className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-xl text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-xl text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-xl text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-xl">
                <AlertCircle size={13} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#B91C1C] leading-snug">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !name || !email || !password}
              className="flex items-center justify-center gap-2 h-10 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13.5px] font-semibold rounded-xl transition-colors mt-1"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[12.5px] text-slate-500">
            Already have an account?{' '}
            <a href="/auth/login" className="text-primary font-semibold hover:underline">
              Sign in
            </a>
          </p>

        </div>

        <p className="text-center text-[12px] text-slate-400 mt-5">
          By creating an account, you agree to submit only truthful information.
          False reports are a violation of our terms.
        </p>
      </div>
    </div>
  )
}
