import React from 'react'
import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { JobForm } from '../_components/JobForm'
import type { JobRow } from '@/lib/db/jobs'

interface PageProps {
  params: Promise<{ id: string }>
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending:  { label: 'Pending',  className: 'bg-[#FEF9C3] text-[#854D0E]' },
  approved: { label: 'Approved', className: 'bg-[#DCFCE7] text-[#166534]' },
  hold:     { label: 'Hold',     className: 'bg-[#FEF3C7] text-[#92400E]' },
  rejected: { label: 'Rejected', className: 'bg-[#FEE2E2] text-[#B91C1C]' },
  expired:  { label: 'Expired',  className: 'bg-slate-100 text-slate-500' },
}

export default async function EditJobPage({ params }: PageProps) {
  await requirePermission('jobs')
  const { id } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data: job } = await db.from('jobs').select('*').eq('id', id).single()
  if (!job) notFound()

  const badge = STATUS_BADGE[job.status] ?? STATUS_BADGE.pending

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <p className="text-[12px] text-slate-400 mb-1">
          <a href="/admin/jobs" className="hover:text-slate-600 transition-colors">Jobs</a>
          {' / Edit'}
        </p>
        <h1 className="text-[22px] font-bold text-slate-900 line-clamp-1">{job.title}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full ${badge.className}`}>
            {badge.label}
          </span>
          <span className="text-[12px] text-slate-400">
            {job.country}{job.city ? ` · ${job.city}` : ''}
          </span>
        </div>
      </div>
      <JobForm initialData={job as JobRow} />
    </div>
  )
}
