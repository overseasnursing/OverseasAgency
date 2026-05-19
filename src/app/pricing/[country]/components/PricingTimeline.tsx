import React from 'react'
import { AlertTriangle, CreditCard, Banknote, Clock } from 'lucide-react'
import type { PricingPageData } from '@/types/pricingDetail'

const PAYMENT_TYPE_LABELS = {
  upfront: { label: 'Pay upfront', color: 'bg-[#FEE2E2] text-[#B91C1C]', icon: Banknote },
  installment: { label: 'Installment', color: 'bg-[#DBEAFE] text-[#1D4ED8]', icon: CreditCard },
  'post-arrival': { label: 'After arrival', color: 'bg-[#DCFCE7] text-[#166534]', icon: Clock },
}

interface PricingTimelineProps {
  data: PricingPageData
}

export function PricingTimeline({ data }: PricingTimelineProps) {
  return (
    <section aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="text-[22px] font-bold text-slate-800 mb-2">
        When Do You Pay?
      </h2>
      <p className="text-[14px] text-slate-500 mb-8">
        Migration costs don&apos;t all arrive at once. Here&apos;s the cash flow stage by stage — so you can plan
        your savings and understand which payments are upfront vs later.
      </p>

      {/* Payment type legend */}
      <div className="flex flex-wrap gap-3 mb-8">
        {(Object.entries(PAYMENT_TYPE_LABELS) as [string, typeof PAYMENT_TYPE_LABELS['upfront']][]).map(([key, val]) => {
          const Icon = val.icon
          return (
            <div key={key} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold ${val.color}`}>
              <Icon size={12} />
              {val.label}
            </div>
          )
        })}
      </div>

      <ol className="flex flex-col gap-0 relative">
        <div className="absolute left-[21px] top-10 bottom-10 w-px bg-slate-100 hidden sm:block" aria-hidden="true" />

        {data.pricingTimeline.map((stage, index) => {
          const isLast = index === data.pricingTimeline.length - 1
          const pt = PAYMENT_TYPE_LABELS[stage.paymentType]
          const Icon = pt.icon

          return (
            <li key={index} className="flex gap-4 sm:gap-5">
              {/* Stage bubble */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center z-10 relative font-bold text-[14px]">
                  {stage.stageNumber}
                </div>
                {!isLast && (
                  <div className="w-px flex-1 bg-slate-100 mt-1 mb-1 sm:hidden" aria-hidden="true" />
                )}
              </div>

              {/* Content */}
              <div className="pb-8 min-w-0 flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-1 pt-2.5">
                  <h3 className="text-[15px] font-semibold text-slate-800">{stage.stageName}</h3>
                  <span className="text-[11.5px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {stage.timingLabel}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${pt.color}`}>
                    <Icon size={10} />
                    {pt.label}
                  </span>
                </div>

                <p className="text-[13.5px] text-slate-500 leading-relaxed mb-3">
                  {stage.description}
                </p>

                {/* Cost items */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-3">
                  {stage.costs.map((cost, ci) => (
                    <div
                      key={ci}
                      className={`flex items-center justify-between gap-4 px-4 py-2.5 ${
                        ci !== stage.costs.length - 1 ? 'border-b border-slate-100' : ''
                      }`}
                    >
                      <span className="text-[13px] text-slate-600">
                        {cost.label}
                        {cost.optional && (
                          <span className="ml-1.5 text-[11px] text-slate-400">(if applicable)</span>
                        )}
                      </span>
                      <span className={`text-[13px] font-semibold flex-shrink-0 ${
                        cost.range.startsWith('−') ? 'text-[#166534]' : 'text-slate-800'
                      }`}>
                        {cost.range}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-[#F8FAFC] border-t border-slate-200">
                    <span className="text-[13px] font-bold text-slate-700">Stage Total</span>
                    <span className="text-[13px] font-bold text-primary">{stage.stageTotal}</span>
                  </div>
                </div>

                {/* Warning */}
                {stage.warning && (
                  <div className="flex items-start gap-2 p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl">
                    <AlertTriangle size={13} className="text-[#92400E] flex-shrink-0 mt-0.5" />
                    <p className="text-[12.5px] text-[#92400E] leading-relaxed">{stage.warning}</p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
