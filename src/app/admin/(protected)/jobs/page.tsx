import React from 'react'
import { requirePermission } from '@/lib/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { approveJob, holdJob, rejectJob } from '@/app/actions/admin-jobs'
import { CheckCircle, XCircle, Clock, Plus, AlertTriangle } from 'lucide-react'
import { getJobExpiryStatus } from '@/lib/jobConstants'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20

const TABS = [
  { key: 'pending',  label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'hold',     label: 'Hold' },
]

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending:  { label: 'Pending',  className: 'bg-[#FEF9C3] text-[#854D0E]' },
  approved: { label: 'Approved', className: 'bg-[#DCFCE7] text-[#166534]' },
  hold:     { label: 'Hold',     className: 'bg-[#FEF3C7] text-[#92400E]' },
  rejected: { label: 'Rejected', className: 'bg-[#FEE2E2] text-[#B91C1C]' },
  expired:  { label: 'Expired',  className: 'bg-slate-100 text-slate-500' },
}

const EXPIRY_BADGE: Record<'expired' | 'expiring_soon', { label: string; className: string }> = {
  expired:       { label: 'Expired',      className: 'bg-[#FEE2E2] text-[#B91C1C]' },
  expiring_soon: { label: 'Expiring soon', className: 'bg-[#FEF3C7] text-[#92400E]' },
}

function ExpiryCell({ expiryDate }: { expiryDate: string }) {
  const expiryStatus = getJobExpiryStatus(expiryDate)
  const formatted = new Date(expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const badge = expiryStatus !== 'active' ? EXPIRY_BADGE[expiryStatus] : null
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-500">{formatted}</span>
      {badge && (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-semibold rounded-full ${badge.className}`}>
          <AlertTriangle size={9} /> {badge.label}
        </span>
      )}
    </div>
  )
}

interface PageProps {
  searchParams: Promise<{ tab?: string; page?: string }>
}

export default async function AdminJobsPage({ searchParams }: PageProps) {
  await requirePermission('jobs')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { tab = 'pending', page: pageStr = '1' } = await searchParams
  const activeTab = TABS.find(t => t.key === tab)?.key ?? 'pending'
  const page      = Math.max(1, Number(pageStr) || 1)
  const from      = (page - 1) * PAGE_SIZE
  const to        = from + PAGE_SIZE - 1

  const { data: jobs, count } = await db
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('status', activeTab)
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  // Tab badge counts
  const [pendingRes, approvedRes, holdRes] = await Promise.all([
    db.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    db.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'hold'),
  ])
  const tabCounts: Record<string, number> = {
    pending:  pendingRes.count  ?? 0,
    approved: approvedRes.count ?? 0,
    hold:     holdRes.count     ?? 0,
  }

  // Resolve poster names
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userIds = [...new Set((jobs ?? []).map((j: any) => j.posted_by_user_id as string))]
  let userMap: Record<string, string> = {}
  if (userIds.length > 0) {
    const { data: users } = await db
      .from('users')
      .select('id, email, display_name')
      .in('id', userIds)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userMap = Object.fromEntries((users ?? []).map((u: any) => [u.id as string, (u.display_name ?? u.email) as string]))
  }

  function buildHref(p: number) {
    return `/admin/jobs?tab=${activeTab}&page=${p}`
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 mb-1">Jobs</h1>
          <p className="text-[13px] text-slate-500">
            {count ?? 0} job{(count ?? 0) !== 1 ? 's' : ''} · {activeTab}
          </p>
        </div>
        <a
          href="/admin/jobs/new"
          className="flex items-center gap-2 h-9 px-4 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
        >
          <Plus size={14} /> New Job
        </a>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 self-start">
        {TABS.map(t => (
          <a
            key={t.key}
            href={`/admin/jobs?tab=${t.key}&page=1`}
            className={`px-3 py-1.5 text-[12.5px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === t.key
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
            {tabCounts[t.key] !== undefined && (
              <span className="ml-1.5 text-[11px] text-slate-400">{tabCounts[t.key]}</span>
            )}
          </a>
        ))}
      </div>

      {/* Table */}
      {!jobs?.length ? (
        <div className="text-center py-16 text-slate-400 text-[14px]">
          No {activeTab} jobs.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="border-b border-slate-100">
              <tr className="text-left">
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Job Title</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Country</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Posted By</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">Created</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">Expires</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(jobs ?? []).map((job: any) => {
                const badge = STATUS_BADGE[job.status] ?? STATUS_BADGE.pending
                return (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 max-w-[220px]">
                      <a
                        href={`/admin/jobs/${job.id}`}
                        className="font-medium text-slate-800 hover:text-primary transition-colors line-clamp-1 block"
                      >
                        {job.title}
                      </a>
                      {job.city && (
                        <p className="text-[11.5px] text-slate-400 mt-0.5">{job.city}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{job.country}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-[12px] max-w-[160px] truncate">
                      {userMap[job.posted_by_user_id] ?? '—'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-[12px] whitespace-nowrap">
                      {new Date(job.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-[12px] whitespace-nowrap">
                      <ExpiryCell expiryDate={job.expiry_date} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {job.status !== 'approved' && (
                          <form action={async () => { 'use server'; await approveJob(job.id) }}>
                            <button
                              type="submit"
                              className="flex items-center gap-1 h-7 px-2.5 bg-[#166534] hover:bg-[#14532d] text-white text-[11.5px] font-semibold rounded-lg transition-colors"
                            >
                              <CheckCircle size={11} /> Approve
                            </button>
                          </form>
                        )}
                        {job.status !== 'hold' && (
                          <form action={async () => { 'use server'; await holdJob(job.id) }}>
                            <button
                              type="submit"
                              className="flex items-center gap-1 h-7 px-2.5 border border-[#D97706] text-[#92400E] hover:bg-[#FEF3C7] text-[11.5px] font-semibold rounded-lg transition-colors"
                            >
                              <Clock size={11} /> Hold
                            </button>
                          </form>
                        )}
                        {job.status !== 'rejected' && (
                          <form action={async () => { 'use server'; await rejectJob(job.id) }}>
                            <button
                              type="submit"
                              className="flex items-center gap-1 h-7 px-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-[11.5px] font-semibold rounded-lg transition-colors"
                            >
                              <XCircle size={11} /> Reject
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={count ?? 0}
        pageSize={PAGE_SIZE}
        buildHref={buildHref}
        itemLabel="jobs"
      />
    </div>
  )
}
