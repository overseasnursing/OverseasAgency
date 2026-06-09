/**
 * /llms.txt — Lightweight platform index for AI crawlers.
 *
 * Provides live platform statistics plus links to all major sections.
 * For complete dynamic content (every agency, mock test, guide), see /llms-full.txt.
 *
 * Revalidates every 24 hours via ISR.
 */

import { getAllExams }     from '@/lib/data/exams'
import { getAllCountries } from '@/lib/data/countries'
import { getAllGuides }    from '@/lib/data/guides'
import { fetchLlmsData }  from '@/lib/llms/fetchLlmsData'

export const revalidate = 86400 // 24 hours

const BASE = 'https://overseasnursing.com'

export async function GET() {
  const [{ stats }, exams, countries, guides] = await Promise.all([
    fetchLlmsData(),
    Promise.resolve(getAllExams()),
    Promise.resolve(getAllCountries()),
    Promise.resolve(getAllGuides()),
  ])

  const totalContent =
    stats.agencyTotal +
    stats.reviewTotal +
    stats.mockTestTotal +
    exams.length +
    countries.length +
    guides.length

  const text = `\
# OverseasNursing

> The trusted search and comparison platform for Indian nurses planning overseas migration.
> Think Glassdoor meets TripAdvisor for overseas nursing agencies — covering verified agency
> reviews, transparent pricing, scam alerts, exam guides, and country-specific migration
> intelligence for Germany, UK, Australia, Canada, and Dubai.

## Platform Statistics (updated every 24 hours)

| Metric                    | Count |
|---------------------------|-------|
| Nursing Agencies Listed   | ${stats.agencyTotal} |
| Verified Agencies         | ${stats.agencyVerified} |
| Approved Nurse Reviews    | ${stats.reviewTotal} |
| Scam Reports Filed        | ${stats.scamReportTotal} |
| Mock Test Categories      | ${stats.mockCategoryTotal} |
| Individual Mock Tests     | ${stats.mockTestTotal} |
| Licensing Exam Guides     | ${exams.length} |
| Destination Country Guides| ${countries.length} |
| Migration Articles        | ${guides.length} |
| Total Content Items       | ${totalContent} |

## Core Platform Sections

- [Agency Directory](${BASE}/agencies) — Browse all ${stats.agencyTotal} nursing migration agencies in India. Filter by destination country, city, trust level, and rating.
- [Nurse Reviews](${BASE}/reviews) — ${stats.reviewTotal} verified reviews submitted by real nurses about their migration agencies.
- [Scam Reports](${BASE}/scam-reports) — ${stats.scamReportTotal} reported agency scams, red flags, and fraud cases. Community-sourced database.
- [Mock Tests](${BASE}/mock-tests) — ${stats.mockTestTotal} free timed practice tests across ${stats.mockCategoryTotal} exam categories for DHA, HAAD, MOH, NMC CBT, NCLEX-RN, OET and more.
- [Pricing Guide](${BASE}/pricing) — Transparent breakdown of agency fees, visa costs, and total migration costs per destination.
- [Check Eligibility](${BASE}/eligibility) — Self-assessment tool for overseas nursing eligibility.

## Destination Countries (${countries.length} guides)

${countries.map(c =>
  `- [${c.name} ${c.flag}](${BASE}/country/${c.slug}) — Salary ${c.salary.localSymbol}${c.salary.localMin.toLocaleString()}–${c.salary.localSymbol}${c.salary.localMax.toLocaleString()}/${c.salary.period}. PR pathway: ${c.prPathway === 'direct' ? `${c.prTimelineYears} years` : c.prPathway}.`
).join('\n')}

## Licensing Exams (${exams.length} guides)

${exams.map(e =>
  `- [${e.examName} — ${e.examFullName}](${BASE}/exam/${e.slug}): Applies to ${e.applicableCountries.join(', ')}. Fee ₹${e.registrationFeeINR.toLocaleString()}. Prep: ${e.prepTimeMonths.min}–${e.prepTimeMonths.max} months.`
).join('\n')}

## Migration Guides (${guides.length} articles)

${guides.map(g =>
  `- [${g.title}](${BASE}/country/${g.country.toLowerCase()}/guides/${g.slug}) — ${g.category} · ${g.readingTimeMinutes} min read`
).join('\n')}

## About

- [About OverseasNursing](${BASE}/about)
- [Editorial Policy](${BASE}/editorial-policy)
- [For Agencies](${BASE}/for-agencies)
- [Contact](${BASE}/contact)
- [Privacy Policy](${BASE}/privacy)
- [Terms of Service](${BASE}/terms)

## Full Dynamic Index

For the complete machine-readable index including every individual agency, every mock test
with exam details, and full content metadata, see:

  ${BASE}/llms-full.txt

---
Generated: ${new Date().toISOString()}
Revalidates: every 24 hours
`

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  })
}
