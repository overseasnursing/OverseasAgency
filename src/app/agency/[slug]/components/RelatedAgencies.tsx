import React from 'react'
import { Star, CheckCircle, ShieldAlert, MapPin, ArrowRight } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

function MiniTrustBadge({ level }: { level: string }) {
  if (level === 'verified')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#DCFCE7] text-[#166534] text-[11px] font-semibold rounded-full">
        <CheckCircle size={9} /> Verified
      </span>
    )
  if (level === 'trusted')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#DBEAFE] text-[#1D4ED8] text-[11px] font-semibold rounded-full">
        <CheckCircle size={9} /> Trusted
      </span>
    )
  if (level === 'scam-reported')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FEE2E2] text-[#B91C1C] text-[11px] font-semibold rounded-full">
        <ShieldAlert size={9} /> Scam Reported
      </span>
    )
  return null
}

interface RelatedAgenciesProps {
  currentId: string
  city: string
  state: string
}

export async function RelatedAgencies({ currentId, city, state }: RelatedAgenciesProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const SELECT = 'id, slug, name, city, state, trust_level, rating, review_count, pricing_min_lakhs, pricing_max_lakhs'

  // 1. Fetch agencies in the same city (excluding current)
  const { data: cityRows } = await db
    .from('agencies')
    .select(SELECT)
    .eq('city', city)
    .eq('is_active', true)
    .neq('id', currentId)
    .order('rating', { ascending: false })
    .limit(3)

  const cityAgencies: any[] = cityRows ?? []

  let stateAgencies: any[] = []

  // 2. If city gave fewer than 3, top up from same state (excluding city ones already picked)
  if (cityAgencies.length < 3) {
    const excludeIds = [currentId, ...cityAgencies.map((a: any) => a.id)]
    const needed = 3 - cityAgencies.length

    const { data: stateRows } = await db
      .from('agencies')
      .select(SELECT)
      .eq('state', state)
      .eq('is_active', true)
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .order('rating', { ascending: false })
      .limit(needed)

    stateAgencies = stateRows ?? []
  }

  const agencies = [...cityAgencies, ...stateAgencies]
  if (!agencies.length) return null

  const sameCity  = cityAgencies.length
  const heading   = sameCity > 0 ? `Other agencies in ${city}` : `Other agencies in ${state}`

  return (
    <section aria-labelledby="related-heading">
      <div className="flex items-center gap-2 mb-6">
        <MapPin size={16} className="text-slate-400" />
        <h2 id="related-heading" className="text-[22px] font-bold text-slate-800">
          {heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {agencies.map((agency: any) => {
          const initials = agency.name
            .split(' ')
            .slice(0, 2)
            .map((w: string) => w[0])
            .join('')

          const isStateOnly = !cityAgencies.find((c: any) => c.id === agency.id)

          return (
            <a
              key={agency.slug}
              href={`/agency/${agency.slug}`}
              className="group bg-white border border-slate-200 rounded-2xl p-4 hover:border-primary/30 hover:shadow-card-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[13px] font-bold text-primary">{initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">
                    {agency.name}
                  </p>
                  <p className="text-[11.5px] text-slate-400">
                    {agency.city}{isStateOnly && agency.city !== city ? ` · ${agency.state}` : ''}
                  </p>
                </div>
              </div>

              <MiniTrustBadge level={agency.trust_level} />

              <div className="flex items-center gap-1.5 mt-3">
                <Star size={12} fill="#F59E0B" className="text-[#F59E0B]" />
                <span className="text-[13px] font-semibold text-slate-700">
                  {Number(agency.rating || 0).toFixed(1)}
                </span>
                <span className="text-[12px] text-slate-400">({agency.review_count ?? 0})</span>
              </div>

              {(agency.pricing_min_lakhs || agency.pricing_max_lakhs) && (
                <p className="text-[12.5px] text-slate-500 mt-2">
                  ₹{agency.pricing_min_lakhs ?? 0}–{agency.pricing_max_lakhs ?? 0}L agency fee
                </p>
              )}

              <div className="flex items-center gap-1 mt-3 text-[12px] font-semibold text-primary">
                View profile <ArrowRight size={12} />
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
