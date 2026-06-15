import type { Metadata } from 'next'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'
import { getActiveJobs } from '@/lib/db/jobs'
import { JobsClient } from './JobsClient'

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

const JOBS_SCHEMAS = [
  buildWebPageSchema({
    title: 'Nursing Jobs Abroad',
    description:
      'Browse overseas nursing jobs from approved healthcare recruiters and hospitals.',
    path: '/jobs',
  }),
  buildBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Jobs', href: '/jobs' },
  ]),
]

export default async function JobsPage() {
  const jobs = await getActiveJobs()

  return (
    <>
      <MultiJsonLd schemas={JOBS_SCHEMAS} />

      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-7">
          <h1 className="text-[26px] sm:text-[30px] font-bold text-slate-900 leading-tight">
            Nursing Jobs Abroad
          </h1>
          <p className="text-[14px] text-slate-400 mt-1.5">
            Browse overseas nursing jobs from approved healthcare recruiters and hospitals.
          </p>
        </div>
      </div>

      <div className="bg-[#F8FAFC] min-h-screen">
        <JobsClient jobs={jobs} />
      </div>
    </>
  )
}
