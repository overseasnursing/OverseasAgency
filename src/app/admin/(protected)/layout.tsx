import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin-auth'
import { AdminSidebar } from './_components/AdminSidebar'

async function getAdminEmail(): Promise<string | null> {
  const jar   = await cookies()
  const token = jar.get(COOKIE_NAME)?.value
  return token ? verifySessionToken(token) : null
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const email = await getAdminEmail()
  if (!email) redirect('/admin/login')

  return (
    <div className="flex h-full">
      <AdminSidebar email={email} />
      <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
