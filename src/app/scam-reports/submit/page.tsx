import React from 'react'
import type { Metadata } from 'next'
import { ScamReportForm } from './ScamReportForm'

export const metadata: Metadata = {
  title: 'Report an Agency Scam — OverseasNursing.com',
  description:
    'Report fraud by an overseas nursing recruitment agency. Your report is verified and published to protect other nurses.',
  alternates: { canonical: '/scam-reports/submit' },
}

export default function ScamReportSubmitPage() {
  return (
    <div className="bg-[#FFF5F5] min-h-screen">
      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-10">
          <p className="text-[12px] font-semibold text-[#DC2626] uppercase tracking-widest mb-3">
            Scam Report
          </p>
          <h1 className="text-[28px] font-bold text-slate-800 mb-3">
            Report an Agency Fraud
          </h1>
          <p className="text-[14px] text-slate-500 leading-relaxed">
            Coming forward is difficult. But your report directly protects nurses who would otherwise face the same experience. Reports are verified and published with your consent.
          </p>
        </div>

        <ScamReportForm />

        {/* Support note */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-[12px] text-slate-400 leading-relaxed">
            Reports are reviewed within 24–72 hours. We may reach out for additional evidence. For immediate assistance, call the National Consumer Helpline at 1915.
          </p>
        </div>
      </div>
    </div>
  )
}
