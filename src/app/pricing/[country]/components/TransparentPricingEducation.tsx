import React from 'react'
import { CheckCircle, XCircle, HelpCircle, ShieldCheck } from 'lucide-react'
import type { PricingPageData } from '@/types/pricingDetail'

interface TransparentPricingEducationProps {
  data: PricingPageData
}

export function TransparentPricingEducation({ data }: TransparentPricingEducationProps) {
  return (
    <section aria-labelledby="education-heading">
      <h2 id="education-heading" className="text-[22px] font-bold text-slate-800 mb-2">
        How to Choose an Agency Fairly
      </h2>
      <p className="text-[14px] text-slate-500 mb-8">
        A practical guide to evaluating agency quotes, spotting red flags, and asking the right
        questions before committing to any {data.countryName} migration agency.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* What should be included */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] flex items-center justify-center">
              <CheckCircle size={16} className="text-[#166534]" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800">What Should Be Included</h3>
          </div>
          <p className="text-[13px] text-slate-500 mb-4">
            A reputable agency&apos;s fee should cover at minimum:
          </p>
          <ul className="flex flex-col gap-2.5">
            {data.whatShouldBeIncluded.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle size={14} className="text-[#22C55E] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-[13.5px] text-slate-600 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Red flag phrases */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#FEE2E2] flex items-center justify-center">
              <XCircle size={16} className="text-[#B91C1C]" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800">Red Flag Phrases</h3>
          </div>
          <p className="text-[13px] text-slate-500 mb-4">
            Walk away if any agency says:
          </p>
          <ul className="flex flex-col gap-2.5">
            {data.redFlagPhrases.map((phrase, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <XCircle size={14} className="text-[#EF4444] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-[13.5px] text-slate-600 leading-snug">{phrase}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Questions to ask */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <HelpCircle size={16} className="text-[#1D4ED8]" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800">Questions to Ask Every Agency</h3>
          </div>
          <p className="text-[13px] text-slate-500 mb-4">
            Before signing any agreement, ask these questions and get written answers:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.questionsToAsk.map((q, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 bg-[#F8FAFC] rounded-xl">
                <span className="text-[12px] font-bold text-primary bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-[13px] text-slate-600 leading-snug">{q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-6 flex items-start gap-3 p-5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl">
        <ShieldCheck size={20} className="text-[#1D4ED8] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[14px] font-semibold text-[#1D4ED8] mb-1">
            Always get a written, itemized quote before paying anything.
          </p>
          <p className="text-[13px] text-[#1D4ED8]/80 leading-relaxed">
            Reputable agencies welcome written agreements. If an agency resists putting costs and services
            in writing, that is itself the most reliable red flag of all. Check agency scam reports on
            OverseasNursing.com before proceeding.
          </p>
        </div>
      </div>
    </section>
  )
}
