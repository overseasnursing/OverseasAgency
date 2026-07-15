import React from 'react'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from './_components/DashboardSidebar'

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

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <DashboardSidebar name={displayName} email={user.email ?? ''} />
      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
