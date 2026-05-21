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

function TrustBadge({ level }: { level: AgencyDetail['trustLevel'] }) {
  if (level === 'verified')
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DCFCE7] text-[#166534] text-[12.5px] font-semibold rounded-full">
        <CheckCircle size={13} strokeWidth={2.5} /> Verified Agency
      </span>
    )
  if (level === 'trusted')
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DBEAFE] text-[#1D4ED8] text-[12.5px] font-semibold rounded-full">
        <CheckCircle size={13} strokeWidth={2.5} /> Trusted
      </span>
    )
  if (level === 'scam-reported')
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FEE2E2] text-[#B91C1C] text-[12.5px] font-semibold rounded-full">
        <ShieldAlert size={13} strokeWidth={2.5} /> Scam Reported
      </span>
    )
  return null
}

function GoogleGLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Google">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
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
            <div className="mb-5">
              {agency.reviewCount > 0 ? (
                <StarRow rating={agency.rating} reviewCount={agency.reviewCount} />
              ) : agency.googleRating && agency.googleReviewCount ? (
                <a
                  href={`https://search.google.com/local/reviews?placeid=${agency.googlePlaceId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <GoogleGLogo size={20} />
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={15} fill={i <= Math.round(agency.googleRating!) ? '#F59E0B' : '#E2E8F0'} className={i <= Math.round(agency.googleRating!) ? 'text-[#F59E0B]' : 'text-slate-200'} />
                    ))}
                  </div>
                  <span className="text-[15px] font-bold text-slate-800">{agency.googleRating.toFixed(1)}</span>
                  <span className="text-[13px] text-slate-400">({agency.googleReviewCount.toLocaleString()} Google reviews)</span>
                  <ExternalLink size={13} className="text-slate-400" />
                </a>
              ) : (
                <span className="text-[14px] text-slate-400">No reviews yet — be the first to review</span>
              )}
            </div>

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
