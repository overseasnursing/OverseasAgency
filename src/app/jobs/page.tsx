import type { Metadata } from 'next'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { buildJobsCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'
import { getActiveJobs } from '@/lib/db/jobs'
import { JobsClient } from './JobsClient'
import { normalizeCountry } from './[slug]/_data/countryMappings'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Nursing Jobs Abroad — Overseas Nursing Jobs for Registered Nurses',
  description:
    'Browse overseas nursing jobs from approved healthcare recruiters and hospitals. Find nursing positions in Germany, UK, Canada, Australia and more.',
  alternates: { canonical: '/jobs' },
  openGraph: {
    title: 'Nursing Jobs Abroad — Overseas Nursing Jobs for Registered Nurses',
    description:
      'Browse overseas nursing jobs from approved healthcare recruiters and hospitals.',
    url: 'https://overseasnursing.com/jobs',
  },
}

export default async function JobsPage() {
  // Canonical listing — every approved, unexpired job, for every visitor
  // and crawler. Source-country personalization removed (Phase 1 hotfix).
  const jobs = await getActiveJobs()

  // Real, crawlable HTML links into the destination hierarchy — a sitemap
  // entry alone is a much weaker discovery/authority signal than an actual
  // internal link (Phase 7 already lists these in the sitemap; this closes
  // the gap by surfacing them here too). Only countries with a job today.
  const destinationCountries = [...new Set(jobs.map(j => j.country))].sort()

  // CollectionPage, not WebPage — this page's content is a listing, and
  // numberOfItems needs the per-request job count, so unlike the old static
  // WebPage schema this is built here rather than as a module constant.
  const schemas = [
    buildJobsCollectionPageSchema({
      name: 'Nursing Jobs Abroad',
      description: 'Browse overseas nursing jobs from approved healthcare recruiters and hospitals.',
      path: '/jobs',
      jobCount: jobs.length,
    }),
    buildBreadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Jobs', href: '/jobs' },
    ]),
  ]

  return (
    <>
      <MultiJsonLd schemas={schemas} />

      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-7">
          <h1 className="text-[26px] sm:text-[30px] font-bold text-slate-900 leading-tight">
            Nursing Jobs Abroad
          </h1>
          <p className="text-[14px] text-slate-400 mt-1.5">
            Browse overseas nursing jobs from approved healthcare recruiters and hospitals.
          </p>

          {destinationCountries.length > 0 && (
            <nav aria-label="Browse jobs by country" className="flex flex-wrap gap-2 mt-4">
              {destinationCountries.map(country => (
                <a
                  key={country}
                  href={`/jobs/${normalizeCountry(country)}`}
                  className="px-3 py-1.5 text-[12.5px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full hover:border-primary hover:text-primary transition-colors"
                >
                  {country}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>

      <div className="bg-[#F8FAFC] min-h-screen">
        <JobsClient jobs={jobs} />
      </div>
    </>
  )
}
