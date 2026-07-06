import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, BookOpen, Briefcase, LogOut } from 'lucide-react'

// Authenticated, per-user pages — must never be indexed. robots.txt alone
// doesn't stop indexing of a URL that's already linked/known elsewhere.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/dashboard')

  const displayName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'User'
  const initials    = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Topbar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left: logo + nav */}
            <div className="flex items-center gap-6">
              <Link href="/" className="text-[14px] font-bold text-primary">
                OverseasNursing
              </Link>
              <nav className="flex items-center gap-1">
                <Link href="/dashboard"
                  className="flex items-center gap-1.5 h-8 px-3 text-[13px] font-medium text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  <LayoutDashboard size={13} /> Overview
                </Link>
                <Link href="/dashboard/mock-tests"
                  className="flex items-center gap-1.5 h-8 px-3 text-[13px] font-medium text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  <BookOpen size={13} /> Mock Tests
                </Link>
                <Link href="/dashboard/applications"
                  className="flex items-center gap-1.5 h-8 px-3 text-[13px] font-medium text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  <Briefcase size={13} /> My Applications
                </Link>
              </nav>
            </div>

            {/* Right: user + sign out */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                  {initials}
                </div>
                <span className="hidden sm:block text-[13px] text-slate-700 font-medium max-w-[130px] truncate">
                  {displayName}
                </span>
              </div>
              <form action="/auth/signout" method="post">
                <button type="submit"
                  className="flex items-center gap-1.5 h-8 px-3 text-[12.5px] font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200 hover:border-red-100">
                  <LogOut size={12} /> Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </div>
    </div>
  )
}
