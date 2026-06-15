import React from 'react'
import { redirect } from 'next/navigation'
import { getAdminUser, isSuperAdmin } from '@/lib/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { AdminSidebar } from './_components/AdminSidebar'

async function fetchPendingCounts() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createAdminClient() as any
    const [reviews, examReviews, scamReports, newAgencies, claimRequests, jobs] = await Promise.all([
      db.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      db.from('mock_test_reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      db.from('scam_reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      db.from('agency_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      db.from('claim_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending_approval'),
      db.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ])
    return {
      '/admin/reviews':             reviews.count      ?? 0,
      '/admin/mock-test-reviews':   examReviews.count  ?? 0,
      '/admin/scam-reports':        scamReports.count  ?? 0,
      '/admin/agency-submissions':  newAgencies.count  ?? 0,
      '/admin/claim-listings':      claimRequests.count ?? 0,
      '/admin/jobs':                jobs.count         ?? 0,
    } as Record<string, number>
  } catch {
    return {} as Record<string, number>
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser()
  if (!admin) redirect('/auth/login?next=/admin')

  const badges = await fetchPendingCounts()

  return (
    <div className="flex h-full">
      <AdminSidebar
        email={admin.email}
        name={admin.name}
        isSuperAdmin={isSuperAdmin(admin)}
        permissions={admin.permissions}
        badges={badges}
      />
      <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
