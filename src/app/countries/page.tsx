import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { FlagIcon } from '@/components/ui/FlagIcon'
import { getAllCountries } from '@/lib/data/countries'
import { ArrowRight, TrendingUp, Clock, CheckCircle, XCircle, Globe } from 'lucide-react'
import type { CountryDetail } from '@/types/countryDetail'

export const metadata: Metadata = {
  title: 'Nursing Migration Destinations — Germany, UK, Canada, Australia, Dubai',
  description:
    'Compare all overseas nursing destinations for Indian nurses. Salary, visa timelines, PR pathways, migration costs, and nurse reviews for Germany, UK, Canada, Australia and Dubai.',
  alternates: { canonical: '/countries' },
  openGraph: {
    title: 'Overseas Nursing Destinations — Compare Countries',
    description: 'Full comparison of salary, costs, PR pathways and visa timelines for Indian nurses.',
    url: 'https://overseasnursing.com/countries',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const DEMAND_CONFIG = {
  'very-high': { label: 'Very High Demand', cls: 'bg-[#DCFCE7] text-[#166534]' },
  'high':      { label: 'High Demand',      cls: 'bg-[#DBEAFE] text-[#1D4ED8]' },
  'moderate':  { label: 'Moderate Demand',  cls: 'bg-[#FEF3C7] text-[#92400E]' },
}

const PR_CONFIG = {
  'direct':  { label: 'PR Pathway',    cls: 'text-[#166534]' },
  'pathway': { label: 'PR Possible',   cls: 'text-[#1D4ED8]' },
  'none':    { label: 'No PR',         cls: 'text-slate-400' },
}

function formatSalary(country: CountryDetail) {
  const { salary } = country
  if (salary.period === 'monthly') {
    return `${salary.localSymbol}${salary.localMin.toLocaleString()}–${salary.localMax.toLocaleString()}/mo`
  }
  return `${salary.localSymbol}${Math.round(salary.localMin / 1000)}K–${Math.round(salary.localMax / 1000)}K/yr`
}

function CountryCard({ country }: { country: CountryDetail }) {
  const demand = DEMAND_CONFIG[country.demandLevel]
  const pr     = PR_CONFIG[country.prPathway]

  return (
    <a
      href={`/country/${country.slug}`}
      className="group bg-white rounded-card shadow-card hover:shadow-card-md transition-all border border-slate-100 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 pb-5 flex items-start gap-4">
        <FlagIcon slug={country.slug} size={48} className="rounded-md flex-shrink-0" />
        <div className="min-w-0">
          <h2 className="text-[19px] font-bold text-slate-800 leading-tight mb-1">{country.name}</h2>
          <span className={`inline-flex items-center gap-1 text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${demand.cls}`}>
            <TrendingUp size={10} />
            {demand.label}
          </span>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-[13.5px] text-slate-500 leading-relaxed px-6 pb-5">
        {country.tagline}
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-px bg-slate-100 border-t border-slate-100 mt-auto">
        <div className="bg-white px-4 py-3">
          <p className="text-[10.5px] text-slate-400 uppercase tracking-wide mb-0.5">Salary</p>
          <p className="text-[14px] font-bold text-slate-800">{formatSalary(country)}</p>
        </div>
        <div className="bg-white px-4 py-3">
          <p className="text-[10.5px] text-slate-400 uppercase tracking-wide mb-0.5">Total Cost</p>
          <p className="text-[14px] font-bold text-slate-800">
            ₹{(country.totalMigrationCostMin / 100000).toFixed(1)}L – ₹{(country.totalMigrationCostMax / 100000).toFixed(1)}L
          </p>
        </div>
        <div className="bg-white px-4 py-3">
          <p className="text-[10.5px] text-slate-400 uppercase tracking-wide mb-0.5">Visa Timeline</p>
          <p className="text-[14px] font-bold text-slate-800 flex items-center gap-1">
            <Clock size={11} className="text-slate-400" />
            {country.visaProcessingWeeks.min}–{country.visaProcessingWeeks.max} weeks
          </p>
        </div>
        <div className="bg-white px-4 py-3">
          <p className="text-[10.5px] text-slate-400 uppercase tracking-wide mb-0.5">PR Pathway</p>
          <p className={`text-[14px] font-bold flex items-center gap-1 ${pr.cls}`}>
            {country.prPathway !== 'none'
              ? <><CheckCircle size={11} />{country.prPathway === 'direct' && country.prTimelineYears ? `${country.prTimelineYears} yrs` : 'Available'}</>
              : <><XCircle size={11} />None</>
            }
          </p>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100">
        <span className="text-[12.5px] text-slate-400">
          {country.recommendationPercent}% nurses recommend
        </span>
        <span className="flex items-center gap-1 text-[13px] font-semibold text-primary group-hover:gap-2 transition-all">
          Full guide <ArrowRight size={13} />
        </span>
      </div>
    </a>
  )
}

export default function CountriesPage() {
  const countries = getAllCountries()

  return (
    <>
      {/* Hero */}
      <SectionWrapper spacing="lg" background="card">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-1.5 mb-5">
                <Globe size={13} className="text-primary" />
                <span className="text-[12px] font-semibold text-primary tracking-wide uppercase">
                  5 destinations
                </span>
              </div>
              <h1 className="text-balance mb-4">
                Where can Indian nurses migrate?
              </h1>
              <p className="text-[17px] text-slate-500 leading-[1.75]">
                Compare salary, migration costs, visa timelines and PR pathways across every top
                destination for Indian nurses — all in one place.
              </p>
              <div className="mt-6">
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-2 h-11 px-6 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors"
                >
                  Check My Eligibility <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Right: destination visual cards */}
            <div className="hidden lg:grid grid-cols-1 gap-2.5" aria-hidden="true">
              {[
                { slug: 'germany',   salary: '€2,800–3,800/mo', info: 'PR in 4 yrs · Very High demand', accent: 'border-l-[#DC2626]' },
                { slug: 'uk',        salary: '£28K–35K/yr',      info: 'PR in 5 yrs · NHS pathway',     accent: 'border-l-[#1D4ED8]' },
                { slug: 'canada',    salary: 'CAD 60K–85K/yr',   info: 'Express Entry PR · NCLEX',       accent: 'border-l-[#DC2626]' },
                { slug: 'australia', salary: 'AUD 65K–90K/yr',   info: 'PR possible · AHPRA',            accent: 'border-l-[#0F4C81]' },
                { slug: 'dubai',     salary: 'AED 7K–12K/mo',    info: 'Tax-free · 2–6 weeks',           accent: 'border-l-[#166534]' },
              ].map(({ slug, salary, info, accent }) => (
                <a
                  key={slug}
                  href={`/country/${slug}`}
                  className={`group flex items-center gap-4 bg-white rounded-xl border border-slate-100 border-l-4 ${accent} shadow-sm hover:shadow-card-md transition-all px-5 py-3.5`}
                >
                  <FlagIcon slug={slug} size={32} className="rounded-md flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-slate-800 capitalize leading-tight">
                      {slug === 'uk' ? 'United Kingdom' : slug === 'dubai' ? 'Dubai / UAE' : slug.charAt(0).toUpperCase() + slug.slice(1)}
                    </p>
                    <p className="text-[12px] text-slate-400 truncate">{info}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[13.5px] font-bold text-primary">{salary}</p>
                    <ArrowRight size={12} className="ml-auto mt-0.5 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Container>
      </SectionWrapper>

      {/* Country cards */}
      <SectionWrapper spacing="md" background="page" divided>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country) => (
              <CountryCard key={country.slug} country={country} />
            ))}
          </div>
        </Container>
      </SectionWrapper>

      {/* Quick comparison table */}
      <SectionWrapper spacing="md" background="section" divided>
        <Container>
          <h2 className="text-[22px] font-bold text-slate-800 mb-2">Quick Comparison</h2>
          <p className="text-[14px] text-slate-500 mb-8">All figures are estimates for Indian nurses. Updated 2025.</p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-[13.5px]" style={{ minWidth: 640 }}>
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-[12px] uppercase tracking-wide">Country</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-slate-500 text-[12px] uppercase tracking-wide">Monthly Salary</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-slate-500 text-[12px] uppercase tracking-wide">Total Cost</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-slate-500 text-[12px] uppercase tracking-wide">Visa Time</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-slate-500 text-[12px] uppercase tracking-wide">PR</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-slate-500 text-[12px] uppercase tracking-wide">Tax-Free</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((c, i) => {
                  const inrMin = (c.salary.inrMonthlyMin / 100000).toFixed(1)
                  const inrMax = (c.salary.inrMonthlyMax / 100000).toFixed(1)
                  return (
                    <tr
                      key={c.slug}
                      className={`${i < countries.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50/50 transition-colors`}
                    >
                      <td className="px-5 py-4">
                        <a href={`/country/${c.slug}`} className="flex items-center gap-2.5 hover:text-primary transition-colors">
                          <FlagIcon slug={c.slug} size={20} className="rounded-sm" />
                          <span className="font-semibold text-slate-800">{c.name}</span>
                        </a>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-700">
                        ₹{inrMin}L – ₹{inrMax}L
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        ₹{(c.totalMigrationCostMin / 100000).toFixed(1)}L – ₹{(c.totalMigrationCostMax / 100000).toFixed(1)}L
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {c.visaProcessingWeeks.min}–{c.visaProcessingWeeks.max} wks
                      </td>
                      <td className="px-4 py-4">
                        {c.prPathway !== 'none'
                          ? <span className="text-[#166534] font-semibold">Yes</span>
                          : <span className="text-slate-400">No</span>
                        }
                      </td>
                      <td className="px-4 py-4">
                        {c.salary.taxFree
                          ? <span className="text-[#166534] font-semibold">Yes</span>
                          : <span className="text-slate-400">No</span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Container>
      </SectionWrapper>
    </>
  )
}
