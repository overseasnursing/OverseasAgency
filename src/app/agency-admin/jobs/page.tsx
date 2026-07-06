import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'

export const dynamic = 'force-dynamic'

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending:  { label: 'Pending',  className: 'bg-[#FEF9C3] text-[#854D0E]' },
  approved: { label: 'Approved', className: 'bg-[#DCFCE7] text-[#166534]' },
  hold:     { label: 'Hold',     className: 'bg-[#FEF3C7] text-[#92400E]' },
  rejected: { label: 'Rejected', className: 'bg-[#FEE2E2] text-[#B91C1C]' },
  expired:  { label: 'Expired',  className: 'bg-slate-100 text-slate-500' },
}

export default async function AgencyJobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/agency-admin/jobs')

  const role     = user.app_metadata?.role as string | undefined
  const agencyId = user.app_metadata?.agency_id as string | undefined
  if (role !== 'agency_admin' || !agencyId) redirect('/?error=unauthorized')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data: jobs } = await db
    .from('jobs')
    .select('id, title, country, city, status, created_at')
    .eq('agency_id', agencyId)
    .order('created_at', { ascending: false })

  const total = (jobs ?? []).length

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 mb-1">My Jobs</h1>
          <p className="text-[13px] text-slate-500">
            {total} job{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/agency-admin/jobs/new"
          className="flex items-center gap-2 h-9 px-4 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
        >
          <Plus size={14} /> Post a Job
        </Link>
      </div>

      {/* Empty state */}
      {!jobs?.length ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <p className="text-slate-700 text-[15px] font-semibold mb-1">No jobs posted yet</p>
          <p className="text-slate-400 text-[13px] mb-5">Post a job to attract qualified nurses to your agency.</p>
          <Link
            href="/agency-admin/jobs/new"
            className="inline-flex items-center gap-2 h-9 px-5 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
          >
            <Plus size={14} /> Post a Job
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="border-b border-slate-100">
              <tr className="text-left">
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Job Title</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Country</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">Created</th>
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
                      <p className="font-medium text-slate-800 line-clamp-1">{job.title}</p>
                      {job.city && (
                        <p className="text-[11.5px] text-slate-400 mt-0.5">{job.city}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{job.country}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-[12px] whitespace-nowrap">
                      {new Date(job.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/agency-admin/jobs/${job.id}`}
                        className="inline-flex items-center gap-1 h-7 px-2.5 border border-slate-200 text-slate-600 hover:border-primary hover:text-primary text-[11.5px] font-semibold rounded-lg transition-colors"
                      >
                        <Pencil size={11} /> Edit
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
