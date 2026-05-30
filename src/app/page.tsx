import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { FlagIcon } from '@/components/ui/FlagIcon'
import { getAllAgencies } from '@/lib/data/agencies'
import { PLATFORM_REVIEWS } from '@/lib/data/reviews'
import { getAllCountries } from '@/lib/data/countries'
import { getAllExams } from '@/lib/data/exams'
import type { CountryDetail, SalaryInfo } from '@/types/countryDetail'
import type { PlatformReview } from '@/types/review'
import type { Agency } from '@/types/agency'
import type { ExamPageData } from '@/types/exam'
import {
  CheckCircle, ShieldAlert, Star, ArrowRight,
  Clock, Banknote, Users, BookOpen, AlertTriangle,
  Shield, Eye, MessageSquare, ChevronRight, Award,
} from 'lucide-react'
import { HeroVisual } from '@/components/visuals/HeroVisual'
import { GlobalSearchBar, type SearchAgency, type SearchCountry, type SearchExam } from '@/components/search/GlobalSearchBar'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'

/* ── Metadata ────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Find Trusted Overseas Nursing Agencies — Real Reviews & Pricing',
  description:
    'Compare verified nurse reviews, real migration costs, exam guidance and scam reports. The most trusted platform for Indian nurses migrating to Germany, UK, Canada, Australia & Dubai.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'OverseasNursing — Trusted by 4,200+ Indian Nurses',
    description: 'Real reviews, transparent pricing, and scam protection for overseas nursing migration.',
    url: 'https://overseasnursing.com',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const HOME_SCHEMAS = [
  buildWebPageSchema({
    title: 'Find Trusted Overseas Nursing Agencies — Real Reviews & Pricing',
    description: 'Compare verified nurse reviews, real migration costs, exam guidance and scam reports. The most trusted platform for Indian nurses migrating to Germany, UK, Canada, Australia & Dubai.',
    path: '/',
  }),
  buildBreadcrumbSchema([{ name: 'Home', href: '/' }]),
]

/* ── Inline curated data ─────────────────────────────────────────── */

const SCAM_PATTERNS = [
  {
    pattern: 'Fake hospital offer letters',
    description:
      'Forged hospital partnership documents used to collect large upfront fees. The hospitals have no knowledge of the agency.',
    amountAtRisk: '₹2L – ₹5L',
    howToAvoid: 'Call the hospital directly using their official website number. Never verify through the agency.',
    reports: 12,
  },
  {
    pattern: 'Progressive payment trap',
    description:
      'One price quoted. New "mandatory" charges appear at every stage — apostille, translation, council registration — each sounding legitimate.',
    amountAtRisk: '₹30K – ₹1.5L extra',
    howToAvoid: 'Refuse any charge not in your original signed agreement without written justification first.',
    reports: 31,
  },
  {
    pattern: 'Ghost agency',
    description:
      'Professional website, active office during consultation. Goes completely unreachable after full payment is collected.',
    amountAtRisk: '₹1L – ₹6L',
    howToAvoid: 'Search this platform before paying anything. Verify government registration and read every review.',
    reports: 8,
  },
]

const PRICING_BENCHMARKS = [
  {
    country: 'Germany', flag: '🇩🇪', slug: 'germany',
    totalRange: '₹5L – ₹9L', agencyFee: '₹3L – ₹6L',
    hiddenRisk: 'low' as const, avgTransparency: 83,
    note: 'Language training costs are the biggest variable.',
  },
  {
    country: 'United Kingdom', flag: '🇬🇧', slug: 'uk',
    totalRange: '₹4L – ₹7L', agencyFee: '₹2L – ₹5L',
    hiddenRisk: 'medium' as const, avgTransparency: 76,
    note: 'OSCE retake fees often not disclosed upfront.',
  },
  {
    country: 'Canada', flag: '🇨🇦', slug: 'canada',
    totalRange: '₹8L – ₹14L', agencyFee: '₹3L – ₹8L',
    hiddenRisk: 'low' as const, avgTransparency: 81,
    note: 'Legitimately expensive — Express Entry is complex.',
  },
  {
    country: 'Australia', flag: '🇦🇺', slug: 'australia',
    totalRange: '₹6L – ₹11L', agencyFee: '₹3L – ₹7L',
    hiddenRisk: 'medium' as const, avgTransparency: 74,
    note: 'AHPRA skills assessment creates surprise costs.',
  },
  {
    country: 'Dubai', flag: '🇦🇪', slug: 'dubai',
    totalRange: '₹1.5L – ₹5L', agencyFee: '₹1L – ₹3.5L',
    hiddenRisk: 'high' as const, avgTransparency: 61,
    note: 'Highest hidden charge reports on this platform.',
  },
]


/* ── Helpers ─────────────────────────────────────────────────────── */

function formatCostLakhs(amount: number): string {
  const l = amount / 100000
  return `₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)}L`
}

function formatMonthlySalary(salary: SalaryInfo): string {
  if (salary.period === 'monthly') {
    return `${salary.localSymbol}${salary.localMin.toLocaleString()}–${salary.localMax.toLocaleString()}/mo`
  }
  const mn = Math.round(salary.localMin / 12 / 100) * 100
  const mx = Math.round(salary.localMax / 12 / 100) * 100
  return `${salary.localSymbol}${mn.toLocaleString()}–${mx.toLocaleString()}/mo`
}

function getDemandConfig(level: CountryDetail['demandLevel']) {
  if (level === 'very-high') return { label: 'Very High Demand', color: 'bg-[#DCFCE7] text-[#166534]' }
  if (level === 'high')      return { label: 'High Demand',      color: 'bg-[#DBEAFE] text-[#1D4ED8]' }
  return                           { label: 'Moderate',          color: 'bg-[#FEF3C7] text-[#92400E]' }
}

function getLanguageConfig(barrier: CountryDetail['languageBarrier']) {
  if (barrier === 'low')      return { label: 'English — no barrier', color: 'text-[#166534]' }
  if (barrier === 'moderate') return { label: 'IELTS / OET required', color: 'text-[#92400E]' }
  return                             { label: 'German B2 required',   color: 'text-[#B91C1C]' }
}

function getPrConfig(pathway: CountryDetail['prPathway'], years?: number) {
  if (pathway === 'direct')  return { label: `PR in ${years ?? '?'} yrs`, color: 'text-[#166534]' }
  if (pathway === 'pathway') return { label: 'PR pathway',               color: 'text-[#1D4ED8]' }
  return                            { label: 'No direct PR',             color: 'text-slate-400' }
}

function getAvatarColor(initials: string): string {
  const palettes = [
    'bg-[#DBEAFE] text-[#1D4ED8]',
    'bg-[#DCFCE7] text-[#166534]',
    'bg-[#FEF3C7] text-[#92400E]',
    'bg-[#F3E8FF] text-[#7C3AED]',
    'bg-[#FCE7F3] text-[#9D174D]',
    'bg-[#E0F2FE] text-[#075985]',
  ]
  return palettes[(initials.charCodeAt(0) + initials.charCodeAt(1)) % palettes.length]
}

function getHiddenRiskConfig(risk: 'low' | 'medium' | 'high') {
  if (risk === 'low')    return { label: 'Low risk',    color: 'bg-[#DCFCE7] text-[#166534]' }
  if (risk === 'medium') return { label: 'Medium risk', color: 'bg-[#FEF3C7] text-[#92400E]' }
  return                        { label: 'High risk',   color: 'bg-[#FEE2E2] text-[#B91C1C]' }
}

/* ── Sub-components ──────────────────────────────────────────────── */

function SectionLabel({ children, variant = 'default' }: {
  children: React.ReactNode
  variant?: 'default' | 'green' | 'red' | 'amber'
}) {
  const colors = {
    default: 'text-primary bg-primary/8',
    green:   'text-[#166534] bg-[#DCFCE7]',
    red:     'text-[#B91C1C] bg-[#FEE2E2]',
    amber:   'text-[#92400E] bg-[#FEF3C7]',
  }
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-semibold tracking-wide uppercase mb-5 ${colors[variant]}`}>
      {children}
    </div>
  )
}

function StarRow({ rating, size = 12 }: { rating: number; size?: number }) {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(full)].map((_, i)  => <Star key={`f${i}`} size={size} fill="#F59E0B" className="text-[#F59E0B]" />)}
      {half === 1 && <Star size={size} fill="#F59E0B" className="text-[#F59E0B] opacity-50" />}
      {[...Array(empty)].map((_, i) => <Star key={`e${i}`} size={size} className="text-slate-200" fill="#E2E8F0" />)}
    </div>
  )
}

function ReviewCard({ review }: { review: PlatformReview }) {
  const avatar = getAvatarColor(review.authorInitials)
  const excerpt = review.body.length > 150 ? `${review.body.slice(0, 148)}…` : review.body

  return (
    <article className="flex-shrink-0 w-[300px] sm:w-[320px] bg-white rounded-card shadow-card border border-slate-100 flex flex-col p-5 snap-start">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-[14px] font-bold ${avatar}`}>
          {review.authorInitials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-slate-800 leading-tight">{review.authorName}</p>
          <p className="text-[12px] text-slate-400 mt-0.5">{review.authorFrom}</p>
        </div>
        {review.verifiedPlacement && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#DCFCE7] text-[#166534] text-[10.5px] font-semibold rounded-full flex-shrink-0">
            <CheckCircle size={9} strokeWidth={2.5} />
            Placed
          </span>
        )}
      </div>

      {/* Destination */}
      <div className="flex items-center gap-2 mb-3">
        <FlagIcon name={review.destinationCountry} size={20} />
        <div>
          <p className="text-[13px] font-semibold text-slate-700">
            {review.destinationCity}, {review.destinationCountry}
          </p>
          <p className="text-[11.5px] text-slate-400">{review.hospitalType}</p>
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1.5 mb-3">
        <StarRow rating={review.rating} size={12} />
        <span className="text-[12px] font-semibold text-slate-700">{review.rating.toFixed(1)}</span>
      </div>

      {/* Quote */}
      <p className="text-[13px] text-slate-600 leading-relaxed flex-1 mb-4 italic">
        &ldquo;{excerpt}&rdquo;
      </p>

      {/* Footer stats */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
        <div>
          <p className="text-[11px] text-slate-400 mb-0.5">Total paid</p>
          <p className="text-[13px] font-bold text-slate-800">{formatCostLakhs(review.actualCostPaid)}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400 mb-0.5">Timeline</p>
          <p className="text-[13px] font-bold text-slate-800">{review.timelineMonths} months</p>
        </div>
        <div className="col-span-2">
          <p className="text-[11px] text-slate-400 mb-0.5">Via agency</p>
          <p className="text-[12.5px] font-medium text-primary">{review.agencyName}</p>
        </div>
      </div>
    </article>
  )
}

function FeaturedAgencyCard({ agency }: { agency: Agency }) {
  const initials = agency.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

  const trustColors: Record<string, string> = {
    verified: 'bg-[#DCFCE7] text-[#166534]',
    trusted:  'bg-[#DBEAFE] text-[#1D4ED8]',
  }
  const trustColor = trustColors[agency.trustLevel] ?? 'bg-slate-100 text-slate-500'

  const barColor =
    agency.transparencyScore >= 80 ? 'bg-[#22C55E]'
    : agency.transparencyScore >= 60 ? 'bg-[#F59E0B]'
    : 'bg-[#EF4444]'

  return (
    <article className="bg-white rounded-card shadow-card hover:shadow-card-md transition-shadow border border-slate-100 flex flex-col">
      <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-[15px] font-bold text-primary">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[16px] font-bold text-slate-800 leading-tight">{agency.name}</h3>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full flex-shrink-0 ${trustColor}`}>
                {agency.trustLevel === 'verified' && <CheckCircle size={9} strokeWidth={2.5} />}
                {agency.trustLevel === 'verified' ? 'Verified' : 'Trusted'}
              </span>
            </div>
            <p className="text-[12px] text-slate-400 mt-0.5">{agency.location} · Est. {agency.established}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <StarRow rating={agency.rating} size={12} />
          <span className="text-[14px] font-bold text-slate-800">{agency.rating.toFixed(1)}</span>
          <span className="text-[12px] text-slate-400">({agency.reviewCount.toLocaleString()} reviews)</span>
        </div>

        {/* Transparency score */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Transparency Score</span>
            <span className="text-[12px] font-bold text-slate-700">{agency.transparencyScore}/100</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${agency.transparencyScore}%` }} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Banknote, label: 'Agency fee', value: `₹${agency.pricing.minLakhs}–${agency.pricing.maxLakhs}L` },
            { icon: Clock,    label: 'Timeline',   value: `${agency.averageTimelineMonths}mo` },
            { icon: Users,    label: 'Placed',     value: `${agency.placementCount.toLocaleString()}+` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-[#F8FAFC] rounded-xl p-2.5 text-center">
              <Icon size={13} className="text-slate-400 mx-auto mb-1" />
              <p className="text-[12.5px] font-bold text-slate-800 leading-tight">{value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Countries */}
        <div className="flex flex-wrap gap-1.5">
          {agency.countries.slice(0, 3).map((c) => (
            <span key={c} className="px-2 py-0.5 bg-[#EFF6FF] text-[#1D4ED8] text-[11.5px] font-medium rounded-full">
              {c}
            </span>
          ))}
          {agency.countries.length > 3 && (
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[11.5px] font-medium rounded-full">
              +{agency.countries.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 pt-0">
        <a
          href={`/agency/${agency.slug}`}
          className="flex items-center justify-center gap-1.5 h-10 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors w-full"
        >
          View profile
          <ChevronRight size={14} />
        </a>
      </div>
    </article>
  )
}

function CountryCard({ country }: { country: CountryDetail }) {
  const demand   = getDemandConfig(country.demandLevel)
  const language = getLanguageConfig(country.languageBarrier)
  const pr       = getPrConfig(country.prPathway, country.prTimelineYears)
  const salary   = formatMonthlySalary(country.salary)

  return (
    <a
      href={`/country/${country.slug}`}
      className="bg-white rounded-card shadow-card hover:shadow-card-md transition-shadow border border-slate-100 flex flex-col p-5 group"
    >
      <div className="flex items-start justify-between mb-3">
        <FlagIcon slug={country.slug} size={36} className="rounded-sm" />
        <span className={`inline-flex items-center px-2 py-0.5 text-[10.5px] font-semibold rounded-full ${demand.color}`}>
          {demand.label}
        </span>
      </div>

      <h3 className="text-[16px] font-bold text-slate-800 mb-1">{country.name}</h3>

      <div className="flex flex-col gap-2 mb-4 flex-1">
        <div className="flex items-center gap-2">
          <Banknote size={12} className="text-slate-400 flex-shrink-0" />
          <span className="text-[12.5px] font-semibold text-slate-700">{salary}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-slate-400 flex-shrink-0" />
          <span className="text-[12.5px] text-slate-500">
            Visa {country.visaProcessingWeeks.min}–{country.visaProcessingWeeks.max} weeks
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={12} className="text-slate-400 flex-shrink-0" />
          <span className={`text-[12.5px] font-medium ${language.color}`}>{language.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <Award size={12} className="text-slate-400 flex-shrink-0" />
          <span className={`text-[12.5px] font-medium ${pr.color}`}>{pr.label}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          <span className="text-[11.5px] font-semibold text-[#166534]">
            {country.recommendationPercent}% recommend
          </span>
        </div>
        <span className="text-[12px] font-semibold text-primary flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
          Explore <ChevronRight size={12} />
        </span>
      </div>
    </a>
  )
}

function ExamGuideCard({ exam }: { exam: ExamPageData }) {
  const typeLabel: Record<string, string> = {
    language:     'Language Exam',
    professional: 'Professional Exam',
    clinical:     'Clinical Assessment',
  }
  const typeColor: Record<string, string> = {
    language:     'bg-[#DBEAFE] text-[#1D4ED8]',
    professional: 'bg-[#DCFCE7] text-[#166534]',
    clinical:     'bg-[#FEF3C7] text-[#92400E]',
  }

  return (
    <a
      href={`/exam/${exam.slug}`}
      className="bg-white rounded-card shadow-card hover:shadow-card-md transition-shadow border border-slate-100 flex flex-col p-5 group flex-shrink-0 w-[260px] sm:w-[280px]"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
          <BookOpen size={18} className="text-primary" />
        </div>
        <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${typeColor[exam.examType] ?? 'bg-slate-100 text-slate-500'}`}>
          {typeLabel[exam.examType] ?? 'Guide'}
        </span>
      </div>

      <h3 className="text-[15px] font-bold text-slate-800 mb-1">{exam.examName}</h3>
      <p className="text-[12px] text-slate-400 mb-3">{exam.examFullName}</p>

      <p className="text-[12.5px] text-slate-500 leading-relaxed flex-1 mb-4 line-clamp-2">
        {exam.tagline}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[12px] text-slate-400">
          {exam.prepTimeMonths.min}–{exam.prepTimeMonths.max} months prep
        </span>
        <span className="text-[12px] font-semibold text-primary flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
          Read guide <ChevronRight size={12} />
        </span>
      </div>
    </a>
  )
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function HomePage() {
  const agencies  = getAllAgencies()
  const countries = getAllCountries()
  const exams     = getAllExams()

  const featuredAgencies = agencies.filter((a) => a.featured).slice(0, 3)
  const featuredReviews  = PLATFORM_REVIEWS.filter((r) => r.featured).slice(0, 6)

  // Lightweight search data — only the fields the GlobalSearchBar needs
  const searchAgencies:  SearchAgency[]  = agencies.map(a  => ({ slug: a.slug,  name: a.name,     location: a.location      }))
  const searchCountries: SearchCountry[] = countries.map(c => ({ slug: c.slug,  name: c.name                                }))
  const searchExams:     SearchExam[]    = exams.map(e     => ({ slug: e.slug,  examName: e.examName, examFullName: e.examFullName }))

  return (
    <>
      <MultiJsonLd schemas={HOME_SCHEMAS} />
      {/* ══════════════════════════════════════════════════════════
          §1 — HERO
      ══════════════════════════════════════════════════════════ */}
      <SectionWrapper spacing="lg" background="card">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

            {/* ── Left: text content ── */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex -space-x-1.5">
                  {['AK', 'PM', 'DV', 'ST'].map((i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold ${getAvatarColor(i)}`}
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-[13px] font-semibold text-slate-600">
                  <span className="text-[#166534] font-bold">4,200+ nurses</span> have reviewed agencies on this platform
                </p>
              </div>

              {/* H1 */}
              <h1 className="mb-5 text-balance">
                Find overseas nursing agencies that nurses actually trust.
              </h1>

              {/* Sub */}
              <p className="text-[17px] text-slate-500 leading-[1.78] mb-8 max-w-[520px]">
                Compare verified reviews, real migration costs, and scam reports —
                from nurses who have already made the move to Germany, UK, Canada, and beyond.
              </p>

              {/* Search */}
              <GlobalSearchBar agencies={searchAgencies} countries={searchCountries} exams={searchExams} />

              {/* Country pills */}
              <div className="flex flex-wrap items-center gap-2 mb-10">
                <span className="text-[12px] text-slate-400 font-medium">Quick explore:</span>
                {[
                  { label: 'Germany',   slug: 'germany' },
                  { label: 'UK',        slug: 'uk' },
                  { label: 'Canada',    slug: 'canada' },
                  { label: 'Australia', slug: 'australia' },
                  { label: 'Dubai',     slug: 'dubai' },
                ].map(({ label, slug }) => (
                  <a
                    key={slug}
                    href={`/country/${slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F8FAFC] hover:bg-primary/8 hover:text-primary border border-slate-200 hover:border-primary/30 text-slate-600 text-[13px] font-medium rounded-full transition-colors"
                  >
                    <FlagIcon slug={slug} size={18} />
                    {label}
                  </a>
                ))}
              </div>

              {/* Trust stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-100">
                {[
                  { value: '4,200+', label: 'Verified reviews',      icon: MessageSquare, color: 'text-primary' },
                  { value: '600+',   label: 'Agencies listed',        icon: Users,         color: 'text-[#166534]' },
                  { value: '180+',   label: 'Scam reports filed',     icon: ShieldAlert,   color: 'text-[#B91C1C]' },
                  { value: '89%',    label: 'Would recommend agency', icon: CheckCircle,   color: 'text-[#92400E]' },
                ].map(({ value, label, icon: Icon, color }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <Icon size={14} className={color} />
                      <span className="text-[22px] font-bold text-slate-800 leading-none">{value}</span>
                    </div>
                    <p className="text-[12px] text-slate-400 leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: visual composition ── */}
            <div className="hidden lg:block">
              <HeroVisual />
            </div>
          </div>
        </Container>
      </SectionWrapper>

      {/* ══════════════════════════════════════════════════════════
          §2 — REAL NURSE EXPERIENCES
      ══════════════════════════════════════════════════════════ */}
      <SectionWrapper spacing="md" background="warm" divided>
        <Container>
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <SectionLabel variant="green">
                <CheckCircle size={11} />
                Verified nurse stories
              </SectionLabel>
              <h2 className="text-balance">
                What nurses say after they actually migrate.
              </h2>
              <p className="text-[15px] text-slate-500 mt-2 max-w-[480px]">
                Every review is from a nurse with a verified placement. Real costs. Real timelines. Real agencies.
              </p>
              {/* Journey strip */}
              <div className="flex items-center gap-2 mt-5 flex-wrap">
                {[
                  { slug: 'germany', label: 'Germany', pct: '94%' },
                  { slug: 'uk', label: 'UK', pct: '91%' },
                  { slug: 'canada', label: 'Canada', pct: '88%' },
                  { slug: 'australia', label: 'Australia', pct: '87%' },
                  { slug: 'dubai', label: 'Dubai', pct: '79%' },
                ].map(({ slug, label, pct }) => (
                  <div key={slug} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                    <FlagIcon slug={slug} size={14} className="rounded-sm" />
                    <span className="text-[12px] font-medium text-slate-700">{label}</span>
                    <span className="text-[11px] font-bold text-[#166534]">{pct}</span>
                  </div>
                ))}
                <span className="text-[11.5px] text-slate-400 ml-1">recommend</span>
              </div>
            </div>
            <a
              href="/reviews"
              className="hidden sm:flex items-center gap-1.5 text-[13.5px] font-semibold text-primary hover:text-primary-hover transition-colors flex-shrink-0"
            >
              All reviews <ArrowRight size={14} />
            </a>
          </div>

          {/* Horizontal scroll */}
          <div className="-mx-5 sm:-mx-6 lg:-mx-8 px-5 sm:px-6 lg:px-8 overflow-x-auto pb-4">
            <div className="flex gap-4" style={{ width: 'max-content' }}>
              {featuredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>

          <div className="mt-6 sm:hidden">
            <a
              href="/reviews"
              className="flex items-center gap-1.5 text-[13.5px] font-semibold text-primary"
            >
              View all reviews <ArrowRight size={14} />
            </a>
          </div>
        </Container>
      </SectionWrapper>

      {/* ══════════════════════════════════════════════════════════
          §3 — FEATURED AGENCIES
      ══════════════════════════════════════════════════════════ */}
      <SectionWrapper spacing="md" background="page" divided>
        <Container>
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <SectionLabel>
                <Award size={11} />
                Highest rated agencies
              </SectionLabel>
              <h2 className="text-balance">
                Agencies nurses recommend most.
              </h2>
              <p className="text-[15px] text-slate-500 mt-2 max-w-[480px]">
                Ranked by transparency score, verified placements, and nurse reviews —
                not by who pays us.
              </p>
            </div>
            <a
              href="/agencies"
              className="hidden sm:flex items-center gap-1.5 text-[13.5px] font-semibold text-primary hover:text-primary-hover transition-colors flex-shrink-0"
            >
              All 600+ agencies <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {featuredAgencies.map((agency) => (
              <FeaturedAgencyCard key={agency.id} agency={agency} />
            ))}
          </div>

          {/* Trust note */}
          <div className="flex items-start gap-2.5 p-4 bg-white border border-slate-100 rounded-2xl">
            <Eye size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-slate-500 leading-relaxed">
              <span className="font-semibold text-slate-700">No paid rankings.</span>{' '}
              Agency order is determined entirely by transparency score, review count, and nurse recommendation rate.
              Agencies cannot pay for better placement.
            </p>
          </div>

          <div className="mt-5 sm:hidden">
            <a
              href="/agencies"
              className="flex items-center gap-1.5 text-[13.5px] font-semibold text-primary"
            >
              See all 600+ agencies <ArrowRight size={14} />
            </a>
          </div>
        </Container>
      </SectionWrapper>

      {/* ══════════════════════════════════════════════════════════
          §4 — COUNTRY EXPLORATION
      ══════════════════════════════════════════════════════════ */}
      <SectionWrapper spacing="md" background="section" divided>
        <Container>
          <div className="mb-8">
            <SectionLabel>
              <MessageSquare size={11} />
              Destination guides
            </SectionLabel>
            <h2 className="text-balance mb-2">
              Which country is right for you?
            </h2>
            <p className="text-[15px] text-slate-500 max-w-[480px]">
              Compare salaries, visa timelines, language requirements, and PR pathways
              across the top 5 nursing destinations for Indian nurses.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {countries.map((country) => (
              <CountryCard key={country.slug} country={country} />
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href="/compare"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              Compare countries side-by-side <ChevronRight size={12} />
            </a>
            <a
              href="/salary"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              Salary guides by country <ChevronRight size={12} />
            </a>
          </div>
        </Container>
      </SectionWrapper>

      {/* ══════════════════════════════════════════════════════════
          §5 — PRICING TRANSPARENCY
      ══════════════════════════════════════════════════════════ */}
      <SectionWrapper spacing="md" background="card" divided>
        <Container>
          <div className="mb-8">
            <SectionLabel variant="amber">
              <Banknote size={11} />
              Pricing intelligence
            </SectionLabel>
            <h2 className="text-balance mb-2">
              What migration actually costs — before and after hidden charges.
            </h2>
            <p className="text-[15px] text-slate-500 max-w-[560px]">
              Based on cost reports from nurses on this platform. Every number is
              nurse-reported, not agency-declared.
            </p>
          </div>

          {/* Table — desktop */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200">
                  <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-wide">Country</th>
                  <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-wide">Full migration cost</th>
                  <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-wide">Agency fee range</th>
                  <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-wide">Hidden charge risk</th>
                  <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-wide">Avg transparency</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PRICING_BENCHMARKS.map((b, i) => {
                  const risk = getHiddenRiskConfig(b.hiddenRisk)
                  return (
                    <tr key={b.slug} className={`hover:bg-[#F8FAFC] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FCFCFD]'}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <FlagIcon slug={b.slug} size={24} className="rounded-sm" />
                          <span className="text-[14px] font-semibold text-slate-800">{b.country}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[14px] font-bold text-slate-800">{b.totalRange}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[14px] text-slate-600">{b.agencyFee}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 text-[11.5px] font-semibold rounded-full ${risk.color}`}>
                          {risk.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${b.avgTransparency >= 80 ? 'bg-[#22C55E]' : b.avgTransparency >= 70 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}
                              style={{ width: `${b.avgTransparency}%` }}
                            />
                          </div>
                          <span className="text-[13px] font-semibold text-slate-700">{b.avgTransparency}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <a
                          href={`/pricing/${b.slug}`}
                          className="text-[12.5px] font-semibold text-primary hover:text-primary-hover"
                        >
                          Full breakdown →
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile */}
          <div className="md:hidden flex flex-col gap-4">
            {PRICING_BENCHMARKS.map((b) => {
              const risk = getHiddenRiskConfig(b.hiddenRisk)
              return (
                <div key={b.slug} className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FlagIcon slug={b.slug} size={24} className="rounded-sm" />
                      <span className="text-[15px] font-bold text-slate-800">{b.country}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full ${risk.color}`}>
                      {risk.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-[11px] text-slate-400 mb-0.5">Total cost</p>
                      <p className="text-[14px] font-bold text-slate-800">{b.totalRange}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 mb-0.5">Agency fee</p>
                      <p className="text-[14px] font-semibold text-slate-700">{b.agencyFee}</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-400 mb-3 italic">{b.note}</p>
                  <a
                    href={`/pricing/${b.slug}`}
                    className="text-[13px] font-semibold text-primary flex items-center gap-1"
                  >
                    See full pricing breakdown <ArrowRight size={13} />
                  </a>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl flex items-start gap-2.5">
            <AlertTriangle size={15} className="text-[#92400E] flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-[#92400E] leading-relaxed">
              <span className="font-semibold">Important:</span> The costs above are nurse-reported averages.
              Your actual cost depends on which agency you choose and which country you target.
              Always get a written itemized quote before paying anything.
            </p>
          </div>
        </Container>
      </SectionWrapper>

      {/* ══════════════════════════════════════════════════════════
          §6 — SCAM AWARENESS
      ══════════════════════════════════════════════════════════ */}
      <SectionWrapper spacing="md" background="page" divided>
        <Container>
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <SectionLabel variant="red">
                <ShieldAlert size={11} />
                Scam awareness
              </SectionLabel>
              <h2 className="text-balance mb-2">
                Know the patterns before you lose money.
              </h2>
              <p className="text-[15px] text-slate-500 max-w-[480px]">
                180+ scam reports filed by nurses on this platform. These are the three
                most common patterns — every nurse should know them.
              </p>
            </div>
            <a
              href="/scam-reports"
              className="hidden sm:flex items-center gap-1.5 text-[13.5px] font-semibold text-[#B91C1C] hover:text-red-900 transition-colors flex-shrink-0 mt-1"
            >
              All reports <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {SCAM_PATTERNS.map((p) => (
              <div key={p.pattern} className="bg-white border border-[#FECACA]/60 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-slate-800 leading-tight">{p.pattern}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 bg-[#FEE2E2] text-[#B91C1C] text-[10.5px] font-semibold rounded-full flex-shrink-0">
                    {p.reports} reports
                  </span>
                </div>

                <p className="text-[13.5px] text-slate-600 leading-relaxed flex-1">{p.description}</p>

                <div className="p-3 bg-[#FEF3C7] rounded-xl">
                  <p className="text-[11.5px] font-semibold text-[#92400E] mb-1">Amount at risk</p>
                  <p className="text-[13px] font-bold text-[#92400E]">{p.amountAtRisk}</p>
                </div>

                <div className="flex items-start gap-2 p-3 bg-[#DCFCE7] rounded-xl">
                  <Shield size={12} className="text-[#166534] flex-shrink-0 mt-0.5" />
                  <p className="text-[12.5px] text-[#166534] leading-relaxed">{p.howToAvoid}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl">
            <div className="flex items-start gap-3">
              <ShieldAlert size={20} className="text-[#B91C1C] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[14px] font-bold text-[#B91C1C] mb-0.5">180+ scam reports verified on this platform</p>
                <p className="text-[13px] text-[#B91C1C]/80 leading-relaxed">
                  Every report is reviewed. Agencies with verified scam reports are flagged in our directory.
                </p>
              </div>
            </div>
            <a
              href="/scam-reports"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#B91C1C] hover:bg-red-800 text-white text-[13px] font-semibold rounded-xl transition-colors flex-shrink-0"
            >
              View all reports
              <ArrowRight size={13} />
            </a>
          </div>
        </Container>
      </SectionWrapper>

      {/* ══════════════════════════════════════════════════════════
          §7 — EXAM GUIDES
      ══════════════════════════════════════════════════════════ */}
      <SectionWrapper spacing="md" background="section" divided>
        <Container>
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <SectionLabel>
                <BookOpen size={11} />
                Free guides
              </SectionLabel>
              <h2 className="text-balance">
                Every exam, explained for Indian nurses.
              </h2>
              <p className="text-[15px] text-slate-500 mt-2 max-w-[460px]">
                Step-by-step prep guides for OET, NCLEX, DHA, HAAD, and the UK CBT —
                written for nurses who are just starting out.
              </p>
            </div>
            <a
              href="/exam"
              className="hidden sm:flex items-center gap-1.5 text-[13.5px] font-semibold text-primary hover:text-primary-hover transition-colors flex-shrink-0"
            >
              All exam guides <ArrowRight size={14} />
            </a>
          </div>

          {/* Horizontal scroll */}
          <div className="-mx-5 sm:-mx-6 lg:-mx-8 px-5 sm:px-6 lg:px-8 overflow-x-auto pb-4">
            <div className="flex gap-4" style={{ width: 'max-content' }}>
              {exams.map((exam) => (
                <ExamGuideCard key={exam.slug} exam={exam} />
              ))}
            </div>
          </div>

          <div className="mt-6 sm:hidden">
            <a href="/exam" className="flex items-center gap-1.5 text-[13.5px] font-semibold text-primary">
              See all exam guides <ArrowRight size={14} />
            </a>
          </div>
        </Container>
      </SectionWrapper>

      {/* ══════════════════════════════════════════════════════════
          §8 — TRUST & TRANSPARENCY
      ══════════════════════════════════════════════════════════ */}
      <SectionWrapper spacing="md" background="warm" divided>
        <Container>
          <div className="max-w-[560px] mb-10">
            <SectionLabel variant="green">
              <Shield size={11} />
              How we verify trust
            </SectionLabel>
            <h2 className="text-balance mb-2">
              A platform nurses can genuinely rely on.
            </h2>
            <p className="text-[15px] text-slate-500">
              The problem with most agency directories is that agencies pay for
              better rankings and can remove bad reviews. We built the opposite.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: CheckCircle,
                color: 'bg-[#DCFCE7] text-[#166534]',
                borderAccent: 'border-l-[#22C55E]',
                stat: '4,200+',
                statLabel: 'verified placements',
                title: 'Verified placements only',
                body: 'We verify that the nurse actually worked at the destination hospital. Reviews from unverified placements are clearly marked — and carry less weight in rankings.',
              },
              {
                icon: Eye,
                color: 'bg-[#DBEAFE] text-[#1D4ED8]',
                borderAccent: 'border-l-primary',
                stat: '0–100',
                statLabel: 'transparency scale',
                title: 'Transparency scoring',
                body: 'Every agency gets a 0–100 transparency score based on fee disclosure completeness, contract clarity, and nurse feedback. Updated monthly.',
              },
              {
                icon: Shield,
                color: 'bg-[#FEE2E2] text-[#B91C1C]',
                borderAccent: 'border-l-[#EF4444]',
                stat: '180+',
                statLabel: 'reports investigated',
                title: 'Scam investigation',
                body: 'Every scam report is reviewed by our team. We contact agencies for a response, cross-reference reports, and flag agencies with verified complaints.',
              },
              {
                icon: MessageSquare,
                color: 'bg-[#FEF3C7] text-[#92400E]',
                borderAccent: 'border-l-[#F59E0B]',
                stat: '0',
                statLabel: 'deleted nurse reviews',
                title: 'No agency manipulation',
                body: 'Agencies cannot edit, delete, or downvote reviews. They can only respond publicly. Nurses control what stays on the platform — not the agencies.',
              },
            ].map(({ icon: Icon, color, borderAccent, stat, statLabel, title, body }) => (
              <div key={title} className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${borderAccent} shadow-card p-6 flex gap-4 hover:shadow-card-md transition-shadow`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-[18px] font-bold text-slate-800">{stat}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{statLabel}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-800 mb-1.5">{title}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </SectionWrapper>

      {/* ══════════════════════════════════════════════════════════
          §9 — FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <SectionWrapper spacing="md" background="card" divided>
        <Container size="readable">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-[#1a6abf] px-8 py-14 text-center shadow-[0_16px_48px_rgba(15,76,129,0.20)]">
            {/* Background dot pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            {/* Soft glow blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl" style={{ background: 'rgba(34,197,94,0.15)' }} />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full mb-6 border border-white/20">
                <CheckCircle size={13} className="text-white" />
                <span className="text-[12.5px] font-semibold text-white">Free forever for nurses</span>
              </div>

              <h2 className="text-balance mb-4 text-white">
                Ready to find a nursing agency you can actually trust?
              </h2>

              <p className="text-[16px] text-white/75 leading-[1.78] mb-8 mx-auto max-w-[440px]">
                4,200+ nurses have already researched their agency here.
                Don&apos;t pay anyone until you&apos;ve verified them on this platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/agencies"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 text-primary text-[14px] font-bold rounded-xl transition-colors shadow-sm"
                >
                  Search agencies
                  <ArrowRight size={15} />
                </a>
                <a
                  href="/country/germany"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white text-[14px] font-semibold rounded-xl transition-colors border border-white/20"
                >
                  Explore Germany first
                </a>
              </div>

              {/* Bottom trust strip */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 pt-8 border-t border-white/20 text-[12.5px] text-white/60">
                {[
                  '✓ No agency pays for rankings',
                  '✓ Verified nurse reviews only',
                  '✓ Scam-flagged agencies visible',
                  '✓ Completely free for nurses',
                ].map((item) => (
                  <span key={item} className="font-medium">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </SectionWrapper>
    </>
  )
}
