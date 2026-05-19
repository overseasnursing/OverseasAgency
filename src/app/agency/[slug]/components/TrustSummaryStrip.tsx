import React from 'react'
import { ShieldCheck, AlertTriangle, Clock, ThumbsUp, Plane } from 'lucide-react'
import type { AgencyDetail } from '@/types/agencyDetail'

interface MetricProps {
  icon: React.ReactNode
  value: string
  label: string
  status: 'good' | 'warn' | 'neutral'
}

function Metric({ icon, value, label, status }: MetricProps) {
  const valueColor =
    status === 'good' ? 'text-[#166534]'
    : status === 'warn' ? 'text-[#92400E]'
    : 'text-slate-800'

  return (
    <div className="flex flex-col items-center text-center px-4 py-5 flex-1 min-w-[120px]">
      <div className="mb-2 text-slate-400">{icon}</div>
      <p className={`text-[20px] font-bold leading-none mb-1 ${valueColor}`}>{value}</p>
      <p className="text-[12px] text-slate-400 font-medium leading-tight">{label}</p>
    </div>
  )
}

function Divider() {
  return <div className="w-px bg-slate-100 self-stretch my-3 hidden sm:block" />
}

interface TrustSummaryStripProps {
  agency: AgencyDetail
}

export function TrustSummaryStrip({ agency }: TrustSummaryStripProps) {
  const transparencyStatus =
    agency.transparencyScore >= 80 ? 'good'
    : agency.transparencyScore >= 60 ? 'warn'
    : 'warn' as const

  const hiddenChargeStatus =
    agency.hiddenChargesReported === 0 ? 'good' : 'warn' as const

  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-stretch divide-x divide-slate-100 overflow-x-auto">

          <Metric
            icon={<ShieldCheck size={20} />}
            value={`${agency.transparencyScore}/100`}
            label="Transparency Score"
            status={transparencyStatus}
          />
          <Divider />
          <Metric
            icon={<AlertTriangle size={20} />}
            value={
              agency.hiddenChargesReported === 0
                ? 'None reported'
                : `${agency.hiddenChargesReported} reported`
            }
            label="Hidden Charges"
            status={hiddenChargeStatus}
          />
          <Divider />
          <Metric
            icon={<Clock size={20} />}
            value={`${agency.averageTimelineMonths} mo.`}
            label="Avg. Timeline"
            status="neutral"
          />
          <Divider />
          <Metric
            icon={<ThumbsUp size={20} />}
            value={`${agency.recommendationPercent}%`}
            label="Would Recommend"
            status={agency.recommendationPercent >= 90 ? 'good' : 'neutral'}
          />
          <Divider />
          <Metric
            icon={<Plane size={20} />}
            value={`${agency.visaSuccessRate}%`}
            label="Visa Success Rate"
            status={agency.visaSuccessRate >= 90 ? 'good' : 'neutral'}
          />
        </div>
      </div>
    </div>
  )
}
