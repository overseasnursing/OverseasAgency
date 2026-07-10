'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useSourceCountry } from '@/lib/country/context'
import { rankBySourceCountry } from '@/lib/recommendations/rank'

export type RelatedGuideLink = {
  slug:          string
  title:         string
  sourceCountry?: string
}

/**
 * Guide detail page's sidebar "Related Guides" list. Server-renders the
 * exact same editorially-curated order as before (guide.relatedSlugs,
 * resolved to titles) — that's the canonical HTML and it never changes on
 * first paint. Only after mount, once Market Context resolves, does it
 * re-rank toward the visitor's source country via the shared recommendation
 * layer — a no-op today since no guide is tagged yet (see GuideData.sourceCountry
 * in src/lib/data/guides.ts), and live the moment one is.
 */
export function RecommendedGuides({ guides }: { guides: RelatedGuideLink[] }) {
  const { country, ready } = useSourceCountry()
  const [ranked, setRanked] = useState(guides)

  useEffect(() => {
    if (!ready) return
    const reranked = rankBySourceCountry(guides, country.name, guides.length)
    if (reranked.length > 0) setRanked(reranked)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, country.name])

  if (ranked.length === 0) return null

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide mb-3">Related Guides</h3>
      <div className="flex flex-col gap-2">
        {ranked.map((rel) => (
          <a
            key={rel.slug}
            href={`/guides/${rel.slug}`}
            className="flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <span className="text-[13px] text-slate-700 group-hover:text-primary transition-colors leading-snug">
              {rel.title.split(' — ')[0]}
            </span>
            <ArrowRight size={12} className="text-slate-300 group-hover:text-primary flex-shrink-0 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  )
}
