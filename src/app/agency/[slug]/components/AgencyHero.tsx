import React from 'react'
import Image from 'next/image'
import {
  CheckCircle,
  ShieldAlert,
  Star,
  MapPin,
  Users,
  CalendarDays,
  Globe,
  ExternalLink,
} from 'lucide-react'
import type { AgencyDetail } from '@/types/agencyDetail'

// Links to the explanation of what each trust status means and how it's
// assigned (src/app/editorial-policy/page.tsx#trust-status) — a badge with
// no accessible explanation of its criteria is a trust gap in itself.
function TrustBadge({ level }: { level: AgencyDetail['trustLevel'] }) {
  if (level === 'verified')
    return (
      <a
        href="/editorial-policy#trust-status"
        title="What does 'Verified' mean? See our editorial independence policy."
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DCFCE7] text-[#166534] text-[12.5px] font-semibold rounded-full hover:opacity-80 transition-opacity"
      >
        <CheckCircle size={13} strokeWidth={2.5} /> Verified Agency
      </a>
    )
  if (level === 'trusted')
    return (
      <a
        href="/editorial-policy#trust-status"
        title="What does 'Trusted' mean? See our editorial independence policy."
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DBEAFE] text-[#1D4ED8] text-[12.5px] font-semibold rounded-full hover:opacity-80 transition-opacity"
      >
        <CheckCircle size={13} strokeWidth={2.5} /> Trusted
      </a>
    )
  if (level === 'scam-reported')
    return (
      <a
        href="/editorial-policy#trust-status"
        title="What does 'Scam Reported' mean? See our editorial independence policy."
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FEE2E2] text-[#B91C1C] text-[12.5px] font-semibold rounded-full hover:opacity-80 transition-opacity"
      >
        <ShieldAlert size={13} strokeWidth={2.5} /> Scam Reported
      </a>
    )
  return null
}


function StarRow({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={16}
            fill={i <= Math.round(rating) ? '#F59E0B' : '#E2E8F0'}
            className={i <= Math.round(rating) ? 'text-[#F59E0B]' : 'text-slate-200'}
          />
        ))}
      </div>
      <span className="text-[16px] font-bold text-slate-800">{rating.toFixed(1)}</span>
      <span className="text-[14px] text-slate-400">({reviewCount.toLocaleString()} reviews)</span>
    </div>
  )
}

const COUNTRY_CODES: Record<string, string> = {
  'Germany': 'de', 'UK': 'gb', 'United Kingdom': 'gb', 'Canada': 'ca',
  'Australia': 'au', 'USA': 'us', 'United States': 'us', 'Ireland': 'ie',
  'New Zealand': 'nz', 'Singapore': 'sg', 'Dubai': 'ae', 'UAE': 'ae',
  'Saudi Arabia': 'sa', 'Qatar': 'qa', 'Bahrain': 'bh', 'Kuwait': 'kw',
  'Oman': 'om', 'France': 'fr', 'Netherlands': 'nl', 'Norway': 'no',
  'Sweden': 'se', 'Denmark': 'dk', 'Finland': 'fi', 'Switzerland': 'ch',
  'Austria': 'at', 'Belgium': 'be', 'Japan': 'jp', 'Malta': 'mt',
  'Portugal': 'pt', 'Spain': 'es', 'Italy': 'it', 'Poland': 'pl',
}

interface AgencyHeroProps {
  agency: AgencyDetail
  recommendationPercent: number
}

export function AgencyHero({ agency, recommendationPercent }: AgencyHeroProps) {
  const initials = agency.name.split(' ').slice(0, 2).map((w) => w[0]).join('')

  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-slate-400 mb-7" aria-label="Breadcrumb">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span>/</span>
          <a href="/agencies" className="hover:text-primary transition-colors">Agencies</a>
          <span>/</span>
          <span className="text-slate-600 font-medium">{agency.name}</span>
        </nav>

        {/* Two-column: left = identity, right = featured image */}
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-12">

          {/* Left — identity + stats */}
          <div className="flex-1 min-w-0">

            {/* Logo + Name */}
            <div className="flex items-start gap-5 mb-5">
              {agency.logo ? (
                <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 bg-white">
                  <Image
                    src={agency.logo}
                    alt={`${agency.name} logo`}
                    width={72}
                    height={72}
                    sizes="72px"
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-[72px] h-[72px] rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[22px] font-bold text-primary">{initials}</span>
                </div>
              )}
              <div>
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <TrustBadge level={agency.trustLevel} />
                  {agency.visaSponsorship && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] text-[#1D4ED8] text-[12.5px] font-semibold rounded-full">
                      Visa Sponsored
                    </span>
                  )}
                </div>
                <h1 className="text-[28px] sm:text-[34px] font-bold text-slate-800 leading-tight mb-1">
                  {agency.name}
                </h1>
                <div className="flex items-center gap-1.5 text-[14px] text-slate-400">
                  <MapPin size={13} />
                  <span>{agency.location}</span>
                  <span className="text-slate-200">·</span>
                  <CalendarDays size={13} />
                  <span>Est. {agency.established}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            {agency.reviewCount > 0 && (
              <div className="mb-5">
                <StarRow rating={agency.rating} reviewCount={agency.reviewCount} />
              </div>
            )}

            {/* Key stats */}
            <div className="flex items-center flex-wrap gap-5 mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                <span className="text-[14px] font-semibold text-slate-700">{agency.placementCount.toLocaleString()}+</span>
                <span className="text-[14px] text-slate-400">nurses placed</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-slate-400" />
                <span className="text-[14px] font-semibold text-slate-700">{agency.countries.length} countries</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[#22C55E]" />
                <span className="text-[14px] font-semibold text-slate-700">{recommendationPercent}%</span>
                <span className="text-[14px] text-slate-400">would recommend</span>
              </div>
            </div>

            {/* Countries */}
            <div className="flex items-center flex-wrap gap-2 mb-6">
              {agency.countries.map((c) => {
                const code = COUNTRY_CODES[c]
                return (
                  <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F5F9] text-[#334155] text-[13px] font-medium rounded-full">
                    {code && <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: '13px' }} />}
                    {c}
                  </span>
                )
              })}
            </div>

            {/* Website */}
            {agency.website && (
              <a
                href={agency.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-primary transition-colors"
              >
                <ExternalLink size={13} />
                {agency.website.replace('https://', '')}
              </a>
            )}
          </div>

          {/* Right — featured image only (desktop) */}
          {agency.featuredImage ? (
            <div className="hidden lg:block flex-shrink-0 w-[460px] relative rounded-3xl overflow-hidden min-h-[300px]">
              <Image
                src={agency.featuredImage}
                alt={`${agency.name} office`}
                fill
                sizes="(max-width: 1024px) 0px, 460px"
                className="object-cover"
                priority
                fetchPriority="high"
              />
            </div>
          ) : (
            /* placeholder keeps layout stable when no image is uploaded */
            <div className="hidden lg:block flex-shrink-0 w-[460px]" />
          )}
        </div>
      </div>
    </div>
  )
}
