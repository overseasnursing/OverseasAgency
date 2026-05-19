import React from 'react'
import { ThumbsUp, AlertTriangle, ArrowRight } from 'lucide-react'
import type { PlatformScamReport } from '@/types/scamReport'
import { SeverityBadge, CategoryBadge } from '@/components/trust/TrustBadges'

interface ScamReportCardProps {
  report: PlatformScamReport
}

export function ScamReportCard({ report }: ScamReportCardProps) {
  const borderColor =
    report.severity === 'critical'
      ? 'border-[#FCA5A5]'
      : report.severity === 'high'
      ? 'border-[#FDE68A]'
      : 'border-slate-200'

  return (
    <a
      href={`/scam-report/${report.slug}`}
      className={`group block bg-white border ${borderColor} rounded-2xl p-5 hover:shadow-card transition-all`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-1.5">
          <SeverityBadge severity={report.severity} />
          <CategoryBadge category={report.category} />
        </div>
        <p className="text-[12px] text-slate-400 flex-shrink-0">{report.displayDate}</p>
      </div>

      {/* Agency */}
      <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
        {report.agencyName}
      </p>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-slate-800 leading-snug mb-2 group-hover:text-primary transition-colors">
        {report.title}
      </h3>

      {/* Summary */}
      <p className="text-[13px] text-slate-500 leading-relaxed mb-4 line-clamp-3">
        {report.summary}
      </p>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 uppercase tracking-wide">Amount Lost</span>
          <span className="text-[15px] font-bold text-[#991B1B]">
            ₹{(report.amountLost / 100000).toFixed(1)}L
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 uppercase tracking-wide">Destination</span>
          <span className="text-[14px] font-semibold text-slate-700">{report.countryPromised}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 uppercase tracking-wide">Status</span>
          <span
            className={`text-[13px] font-semibold ${
              report.resolved ? 'text-[#166534]' : 'text-[#991B1B]'
            }`}
          >
            {report.resolved ? 'Resolved' : 'Unresolved'}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-[12px] text-slate-400">
          <ThumbsUp size={11} />
          {report.helpful} found helpful
          {report.evidenceCount > 0 && (
            <span className="ml-2 text-slate-400">· {report.evidenceCount} evidence items</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[12.5px] font-semibold text-primary">
          Read full report
          <ArrowRight size={12} />
        </div>
      </div>

      {/* Unresolved warning */}
      {!report.resolved && report.severity === 'critical' && (
        <div className="flex items-center gap-1.5 mt-3 text-[12px] text-[#991B1B]">
          <AlertTriangle size={12} />
          Active — agency still operating
        </div>
      )}
    </a>
  )
}
