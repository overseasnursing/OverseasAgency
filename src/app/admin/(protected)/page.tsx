import React from 'react'
import { getPendingReviews } from '@/lib/db/reviews'
import { getPendingScamReports } from '@/lib/db/scam-reports'
import { FileText, AlertTriangle, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [pendingReviews, pendingScamReports] = await Promise.all([
    getPendingReviews(),
    getPendingScamReports(),
  ])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-[24px] font-bold text-slate-900 mb-1">Moderation Dashboard</h1>
        <p className="text-[14px] text-slate-500">Review pending submissions before they go live.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href="/admin/reviews" className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-[#DBEAFE] rounded-xl">
              <FileText size={18} className="text-[#1D4ED8]" />
            </div>
            {pendingReviews.length > 0 && (
              <span className="text-[11px] font-bold text-white bg-[#1D4ED8] px-2 py-0.5 rounded-full">
                {pendingReviews.length} pending
              </span>
            )}
          </div>
          <p className="text-[16px] font-bold text-slate-800 mb-0.5">Reviews</p>
          <p className="text-[13px] text-slate-500">
            {pendingReviews.length === 0
              ? 'All caught up!'
              : `${pendingReviews.length} review${pendingReviews.length === 1 ? '' : 's'} awaiting approval`}
          </p>
        </a>

        <a href="/admin/scam-reports" className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-red-300 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-[#FEE2E2] rounded-xl">
              <AlertTriangle size={18} className="text-[#DC2626]" />
            </div>
            {pendingScamReports.length > 0 && (
              <span className="text-[11px] font-bold text-white bg-[#DC2626] px-2 py-0.5 rounded-full">
                {pendingScamReports.length} pending
              </span>
            )}
          </div>
          <p className="text-[16px] font-bold text-slate-800 mb-0.5">Scam Reports</p>
          <p className="text-[13px] text-slate-500">
            {pendingScamReports.length === 0
              ? 'No pending reports'
              : `${pendingScamReports.length} report${pendingScamReports.length === 1 ? '' : 's'} awaiting review`}
          </p>
        </a>
      </div>

      {pendingReviews.length === 0 && pendingScamReports.length === 0 && (
        <div className="flex items-center gap-2 text-[14px] text-[#166534] bg-[#DCFCE7] border border-[#BBF7D0] rounded-2xl px-5 py-4">
          <CheckCircle size={16} />
          All submissions have been moderated. Nothing pending.
        </div>
      )}
    </div>
  )
}
