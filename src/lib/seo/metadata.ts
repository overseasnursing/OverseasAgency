import type { Metadata } from 'next'

const BASE_URL = 'https://overseasnursing.com'
const SITE_NAME = 'OverseasNursing.com'
const DEFAULT_OG_IMAGE = '/og/default.png'

// ─── Core builder ──────────────────────────────────────────────────────────────

interface MetadataInput {
  title: string
  description: string
  path: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noIndex?: boolean
}

export function buildMetadata({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
}: MetadataInput): Metadata {
  const url = `${BASE_URL}${path}`
  const img = ogImage.startsWith('http') ? ogImage : ogImage

  return {
    title,
    description,
    ...(noIndex && { robots: { index: false, follow: false } }),
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: ogType,
      images: [{ url: img, width: 1200, height: 630, alt: `${title} — ${SITE_NAME}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [img],
    },
  }
}

// ─── Agency ────────────────────────────────────────────────────────────────────

export function buildAgencyMetadata(agency: {
  name: string
  slug: string
  tagline?: string
  rating?: number
  feeMin?: number
  feeMax?: number
  primaryCountry?: string
}): Metadata {
  const feeRange =
    agency.feeMin && agency.feeMax
      ? ` Fee range: ₹${(agency.feeMin / 100000).toFixed(1)}L–₹${(agency.feeMax / 100000).toFixed(1)}L.`
      : ''
  const title = `${agency.name} Review 2025 — Fees, Ratings & Nurse Experiences | ${SITE_NAME}`
  const description = agency.tagline
    ? `${agency.tagline} Verified nurse reviews, fee breakdowns, and placement records.${feeRange}`
    : `Read ${agency.name} reviews from verified Indian nurses. See actual costs, hidden charge reports, placement success rate, and transparency scores.${feeRange}`

  return buildMetadata({
    title,
    description,
    path: `/agency/${agency.slug}`,
    ogImage: `/og/agency-${agency.slug}.png`,
  })
}

// ─── Country ───────────────────────────────────────────────────────────────────

export function buildCountryMetadata(country: {
  name: string
  slug: string
  salaryDisplay?: string
  totalMin?: number
  totalMax?: number
}): Metadata {
  const costRange =
    country.totalMin && country.totalMax
      ? ` Total migration cost: ₹${(country.totalMin / 100000).toFixed(1)}L–₹${(country.totalMax / 100000).toFixed(1)}L.`
      : ''
  const title = `${country.name} Nursing Migration Guide 2025 — Salary, Visa & Process for Indian Nurses | ${SITE_NAME}`
  const description = `Complete guide to nursing migration from India to ${country.name}. Salary ranges${country.salaryDisplay ? ` (${country.salaryDisplay})` : ''}, visa process, exam requirements, agency fees, and verified nurse reviews.${costRange}`

  return buildMetadata({
    title,
    description,
    path: `/country/${country.slug}`,
    ogImage: `/og/country-${country.slug}.png`,
  })
}

// ─── Pricing ───────────────────────────────────────────────────────────────────

export function buildPricingMetadata(data: {
  countryName: string
  countrySlug: string
  totalMin: number
  totalMax: number
  totalTypical: number
}): Metadata {
  const title = `${data.countryName} Nursing Migration Cost 2025 — Complete Fee Breakdown (₹${(data.totalMin / 100000).toFixed(1)}L–₹${(data.totalMax / 100000).toFixed(1)}L) | ${SITE_NAME}`
  const description = `Full cost breakdown for Indian nurses migrating to ${data.countryName}. Agency fees, exam costs, visa fees, hidden charges, and actual nurse experiences. Typical total: ₹${(data.totalTypical / 100000).toFixed(1)}L — verified 2025 data.`

  return buildMetadata({
    title,
    description,
    path: `/pricing/${data.countrySlug}`,
    ogImage: `/og/pricing-${data.countrySlug}.png`,
  })
}

// ─── Location — state directory page ──────────────────────────────────────────

export function buildStateAgencyMetadata(data: {
  state: string
  stateSlug: string
  agencyCount: number
  topDestinations: string[]
  feeRange: { minLakhs: number; maxLakhs: number }
}): Metadata {
  const dest = data.topDestinations.slice(0, 3).join(', ')
  const feeNote = data.feeRange.minLakhs > 0
    ? ` Fees from ₹${data.feeRange.minLakhs}L.`
    : ''

  const title = `${data.agencyCount} Overseas Nursing Agencies in ${data.state} (2025) — Verified Reviews & Fees | ${SITE_NAME}`
  const description = `Compare ${data.agencyCount} verified overseas nursing agencies in ${data.state}.${feeNote} Real nurse reviews, transparent pricing${dest ? `, placements to ${dest}` : ''} and scam alerts — all in one place.`

  return buildMetadata({
    title,
    description,
    path: `/agencies/${data.stateSlug}`,
    ogImage: `/og/agencies-${data.stateSlug}.png`,
  })
}

// ─── Location — city directory page ───────────────────────────────────────────

export function buildCityAgencyMetadata(data: {
  city: string
  citySlug: string
  state: string
  stateSlug: string
  agencyCount: number
  topDestinations: string[]
}): Metadata {
  const dest = data.topDestinations.slice(0, 3).join(', ')

  const title = `Overseas Nursing Agencies in ${data.city}, ${data.state} — ${data.agencyCount} Verified | ${SITE_NAME}`
  const description = `Find ${data.agencyCount} verified overseas nursing agenc${data.agencyCount === 1 ? 'y' : 'ies'} in ${data.city}. Compare fees, read real nurse reviews${dest ? `, and explore placements to ${dest}` : ''}. Updated 2025 data.`

  return buildMetadata({
    title,
    description,
    path: `/agencies/${data.stateSlug}/${data.citySlug}`,
    ogImage: `/og/agencies-${data.stateSlug}-${data.citySlug}.png`,
  })
}

// ─── Location (legacy /location/[city]) ───────────────────────────────────────

export function buildLocationMetadata(location: {
  city: string
  citySlug: string
  state: string
  agencyCount: number
}): Metadata {
  const title = `Best Overseas Nursing Agencies in ${location.city}, ${location.state} — 2025 Guide | ${SITE_NAME}`
  const description = `Find verified overseas nursing consultancies in ${location.city}. Compare ${location.agencyCount}+ agencies, fees, destinations (Germany, UK, Canada, Australia), and read real nurse reviews before signing.`

  return buildMetadata({
    title,
    description,
    path: `/location/${location.citySlug}`,
    ogImage: `/og/location-${location.citySlug}.png`,
  })
}

// ─── Comparison ────────────────────────────────────────────────────────────────

export function buildComparisonMetadata(comp: {
  countryAName: string
  countryBName: string
  slug: string
  verdict?: string
}): Metadata {
  const title = `${comp.countryAName} vs ${comp.countryBName} Nursing Migration 2025 — Which is Better for Indian Nurses? | ${SITE_NAME}`
  const description = `Side-by-side comparison of ${comp.countryAName} and ${comp.countryBName} nursing migration. Salary, cost, process time, PR pathway, language requirements, and job demand — all compared for Indian nurses.${comp.verdict ? ` ${comp.verdict}` : ''}`

  return buildMetadata({
    title,
    description,
    path: `/compare/${comp.slug}`,
    ogImage: `/og/compare-${comp.slug}.png`,
    ogType: 'article',
  })
}

// ─── Salary ────────────────────────────────────────────────────────────────────

export function buildSalaryMetadata(salary: {
  countryName: string
  slug: string
  averageSalary: string
  inrEquivalent: string
}): Metadata {
  const title = `${salary.countryName} Nurse Salary 2025 — Complete Guide for Indian Nurses (${salary.averageSalary}) | ${SITE_NAME}`
  const description = `${salary.countryName} nursing salary guide for Indian nurses. Average salary: ${salary.averageSalary} (≈ ${salary.inrEquivalent}). Breakdown by experience, specialty, and city. Updated 2025 data.`

  return buildMetadata({
    title,
    description,
    path: `/salary/${salary.slug}`,
    ogImage: `/og/salary-${salary.slug}.png`,
    ogType: 'article',
  })
}

// ─── Exam ──────────────────────────────────────────────────────────────────────

export function buildExamMetadata(exam: {
  examName: string
  slug: string
  applicableCountries: string[]
  prepTimeMonths: { min: number; max: number }
}): Metadata {
  const countries = exam.applicableCountries.slice(0, 3).join(', ')
  const title = `${exam.examName} Guide 2025 — Complete Preparation for Indian Nurses | ${SITE_NAME}`
  const description = `Complete ${exam.examName} preparation guide for Indian nurses migrating to ${countries}. Exam structure, passing scores, preparation tips, registration process, and study resources. Prep time: ${exam.prepTimeMonths.min}–${exam.prepTimeMonths.max} months.`

  return buildMetadata({
    title,
    description,
    path: `/exam/${exam.slug}`,
    ogImage: `/og/exam-${exam.slug}.png`,
    ogType: 'article',
  })
}

// ─── Scam report ───────────────────────────────────────────────────────────────

export function buildScamReportMetadata(report: {
  title: string
  slug: string
  agencyName: string
  amountLost: number
  reporterFrom: string
}): Metadata {
  const description = `Verified scam report against ${report.agencyName}. ₹${(report.amountLost / 100000).toFixed(1)}L lost. Full incident timeline, warning signs, and lessons for Indian nurses. Reported from ${report.reporterFrom}.`

  return buildMetadata({
    title: `${report.title} — Scam Report | ${SITE_NAME}`,
    description,
    path: `/scam-report/${report.slug}`,
    ogImage: '/og/scam-reports.png',
    ogType: 'article',
  })
}

// ─── Reviews index ─────────────────────────────────────────────────────────────

export function buildReviewsMetadata(): Metadata {
  return buildMetadata({
    title: `Nurse Reviews of Overseas Recruitment Agencies — Verified Experiences | ${SITE_NAME}`,
    description:
      'Read verified reviews from Indian nurses about overseas recruitment agencies. Real experiences covering costs, timelines, hidden charges, and placements in Germany, UK, Canada, Australia, and Dubai.',
    path: '/reviews',
    ogImage: '/og/reviews.png',
  })
}

// ─── Guide ─────────────────────────────────────────────────────────────────────

export function buildGuideMetadata(guide: {
  title: string
  slug: string
  description: string
  category: string
}): Metadata {
  return buildMetadata({
    title: `${guide.title} | ${SITE_NAME}`,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    ogImage: `/og/guide-${guide.slug}.png`,
    ogType: 'article',
  })
}
