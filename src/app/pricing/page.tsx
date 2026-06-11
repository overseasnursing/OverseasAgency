import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { EligibilityCalculator } from './EligibilityCalculator'
import { fetchFeaturedAgencies } from '@/lib/data/fetchAgencies'
import { getAllPricingCountrySlugs, getPricingData } from '@/lib/data/pricing'
import { FlagIcon } from '@/components/ui/FlagIcon'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'Nursing Abroad Costs 2025 — Exam Fees, Licensing & Migration Expenses by Country',
  description:
    'Compare the full cost of migrating abroad as an Indian nurse — exam fees (OET, NCLEX, DHA), licensing costs, agency charges, and visa expenses for Germany, UK, Canada, Australia, and Dubai. Find the most affordable migration route for your budget.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Nursing Abroad Costs 2025 — Migration Fees by Country | OverseasNursing',
    description: 'Full cost breakdown for Indian nurses migrating to Germany, UK, Canada, Australia, and Dubai — exam fees, licensing, agency charges, and visa costs compared.',
    url: 'https://overseasnursing.com/pricing',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const PRICING_HUB_SCHEMAS = [
  buildWebPageSchema({
    title: 'Nursing Abroad Costs 2025 — Exam Fees, Licensing & Migration Expenses by Country',
    description: 'Compare the full cost of migrating abroad as an Indian nurse — exam fees (OET, NCLEX, DHA), licensing costs, agency charges, and visa expenses for Germany, UK, Canada, Australia, and Dubai.',
    path: '/pricing',
  }),
  buildBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/pricing' },
  ]),
]

export default async function EligibilityPage() {
  const agencies = await fetchFeaturedAgencies(50)
  const slugs = getAllPricingCountrySlugs()
  const countries = slugs.flatMap((slug) => {
    const data = getPricingData(slug)
    if (!data) return []
    const timelineMonths = data.nurseCostExperiences.map((e) => e.timelineMonths)
    const minMonths = Math.min(...timelineMonths)
    const maxMonths = Math.max(...timelineMonths)
    const timeline = minMonths === maxMonths ? `~${minMonths} months` : `${minMonths}–${maxMonths} months`
    const primaryExam = data.pricingTimeline[0]?.stageName ?? '—'
    return [{
      slug,
      countryName: data.countryName,
      flag: data.flag,
      totalMin: data.totalMin,
      totalMax: data.totalMax,
      totalTypical: data.totalTypical,
      timeline,
      primaryExam,
    }]
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MultiJsonLd schemas={PRICING_HUB_SCHEMAS} />
      <Container>
        {/* International Nursing Costs at a Glance */}
        <section className="pt-10 pb-8">
          <h2 className="text-[22px] font-bold text-slate-800 mb-1">
            International Nursing Costs at a Glance
          </h2>
          <p className="text-[14px] text-slate-500 mb-6">
            Estimated all-in migration cost for Indian nurses — 2025 data. Select a country below for the full breakdown.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.map((c) => (
              <a
                key={c.slug}
                href={`/pricing/${c.slug}`}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <FlagIcon emoji={c.flag} size={22} className="rounded-sm flex-shrink-0" />
                  <span className="text-[14px] font-bold text-slate-800">{c.countryName}</span>
                </div>

                <div className="flex flex-col gap-2 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total cost range</span>
                    <span className="font-semibold text-slate-700">
                      ₹{(c.totalMin / 100000).toFixed(1)}L–₹{(c.totalMax / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Typical spend</span>
                    <span className="font-bold text-primary">₹{(c.totalTypical / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Typical timeline</span>
                    <span className="font-semibold text-slate-700">{c.timeline}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 mt-0.5">
                    <span className="text-slate-400 text-[11.5px] uppercase tracking-wide font-semibold">Primary exam</span>
                    <p className="text-[12.5px] text-slate-600 mt-0.5 leading-snug">{c.primaryExam}</p>
                  </div>
                </div>

                <span className="text-[12px] font-semibold text-primary mt-auto">
                  Full breakdown →
                </span>
              </a>
            ))}
          </div>
        </section>

        <EligibilityCalculator agencies={agencies} />
      </Container>
    </div>
  )
}
