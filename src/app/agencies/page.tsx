import type { Metadata } from 'next'

// ISR: rebuild agency listing every 30 minutes
export const revalidate = 1800

import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { AgencyListingClient } from './AgencyListingClient'
import { getAgencies } from '@/lib/data/getAgencies'
import { Shield, CheckCircle, Star, Search, Users, Eye, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Find Overseas Nursing Agencies — Compare Reviews & Pricing',
  description:
    'Browse 600+ verified overseas nursing agencies. Compare real reviews, transparent pricing, migration timelines and scam alerts before choosing your agency.',
  alternates: { canonical: '/agencies' },
  openGraph: {
    title:       'Find Overseas Nursing Agencies — Compare Reviews & Pricing',
    description: 'Real reviews, transparent pricing, scam alerts. Find the right agency for Germany, UK, Canada & more.',
    url:         'https://overseasnursing.com/agencies',
    images:      [{ url: '/og-agencies.png', width: 1200, height: 630 }],
  },
}

function TrustStrip() {
  return (
    <div className="border-b border-slate-100 bg-white">
      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center flex-wrap gap-x-8 gap-y-2">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-primary flex-shrink-0" />
            <span className="text-[13px] text-slate-600">
              <span className="font-semibold">License verified</span> agencies only
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-[#22C55E] flex-shrink-0" />
            <span className="text-[13px] text-slate-600">
              <span className="font-semibold">4,200+</span> real nurse reviews
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star size={14} className="text-[#F59E0B] flex-shrink-0" fill="#F59E0B" />
            <span className="text-[13px] text-slate-600">
              Transparent pricing — <span className="font-semibold">no hidden fees</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function AgenciesPage() {
  const agencies = await getAgencies()

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative bg-white border-b border-slate-100 overflow-hidden">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, #0F4C81 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Gradient accent — top right */}
        <div
          className="absolute top-0 right-0 w-[480px] h-[280px] rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(15,76,129,0.07) 0%, transparent 70%)' }}
        />

        <div className="relative max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 text-primary rounded-full text-[11.5px] font-semibold uppercase tracking-wide mb-5">
                <Search size={11} />
                600+ agencies listed
              </div>
              <h1 className="text-[34px] sm:text-[42px] font-bold text-slate-900 leading-tight mb-4">
                Find Overseas Nursing Agencies
              </h1>
              <p className="text-[16px] text-slate-500 max-w-[520px] leading-relaxed mb-6">
                Compare verified agencies across Germany, UK, Canada, Australia &amp; the Gulf.
                Read real nurse reviews and transparent pricing before deciding.
              </p>

              {/* Inline trust pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Shield,       text: 'License verified',    bg: 'bg-[#EFF6FF] text-[#1D4ED8]' },
                  { icon: CheckCircle,  text: '4,200+ reviews',      bg: 'bg-[#DCFCE7] text-[#166534]' },
                  { icon: Eye,          text: 'No paid rankings',     bg: 'bg-[#FEF3C7] text-[#92400E]' },
                  { icon: Award,        text: 'Transparency scored',  bg: 'bg-slate-100  text-slate-600' },
                ].map(({ icon: Icon, text, bg }) => (
                  <span key={text} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold ${bg}`}>
                    <Icon size={11} />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: stat cards grid */}
            <div className="hidden lg:grid grid-cols-2 gap-3" aria-hidden="true">
              {[
                { value: '600+',  label: 'Agencies listed',        sub: 'Across 5 countries',       color: 'bg-[#EFF6FF]', iconColor: 'text-primary',      icon: Users },
                { value: '4.7',   label: 'Average trust rating',   sub: 'From verified reviews',    color: 'bg-[#DCFCE7]', iconColor: 'text-[#166534]',    icon: Star },
                { value: '91%',   label: 'Fee transparency rate',  sub: 'Top-rated agencies',       color: 'bg-[#FEF3C7]', iconColor: 'text-[#92400E]',    icon: Eye },
                { value: '0',     label: 'Paid placements',        sub: 'Rankings are 100% earned', color: 'bg-slate-50',  iconColor: 'text-slate-600',    icon: Shield },
              ].map(({ value, label, sub, color, iconColor, icon: Icon }) => (
                <div key={label} className={`${color} rounded-2xl p-5 border border-slate-100`}>
                  <div className={`w-9 h-9 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm ${iconColor}`}>
                    <Icon size={16} />
                  </div>
                  <p className="text-[26px] font-bold text-slate-800 leading-none mb-1">{value}</p>
                  <p className="text-[13px] font-semibold text-slate-700 leading-tight">{label}</p>
                  <p className="text-[11.5px] text-slate-400 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TrustStrip />

      {/* Agency listing */}
      <SectionWrapper spacing="xs" background="page">
        <AgencyListingClient agencies={agencies} />
      </SectionWrapper>
    </>
  )
}
