import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getUserApplicationsWithJobs } from '@/lib/db/job-applications'
import { Briefcase, MapPin, Calendar } from 'lucide-react'

export const metadata: Metadata = { title: 'My Applications — OverseasNursing' }
export const dynamic = 'force-dynamic'

export default async function MyApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const applications = user ? await getUserApplicationsWithJobs(user.id) : []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-900 mb-1">My Applications</h1>
        <p className="text-[13px] text-slate-500">
          {applications.length} job application{applications.length !== 1 ? 's' : ''}
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase size={24} className="text-slate-300" />
          </div>
          <p className="text-[15px] font-semibold text-slate-700 mb-1">No applications yet</p>
          <p className="text-[13px] text-slate-400 mb-5">
            Browse nursing jobs abroad and submit your first application.
          </p>
          <a
            href="/jobs"
            className="inline-flex items-center gap-2 h-9 px-5 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
          >
            Browse Jobs
          </a>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="border-b border-slate-100">
              <tr className="text-left">
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Job Title</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Country</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">Applied On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <a
                      href={`/jobs/${app.job_slug}`}
                      className="font-medium text-slate-800 hover:text-primary transition-colors line-clamp-1"
                    >
                      {app.job_title}
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-slate-600 whitespace-nowrap">
                      <MapPin size={11} className="flex-shrink-0" />
                      {app.job_country}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-slate-500 text-[12px] whitespace-nowrap">
                      <Calendar size={11} className="flex-shrink-0" />
                      {new Date(app.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
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
