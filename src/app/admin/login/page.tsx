'use client'

import React, { useState } from 'react'
import { Shield, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })

      if (res.ok) {
        window.location.href = '/admin'
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Login failed. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_4px_16px_rgba(15,76,129,0.25)]">
            <Shield size={22} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-[22px] font-bold text-slate-900 mb-1">Admin Login</h1>
          <p className="text-[13.5px] text-slate-400">OverseasNursing — restricted access</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_24px_rgba(15,76,129,0.07)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                  className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-xl text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-xl text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-xl">
                <AlertCircle size={14} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                <p className="text-[12.5px] text-[#B91C1C] leading-snug">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="flex items-center justify-center gap-2 h-11 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13.5px] font-semibold rounded-xl transition-colors mt-1"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <>
                  Sign in to Admin
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11.5px] text-slate-400 mt-5">
          This area is restricted to authorised administrators only.
        </p>
      </div>
    </div>
  )
}
