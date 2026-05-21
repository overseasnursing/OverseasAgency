import React from 'react'
import Image from 'next/image'
import {
  CheckCircle,
  ShieldAlert,
  Star,
  MapPin,
  Users,
  Clock,
  Banknote,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react'
import type { Agency } from '@/types/agency'

function GoogleGLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Google">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function AgencyLogo({ logo, name }: { logo?: string; name: string }) {
  if (logo) {
    return (
      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 bg-white">
        <Image src={logo} alt={`${name} logo`} width={48} height={48} sizes="48px" className="w-full h-full object-contain" />
      </div>
    )
  }
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('')
  return (
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
      <span className="text-[15px] font-bold text-primary">{initials}</span>
    </div>
  )
}

function TrustBadge({ level }: { level: Agency['trustLevel'] }) {
  if (level === 'verified')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#DCFCE7] text-[#166534] text-[11px] font-semibold rounded-full flex-shrink-0">
        <CheckCircle size={10} strokeWidth={2.5} /> Verified
      </span>
    )
  if (level === 'trusted')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#DBEAFE] text-[#1D4ED8] text-[11px] font-semibold rounded-full flex-shrink-0">
        <CheckCircle size={10} strokeWidth={2.5} /> Trusted
      </span>
    )
  if (level === 'scam-reported')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FEE2E2] text-[#B91C1C] text-[11px] font-semibold rounded-full flex-shrink-0">
        <ShieldAlert size={10} strokeWidth={2.5} /> Scam Reported
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-[11px] font-semibold rounded-full flex-shrink-0">
      Not Verified
    </span>
  )
}

interface AgencyCardProps {
  agency: Agency
}

export function AgencyCard({ agency }: AgencyCardProps) {
  const isScam  = agency.trustLevel === 'scam-reported'
  const hasWarn = agency.hiddenChargesReported > 0 && !isScam

  const visibleCountries = agency.countries.slice(0, 3)
  const extraCountries   = agency.countries.length - 3

  const scoreColor =
    agency.transparencyScore >= 80 ? 'bg-[#22C55E]'
    : agency.transparencyScore >= 60 ? 'bg-[#F59E0B]'
    : 'bg-[#EF4444]'
  const scoreText =
    agency.transparencyScore >= 80 ? 'text-[#166534]'
    : agency.transparencyScore >= 60 ? 'text-[#92400E]'
    : 'text-[#B91C1C]'

  return (
    <article
      className={[
        'bg-white rounded-card shadow-card hover:shadow-card-md transition-shadow flex flex-col overflow-hidden',
        isScam ? 'border border-[#FECACA]' : 'border border-transparent',
      ].join(' ')}
      aria-label={`Agency: ${agency.name}`}
    >
      {/* Featured image */}
      {agency.featuredImage && (
        <div className="relative w-full h-32 flex-shrink-0">
          <Image
            src={agency.featuredImage}
            alt={`${agency.name} featured`}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Scam banner */}
      {isScam && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#FEF2F2] border-b border-[#FECACA]">
          <ShieldAlert size={13} className="text-[#B91C1C] flex-shrink-0" />
          <p className="text-[12px] font-semibold text-[#B91C1C]">
            {agency.hiddenChargesReported} scam report{agency.hiddenChargesReported > 1 ? 's' : ''} filed
          </p>
        </div>
      )}

      <div className="p-4 flex flex-col gap-4 flex-1">

        {/* Header: logo + name + badge */}
        <div className="flex items-start gap-3">
          <AgencyLogo logo={agency.logo} name={agency.name} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1.5 mb-1">
              <h3 className="text-[15px] font-bold text-slate-800 leading-tight line-clamp-1">{agency.name}</h3>
              <TrustBadge level={agency.trustLevel} />
            </div>
            <div className="flex items-center gap-1 text-[12px] text-slate-400 mb-1.5">
              <MapPin size={11} />
              <span>{agency.location}</span>
              <span>·</span>
              <span>Est. {agency.established}</span>
            </div>
            {/* Rating */}
            {agency.reviewCount > 0 ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={12} fill={i <= Math.round(agency.rating) ? '#F59E0B' : '#E2E8F0'} className={i <= Math.round(agency.rating) ? 'text-[#F59E0B]' : 'text-slate-200'} />
                  ))}
                </div>
                <span className="text-[13px] font-bold text-slate-800">{agency.rating.toFixed(1)}</span>
                <span className="text-[12px] text-slate-400">({agency.reviewCount})</span>
              </div>
            ) : agency.googleRating && agency.googleReviewCount ? (
              <a
                href={`https://search.google.com/local/reviews?placeid=${agency.googlePlaceId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                onClick={e => e.stopPropagation()}
              >
                <GoogleGLogo size={14} />
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={11} fill={i <= Math.round(agency.googleRating!) ? '#F59E0B' : '#E2E8F0'} className={i <= Math.round(agency.googleRating!) ? 'text-[#F59E0B]' : 'text-slate-200'} />
                  ))}
                </div>
                <span className="text-[12.5px] font-bold text-slate-700">{agency.googleRating.toFixed(1)}</span>
                <span className="text-[11.5px] text-slate-400">({agency.googleReviewCount} Google)</span>
              </a>
            ) : (
              <span className="text-[12px] text-slate-400">No reviews yet</span>
            )}
          </div>
        </div>

        {/* Transparency score */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wide">Transparency Score</span>
            <span className={`text-[11.5px] font-bold ${scoreText}`}>{agency.transparencyScore}/100</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${scoreColor}`} style={{ width: `${agency.transparencyScore}%` }} />
          </div>
        </div>

        {/* Countries */}
        <div className="flex items-center flex-wrap gap-1.5">
          {visibleCountries.map((c) => (
            <span key={c} className="px-2.5 py-0.5 bg-[#EFF6FF] text-[#1D4ED8] text-[11.5px] font-medium rounded-full">{c}</span>
          ))}
          {extraCountries > 0 && (
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-[11.5px] font-medium rounded-full">+{extraCountries} more</span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#F8FAFC] rounded-xl p-2.5 text-center">
            <Banknote size={13} className="text-slate-400 mx-auto mb-1" />
            <p className="text-[12.5px] font-bold text-slate-800 leading-tight">₹{agency.pricing.minLakhs}–{agency.pricing.maxLakhs}L</p>
            <p className="text-[10.5px] text-slate-400 mt-0.5">{agency.pricing.isApproximate ? 'approx.' : 'fixed fee'}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-2.5 text-center">
            <Clock size={13} className="text-slate-400 mx-auto mb-1" />
            <p className="text-[12.5px] font-bold text-slate-800 leading-tight">{agency.averageTimelineMonths}</p>
            <p className="text-[10.5px] text-slate-400 mt-0.5">months</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-2.5 text-center">
            <Users size={13} className="text-slate-400 mx-auto mb-1" />
            <p className="text-[12.5px] font-bold text-slate-800 leading-tight">{agency.placementCount.toLocaleString()}+</p>
            <p className="text-[10.5px] text-slate-400 mt-0.5">placed</p>
          </div>
        </div>

        {/* Hidden charges warning */}
        {hasWarn && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FEF3C7] rounded-xl">
            <AlertTriangle size={12} className="text-[#92400E] flex-shrink-0" />
            <p className="text-[11.5px] font-medium text-[#92400E]">
              {agency.hiddenChargesReported} hidden charge{agency.hiddenChargesReported > 1 ? 's' : ''} reported
            </p>
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="px-4 pb-4 flex items-center gap-2 pt-1">
        <a
          href={`/agency/${agency.slug}`}
          className="flex-1 flex items-center justify-center gap-1 h-10 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
        >
          View Profile <ChevronRight size={14} />
        </a>
        <a
          href={`/agency-compare?a=${agency.slug}`}
          className="h-10 px-3.5 flex items-center justify-center border border-slate-200 hover:border-primary hover:text-primary text-slate-600 text-[13px] font-semibold rounded-xl transition-colors"
        >
          Compare
        </a>
        <a
          href={`https://wa.me/?text=I found ${encodeURIComponent(agency.name)} on OverseasNursing.com`}
          target="_blank"
          rel="noopener noreferrer"
          className="h-10 w-10 flex items-center justify-center border border-slate-200 hover:border-[#22C55E] hover:bg-[#F0FDF4] rounded-xl transition-colors flex-shrink-0"
          aria-label="Share on WhatsApp"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#22C55E]">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
    </article>
  )
}
