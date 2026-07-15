import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getMyScamReports } from '@/lib/db/scam-reports'
import { AlertTriangle, EyeOff } from 'lucide-react'
import { ScamReportRowActions } from './_components/ScamReportRowActions'

export const metadata: Metadata = { title: 'My Scam Reports — OverseasNursing' }
export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  approved: 'bg-[#DCFCE7] text-[#166534]',
  pending:  'bg-[#FEF3C7] text-[#92400E]',
  rejected: 'bg-[#FEE2E2] text-[#B91C1C]',
}

export default async function MyScamReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const reports = user ? await getMyScamReports(user.id) : []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-900 mb-1">My Scam Reports</h1>
        <p className="text-[13px] text-slate-500">
          {reports.length} report{reports.length !== 1 ? 's' : ''} — edit or disable your own reports at any time. Disabling hides a report from public view without deleting it.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} className="text-slate-300" />
          </div>
          <p className="text-[15px] font-semibold text-slate-700 mb-1">No scam reports yet</p>
          <p className="text-[13px] text-slate-400 mb-5">
            Report a fraudulent agency to help protect other nurses.
          </p>
          <a
            href="/scam-reports/submit"
            className="inline-flex items-center gap-2 h-9 px-5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[13px] font-semibold rounded-xl transition-colors"
          >
            Report a Scam
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-semibold text-slate-800">{report.agency_name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${STATUS_STYLES[report.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {report.status}
                    </span>
                    {report.user_disabled && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">
                        <EyeOff size={10} /> Disabled
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] text-slate-400 capitalize">{report.category.replace(/-/g, ' ')}</span>
                </div>
                <ScamReportRowActions id={report.id} disabled={report.user_disabled} />
              </div>

              <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2 mb-3">{report.incident_text}</p>

              {report.status === 'rejected' && report.reject_reason && (
                <p className="text-[12px] text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3 py-2">
                  Rejected: {report.reject_reason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
