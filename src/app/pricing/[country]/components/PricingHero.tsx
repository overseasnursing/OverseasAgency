import React from 'react'
import { ShieldCheck, CalendarDays, ArrowRight } from 'lucide-react'
import type { PricingPageData } from '@/types/pricingDetail'
import { FlagIcon } from '@/components/ui/FlagIcon'

function formatL(rupees: number) {
  return `₹${(rupees / 100000).toFixed(1)}L`
}

interface PricingHeroProps {
  data: PricingPageData
}

export function PricingHero({ data }: PricingHeroProps) {
  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-slate-400 mb-8" aria-label="Breadcrumb">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span>/</span>
          <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
          <span>/</span>
          <span className="text-slate-600 font-medium">{data.countryName}</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">

          <div className="flex-1 min-w-0">
            {/* Flag + heading */}
            <div className="flex items-center gap-3 mb-4">
              <FlagIcon emoji={data.flag} size={48} className="rounded" />
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                  Migration Cost Intelligence
                </p>
                <h1 className="text-[30px] sm:text-[38px] font-bold text-slate-800 leading-tight">
                  {data.countryName} Nursing Fees
                </h1>
              </div>
            </div>

            {/* Total cost display */}
            <div className="mb-6">
              <p className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                Estimated Total Migration Cost
              </p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[52px] font-bold text-slate-800 leading-none">
                  {formatL(data.totalMin)}
                </span>
                <span className="text-[28px] font-bold text-slate-400">
                  — {formatL(data.totalMax)}
                </span>
              </div>
              <p className="text-[14px] text-slate-500">
                Typical spend:{' '}
                <span className="font-semibold text-slate-700">{formatL(data.totalTypical)}</span>
                {' '}· All figures in Indian Rupees (INR), {data.lastUpdated}
              </p>
            </div>

            {/* Transparency statement */}
            <div className="flex items-start gap-3 p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl mb-6">
              <ShieldCheck size={17} className="text-[#166534] flex-shrink-0 mt-0.5" />
              <p className="text-[13.5px] text-[#166534] leading-relaxed">
                <span className="font-semibold">Transparency note: </span>
                {data.transparencyStatement}
              </p>
            </div>

            {/* Last updated */}
            <div className="flex items-center gap-1.5 text-[12.5px] text-slate-400">
              <CalendarDays size={13} />
              <span>Data last updated: {data.lastUpdated}</span>
            </div>
          </div>

          {/* Right — CTAs */}
          <div className="flex flex-col gap-3 lg:min-w-[250px] lg:flex-shrink-0">
            <a
              href="#breakdown"
              className="flex items-center justify-center gap-2 h-12 px-6 bg-primary hover:bg-primary-hover text-white text-[15px] font-semibold rounded-xl transition-colors"
            >
              See Full Breakdown
              <ArrowRight size={15} />
            </a>
            <a
              href="#agencies"
              className="flex items-center justify-center gap-2 h-12 px-6 border border-slate-200 hover:border-slate-300 text-slate-700 text-[14px] font-medium rounded-xl transition-colors"
            >
              Compare Agency Fees
            </a>
            <a
              href={`/country/${data.countrySlug}`}
              className="flex items-center justify-center gap-2 h-12 px-6 border border-slate-200 hover:border-slate-300 text-slate-700 text-[14px] font-medium rounded-xl transition-colors"
            >
              <FlagIcon emoji={data.flag} size={16} className="rounded-sm" />
              Full {data.countryName} Guide →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
