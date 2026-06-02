import React from 'react'
import { Star, ArrowRight, ChevronRight, ShieldCheck } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

type AgencyCard = {
  id:                 string
  name:               string
  slug:               string
  logo:               string | null
  featuredImage:      string | null
  location:           string
  established:        number | null
  trustLevel:         string
  googleRating:       number | null
  googleReviewCount:  number | null
  transparencyScore:  number
  countries:          string[]
  pricingMin:         number | null
  pricingMax:         number | null
  timeline:           string | null
  placements:         number | null
}

async function getTopAgencies(countryTerms: string[]): Promise<AgencyCard[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Fetch top 200 by transparency score, then filter JS-side.
  // Avoids DB-level array operator issues (text[] vs jsonb) and the old 80-limit ceiling.
  const { data } = await db
    .from('agencies')
    .select('*')
    .eq('is_active', true)
    .order('transparency_score', { ascending: false })
    .limit(200)

  if (!data?.length) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matched = (data as any[])
    .filter(a => {
      const countries: string[] = Array.isArray(a.countries) ? a.countries : []
      return countries.some(c =>
        countryTerms.some(term =>
          c.toLowerCase().includes(term.toLowerCase()) ||
          term.toLowerCase().includes(c.toLowerCase())
        )
      )
    })
    .slice(0, 3)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return matched.map((a: any): AgencyCard => ({
    id:                a.id,
    name:              a.name,
    slug:              a.slug,
    logo:              a.logo              ?? null,
    featuredImage:     a.featured_image    ?? null,
    location:          a.location          ?? '',
    established:       a.established       ?? null,
    trustLevel:        a.trust_level       ?? 'unverified',
    googleRating:      a.google_rating     ?? null,
    googleReviewCount: a.google_review_count ?? null,
    transparencyScore: a.transparency_score ?? 0,
    countries:         Array.isArray(a.countries) ? a.countries : [],
    pricingMin:        a.pricing_min_lakhs ?? null,
    pricingMax:        a.pricing_max_lakhs ?? null,
    timeline:          a.average_timeline_months ?? null,
    placements:        a.placement_count   ?? null,
  }))
}

/* ── Sub-components ──────────────────────────────────────────────────── */

function TrustBadge({ level }: { level: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    verified:       { label: 'Verified',       cls: 'bg-primary/10 text-primary border-primary/20' },
    trusted:        { label: 'Trusted',         cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    unverified:     { label: 'Unverified',      cls: 'bg-slate-100 text-slate-500 border-slate-200' },
    'scam-reported':{ label: 'Scam Reported',   cls: 'bg-red-50 text-red-700 border-red-200' },
  }
  const { label, cls } = cfg[level] ?? cfg['unverified']
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
      <ShieldCheck size={10} /> {label}
    </span>
  )
}

function Initials({ name }: { name: string }) {
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
      <span className="text-[13px] font-bold text-primary">{initials}</span>
    </div>
  )
}

function TransparencyBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wide">Transparency Score</span>
        <span className={`text-[11.5px] font-bold ${score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
          {score}/100
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

function CountryChips({ countries }: { countries: string[] }) {
  const shown = countries.slice(0, 3)
  const extra = countries.length - shown.length
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map(c => (
        <span key={c} className="text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
          {c}
        </span>
      ))}
      {extra > 0 && (
        <span className="text-[11px] font-medium text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
          +{extra} more
        </span>
      )}
    </div>
  )
}

type Props = {
  countryTerms:        string[]
  countryName:         string
  countrySlug:         string
  flagCode:            string
  agencyFilterCountry: string
}

export async function DestinationAgencyCards({ countryTerms, countryName, countrySlug, flagCode, agencyFilterCountry }: Props) {
  const agencies = await getTopAgencies(countryTerms)

  const agenciesHref = `/agencies?country=${encodeURIComponent(agencyFilterCountry)}`

  // No agencies — show plain button only
  if (!agencies.length) {
    return (
      <div className="mt-8 text-center">
        <a
          href={agenciesHref}
          className="inline-flex items-center gap-2 h-10 px-6 bg-white border border-slate-200 hover:border-primary/40 hover:bg-primary/[0.03] text-[13px] font-semibold text-slate-700 hover:text-primary rounded-xl transition-all"
        >
          Find Agencies for {countryName} <ChevronRight size={14} />
        </a>
      </div>
    )
  }

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img src={`https://flagcdn.com/20x15/${flagCode}.png`} alt={`${countryName} flag`} width={20} height={15} className="rounded-sm" />
          <h2 className="text-[15px] font-bold text-slate-800">
            Top Agencies for {countryName}
          </h2>
        </div>
        <a
          href={agenciesHref}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:underline"
        >
          Find More Agencies <ArrowRight size={13} />
        </a>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {agencies.map(agency => (
          <div key={agency.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-card-md hover:border-slate-300 transition-all flex flex-col">

            {/* Featured image */}
            {agency.featuredImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={agency.featuredImage} alt={agency.name} width={600} height={144} className="w-full h-36 object-cover" />
            ) : (
              <div className="w-full h-36 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <span className="text-[28px] font-bold text-primary/20">
                  {agency.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}

            <div className="p-4 flex flex-col gap-3 flex-1">
              {/* Logo + name + trust */}
              <div className="flex items-start gap-3">
                {agency.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={agency.logo} alt={`${agency.name} logo`} width={40} height={40} className="w-10 h-10 rounded-xl object-contain border border-slate-100 flex-shrink-0" />
                ) : (
                  <Initials name={agency.name} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13.5px] font-bold text-slate-800 leading-tight line-clamp-1">{agency.name}</p>
                    <TrustBadge level={agency.trustLevel} />
                  </div>
                  <p className="text-[11.5px] text-slate-400 mt-0.5">
                    {agency.location}
                    {agency.established ? ` · Est. ${agency.established}` : ''}
                  </p>
                </div>
              </div>

              {/* Google rating */}
              {agency.googleRating && agency.googleRating > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500">G</span>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={11} className={i <= Math.round(agency.googleRating!) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
                    ))}
                  </div>
                  <span className="text-[12px] font-semibold text-slate-700">{agency.googleRating.toFixed(1)}</span>
                  {agency.googleReviewCount ? (
                    <span className="text-[11.5px] text-slate-400">({agency.googleReviewCount.toLocaleString()} Google)</span>
                  ) : null}
                </div>
              )}

              {/* Transparency score */}
              {agency.transparencyScore > 0 && (
                <TransparencyBar score={agency.transparencyScore} />
              )}

              {/* Countries */}
              {agency.countries.length > 0 && (
                <CountryChips countries={agency.countries} />
              )}

              {/* Stats */}
              {(agency.pricingMin || agency.timeline || agency.placements) && (
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                  {agency.pricingMin && (
                    <div className="text-center">
                      <p className="text-[12.5px] font-bold text-slate-800">
                        ₹{agency.pricingMin}–{agency.pricingMax}L
                      </p>
                      <p className="text-[10px] text-slate-400">approx.</p>
                    </div>
                  )}
                  {agency.timeline && (
                    <div className="text-center">
                      <p className="text-[12.5px] font-bold text-slate-800">{agency.timeline}</p>
                      <p className="text-[10px] text-slate-400">months</p>
                    </div>
                  )}
                  {agency.placements !== null && agency.placements > 0 && (
                    <div className="text-center">
                      <p className="text-[12.5px] font-bold text-slate-800">
                        {agency.placements >= 1000 ? `${(agency.placements/1000).toFixed(0)}k+` : `${agency.placements}+`}
                      </p>
                      <p className="text-[10px] text-slate-400">placed</p>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <a
                href={`/agency/${agency.slug}`}
                className="mt-auto flex items-center justify-center gap-2 w-full h-10 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
              >
                View Profile <ChevronRight size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
