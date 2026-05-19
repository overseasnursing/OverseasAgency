import React from 'react'
import { ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react'
import type { AgencyDetail } from '@/types/agencyDetail'

interface ScamAlertSectionProps {
  agency: AgencyDetail
}

export function ScamAlertSection({ agency }: ScamAlertSectionProps) {
  if (agency.scamReports.length === 0) {
    return (
      <section aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="text-[22px] font-bold text-slate-800 mb-4">
          Scam & Fraud Reports
        </h2>
        <div className="flex items-center gap-4 p-5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl">
          <div className="w-11 h-11 bg-[#DCFCE7] rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle size={22} className="text-[#166534]" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#166534]">
              No scam reports on file
            </p>
            <p className="text-[13.5px] text-[#166534]/80 mt-0.5">
              No nurses have reported fraud or scam activity for this agency.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="scam-heading">
      <h2 id="scam-heading" className="text-[22px] font-bold text-slate-800 mb-4">
        Scam & Fraud Reports
      </h2>

      {/* Warning header */}
      <div className="flex items-start gap-4 p-5 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl mb-5">
        <div className="w-11 h-11 bg-[#FEE2E2] rounded-xl flex items-center justify-center flex-shrink-0">
          <ShieldAlert size={22} className="text-[#B91C1C]" />
        </div>
        <div>
          <p className="text-[15px] font-bold text-[#B91C1C]">
            {agency.scamReports.length} scam report{agency.scamReports.length > 1 ? 's' : ''} filed
          </p>
          <p className="text-[13.5px] text-[#B91C1C]/80 mt-0.5 leading-relaxed">
            Nurses have reported financial fraud or non-delivery of services by this agency.
            Review each report carefully before making any payment.
          </p>
        </div>
      </div>

      {/* Individual reports */}
      <div className="flex flex-col gap-4">
        {agency.scamReports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-[#FECACA] rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-[15px] font-semibold text-slate-800">{report.title}</h3>
              {report.resolved ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#DCFCE7] text-[#166534] text-[11.5px] font-semibold rounded-full flex-shrink-0">
                  <CheckCircle size={11} />
                  Resolved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FEE2E2] text-[#B91C1C] text-[11.5px] font-semibold rounded-full flex-shrink-0">
                  <AlertTriangle size={11} />
                  Unresolved
                </span>
              )}
            </div>

            <p className="text-[13.5px] text-slate-600 leading-relaxed mb-4">
              {report.description}
            </p>

            <div className="flex flex-wrap gap-4 text-[13px]">
              <div>
                <span className="text-slate-400">Amount lost: </span>
                <span className="font-semibold text-[#B91C1C]">
                  ₹{report.amountLost.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Country promised: </span>
                <span className="font-semibold text-slate-700">{report.countryPromised}</span>
              </div>
              <div>
                <span className="text-slate-400">Date reported: </span>
                <span className="font-semibold text-slate-700">{report.date}</span>
              </div>
            </div>

            {report.resolutionNote && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[13px] text-slate-500">
                  <span className="font-semibold text-slate-700">Resolution note:</span>{' '}
                  {report.resolutionNote}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
