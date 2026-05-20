import React from 'react'
import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/require-admin'
import { AdminSidebar } from './_components/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser()
  if (!admin) redirect('/auth/login?next=/admin')

  return (
    <div className="flex h-full">
      <AdminSidebar email={admin.email} />
      <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
