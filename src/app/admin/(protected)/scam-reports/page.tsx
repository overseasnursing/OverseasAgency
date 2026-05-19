import React from 'react'
import { getPendingScamReports } from '@/lib/db/scam-reports'
import { approveScamReport, rejectScamReport } from '@/app/actions/moderate'
import { AlertTriangle, CheckCircle, XCircle, DollarSign } from 'lucide-react'

export const dynamic = 'force-dynamic'

const SEVERITY_COLORS = {
  critical: 'text-[#DC2626] bg-[#FEE2E2]',
  high: 'text-[#92400E] bg-[#FEF3C7]',
  moderate: 'text-slate-600 bg-slate-100',
}

const CATEGORY_LABELS: Record<string, string> = {
  'fee-fraud': 'Fee Fraud',
  'fake-job': 'Fake Job',
  'document-fraud': 'Document Fraud',
  'visa-fraud': 'Visa Fraud',
  'abandonment': 'Abandonment',
  'other': 'Other',
}

export default async function AdminScamReportsPage() {
  const reports = await getPendingScamReports()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-bold text-slate-900 mb-1">Pending Scam Reports</h1>
        <p className="text-[13px] text-slate-500">
          {reports.length === 0 ? 'No pending reports.' : `${reports.length} report${reports.length === 1 ? '' : 's'} awaiting moderation`}
        </p>
      </div>

      {reports.map((report) => (
        <div
          key={report.id}
          className={`bg-white border rounded-2xl overflow-hidden ${
            report.severity === 'critical' ? 'border-red-300' : 'border-slate-200'
          }`}
        >
          <div className="p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-[15px] font-bold text-slate-800">{report.agency_name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${SEVERITY_COLORS[report.severity]}`}>
                    {report.severity}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {CATEGORY_LABELS[report.category]}
                  </span>
                </div>
                <p className="text-[12px] text-slate-500">
                  {report.reporter_name} · {report.reporter_from} → {report.country_promised}
                </p>
              </div>
              <div className="text-right text-[12px] text-slate-400">
                <p>{new Date(report.created_at).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {report.amount_lost && (
              <div className="flex items-center gap-1.5 mb-3">
                <DollarSign size={13} className="text-red-500" />
                <span className="text-[13px] font-semibold text-red-600">
                  ₹{(report.amount_lost / 100000).toFixed(1)}L reported lost
                </span>
              </div>
            )}

            <p className="text-[13.5px] text-slate-700 leading-relaxed">{report.incident_text}</p>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center gap-3">
            <form action={async () => { 'use server'; await approveScamReport(report.id) }}>
              <button
                type="submit"
                className="flex items-center gap-1.5 h-8 px-4 bg-[#166534] hover:bg-[#14532d] text-white text-[12.5px] font-semibold rounded-lg transition-colors"
              >
                <CheckCircle size={12} /> Approve & Publish
              </button>
            </form>
            <form action={async () => { 'use server'; await rejectScamReport(report.id, 'Insufficient evidence or unverifiable claim') }}>
              <button
                type="submit"
                className="flex items-center gap-1.5 h-8 px-4 border border-red-200 text-red-600 hover:bg-red-50 text-[12.5px] font-semibold rounded-lg transition-colors"
              >
                <XCircle size={12} /> Reject
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  )
}
