import React from 'react'
import { Star, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import type { AgencyDetail } from '@/types/agencyDetail'

function MiniTrustBadge({ level }: { level: string }) {
  if (level === 'verified')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#DCFCE7] text-[#166534] text-[11px] font-semibold rounded-full">
        <CheckCircle size={9} />
        Verified
      </span>
    )
  if (level === 'trusted')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#DBEAFE] text-[#1D4ED8] text-[11px] font-semibold rounded-full">
        <CheckCircle size={9} />
        Trusted
      </span>
    )
  if (level === 'scam-reported')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FEE2E2] text-[#B91C1C] text-[11px] font-semibold rounded-full">
        <ShieldAlert size={9} />
        Scam Reported
      </span>
    )
  return null
}

interface RelatedAgenciesProps {
  relatedSlugs: AgencyDetail['relatedSlugs']
}

export async function RelatedAgencies({ relatedSlugs }: RelatedAgenciesProps) {
  if (!relatedSlugs?.length) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data: rows } = await db
    .from('agencies')
    .select('id, slug, name, city, trust_level, rating, review_count, pricing_min_lakhs, pricing_max_lakhs')
    .in('slug', relatedSlugs)
    .eq('is_active', true)

  if (!rows?.length) return null

  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-[22px] font-bold text-slate-800 mb-6">
        Compare Similar Agencies
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {rows.map((agency: any) => {
          const initials = agency.name
            .split(' ')
            .slice(0, 2)
            .map((w: string) => w[0])
            .join('')

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
                  <p className="text-[11.5px] text-slate-400">{agency.city}</p>
                </div>
              </div>

              <MiniTrustBadge level={agency.trust_level} />

              <div className="flex items-center gap-1.5 mt-3">
                <Star size={12} fill="#F59E0B" className="text-[#F59E0B]" />
                <span className="text-[13px] font-semibold text-slate-700">
                  {Number(agency.rating).toFixed(1)}
                </span>
                <span className="text-[12px] text-slate-400">({agency.review_count ?? 0})</span>
              </div>

              {(agency.pricing_min_lakhs || agency.pricing_max_lakhs) && (
                <p className="text-[12.5px] text-slate-500 mt-2">
                  ₹{agency.pricing_min_lakhs ?? 0}–{agency.pricing_max_lakhs ?? 0}L agency fee
                </p>
              )}

              <div className="flex items-center gap-1 mt-3 text-[12px] font-semibold text-primary">
                View profile
                <ArrowRight size={12} />
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
