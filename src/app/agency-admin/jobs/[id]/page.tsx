import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { AgencyJobForm } from '../_components/AgencyJobForm'
import type { JobRow } from '@/lib/db/jobs'

interface PageProps {
  params: Promise<{ id: string }>
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending:  { label: 'Pending — under review', className: 'bg-[#FEF9C3] text-[#854D0E]' },
  approved: { label: 'Approved — live',        className: 'bg-[#DCFCE7] text-[#166534]' },
  hold:     { label: 'On hold',                className: 'bg-[#FEF3C7] text-[#92400E]' },
  rejected: { label: 'Rejected',               className: 'bg-[#FEE2E2] text-[#B91C1C]' },
  expired:  { label: 'Expired',                className: 'bg-slate-100 text-slate-500' },
}

export default async function EditAgencyJobPage({ params }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/agency-admin/jobs')

  const role     = user.app_metadata?.role as string | undefined
  const agencyId = user.app_metadata?.agency_id as string | undefined
  if (role !== 'agency_admin' || !agencyId) redirect('/?error=unauthorized')

  const { id } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data: job } = await db.from('jobs').select('*').eq('id', id).single()

  // Strict ownership check — not found if job belongs to another agency
  if (!job || job.agency_id !== agencyId) notFound()

  const badge = STATUS_BADGE[job.status] ?? STATUS_BADGE.pending

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[12px] text-slate-400 mb-1">
          <a href="/agency-admin/jobs" className="hover:text-slate-600 transition-colors">My Jobs</a>
          {' / Edit'}
        </p>
        <h1 className="text-[22px] font-bold text-slate-900 line-clamp-2">{job.title}</h1>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={`inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full ${badge.className}`}>
            {badge.label}
          </span>
          <span className="text-[12px] text-slate-400">
            {job.country}{job.city ? ` · ${job.city}` : ''}
          </span>
        </div>
        {job.status === 'rejected' && (
          <div className="mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[12.5px] text-red-700">
            This job was rejected. Please revise the details and resubmit.
          </div>
        )}
      </div>

      <AgencyJobForm initialData={job as JobRow} />
    </div>
  )
}
