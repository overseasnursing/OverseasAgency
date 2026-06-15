import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getApplicationsByAgency } from '@/lib/db/job-applications'
import { ClipboardList, ExternalLink } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AgencyApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/agency-admin/applications')

  const role     = user.user_metadata?.role as string | undefined
  const agencyId = user.user_metadata?.agency_id as string | undefined
  if (role !== 'agency_admin' || !agencyId) redirect('/?error=unauthorized')

  const applications = await getApplicationsByAgency(agencyId)

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="text-[22px] font-bold text-slate-900 mb-1">Applications</h1>
        <p className="text-[13px] text-slate-500">
          {applications.length} application{applications.length !== 1 ? 's' : ''} received for your jobs
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList size={24} className="text-slate-300" />
          </div>
          <p className="text-[15px] font-semibold text-slate-700 mb-1">No applications yet</p>
          <p className="text-[13px] text-slate-400">
            Applications from candidates will appear here once nurses apply to your jobs.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto">
          <table className="w-full text-[13px] min-w-[760px]">
            <thead className="border-b border-slate-100">
              <tr className="text-left">
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Candidate</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Phone</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">From</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">CV</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Job</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">Applied On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-800">{app.full_name}</p>
                    <p className="text-[11.5px] text-slate-400 truncate max-w-[180px]">{app.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{app.phone}</td>
                  <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{app.current_country}</td>
                  <td className="px-5 py-3.5">
                    <a
                      href={app.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 h-7 px-2.5 border border-slate-200 text-slate-600 hover:border-primary hover:text-primary text-[11.5px] font-semibold rounded-lg transition-colors"
                    >
                      <ExternalLink size={11} /> Download
                    </a>
                  </td>
                  <td className="px-5 py-3.5">
                    <a
                      href={`/jobs/${app.job_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-primary transition-colors line-clamp-1 max-w-[160px] block"
                    >
                      {app.job_title}
                    </a>
                    <p className="text-[11.5px] text-slate-400">{app.job_country}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-[12px] whitespace-nowrap">
                    {new Date(app.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
