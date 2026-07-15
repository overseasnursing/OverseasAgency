import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { buildJobsCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'
import { getActiveJobsByDestination, getActiveJobCountries, getJobBySlugPublic } from '@/lib/db/jobs'
import { normalizeCountry } from '../_data/countryMappings'
import { JOB_COUNTRIES } from '@/lib/jobConstants'
import { DestinationJobsView } from '../_components/DestinationJobsView'

export const revalidate = 1800

// Canonical country-slug → the exact DB value jobs.country uses, derived
// from the same posting-form enum + normaliser already used elsewhere in
// the Jobs module — avoids a second, hand-maintained mapping.
const COUNTRY_SLUG_TO_VALUE: Record<string, string> = Object.fromEntries(
  JOB_COUNTRIES.map(c => [normalizeCountry(c), c]),
)

interface PageProps {
  params: Promise<{ country: string }>
}

export async function generateStaticParams() {
  const countries = await getActiveJobCountries()
  const slugs = new Set(countries.map(c => normalizeCountry(c)))
  return [...slugs].map(country => ({ country }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params
  const countryValue = COUNTRY_SLUG_TO_VALUE[country]
  if (!countryValue) return {}
  const title = `Nursing Jobs in ${countryValue} — Overseas Nursing Jobs`
  const description = `Browse approved nursing jobs in ${countryValue} from verified healthcare recruiters and hospitals.`
  return {
    title,
    description,
    alternates: { canonical: `/jobs/${country}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://overseasnursing.com/jobs/${country}`,
    },
  }
}

export default async function JobsByCountryPage({ params }: PageProps) {
  const { country } = await params
  const countryValue = COUNTRY_SLUG_TO_VALUE[country]

  if (!countryValue) {
    // Not a recognized destination slug — this segment used to be a job
    // detail page (/jobs/[slug]) before job listings moved to
    // /jobs/listing/[slug]. Next.js disallows two dynamic routes with
    // different param names at the same URL depth, so old job-slug URLs
    // are resolved and 308-redirected here instead of living in their own
    // folder, to keep those indexed links working.
    const job = await getJobBySlugPublic(country)
    if (job) permanentRedirect(`/jobs/listing/${country}`)
    notFound()
  }

  // Canonical — every approved, unexpired job for this destination, for
  // every visitor and crawler. Never filtered by source country.
  const jobs = await getActiveJobsByDestination({ country: countryValue })

  const schemas = [
    buildJobsCollectionPageSchema({
      name: `Nursing Jobs in ${countryValue}`,
      description: `Browse approved nursing jobs in ${countryValue}.`,
      path: `/jobs/${country}`,
      jobCount: jobs.length,
      placeName: countryValue,
    }),
    buildBreadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Jobs', href: '/jobs' },
      { name: countryValue, href: `/jobs/${country}` },
    ]),
  ]

  return (
    <>
      <MultiJsonLd schemas={schemas} />
      <DestinationJobsView
        heading={`Nursing Jobs in ${countryValue}`}
        subheading={`${jobs.length} open position${jobs.length !== 1 ? 's' : ''} from approved healthcare recruiters and hospitals.`}
        breadcrumbItems={[
          { name: 'Home', href: '/' },
          { name: 'Jobs', href: '/jobs' },
          { name: countryValue, href: `/jobs/${country}` },
        ]}
        jobs={jobs}
        emptyMessage={`No open nursing jobs in ${countryValue} right now — check back soon.`}
      />
    </>
  )
}
