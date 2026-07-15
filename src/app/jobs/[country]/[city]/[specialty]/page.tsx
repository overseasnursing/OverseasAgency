import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { buildJobsCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'
import { getActiveJobsByDestination } from '@/lib/db/jobs'
import { normalizeCountry } from '../../../[slug]/_data/countryMappings'
import { JOB_COUNTRIES, slugify } from '@/lib/jobConstants'
import { DestinationJobsView } from '../../../_components/DestinationJobsView'

export const revalidate = 1800

const COUNTRY_SLUG_TO_VALUE: Record<string, string> = Object.fromEntries(
  JOB_COUNTRIES.map(c => [normalizeCountry(c), c]),
)

interface PageProps {
  params: Promise<{ country: string; city: string; specialty: string }>
}

// No generateStaticParams — same reasoning as [city]: rendered on first
// request, cached via ISR.
//
// KNOWN GAP: `jobs` has no dedicated specialty/nursing-discipline column.
// This level filters on `job_type` (the field the posting forms actually
// populate, e.g. "Full Time" / "ICU Nurse" — whatever admins/agencies type)
// as the closest existing categorical field, so the route can exist without
// a schema change this phase. A real `specialty` column is a clean future
// addition — this level should be revisited once one exists.
//
// cache()-wrapped (Phase 9) — generateMetadata() and the page component
// both call this with identical arguments; without this, the underlying
// getActiveJobsByDestination call (already cached) still meant repeating
// the city/job_type filtering pass twice per request.
const findJobs = cache(async (country: string, city: string, specialty: string) => {
  const countryValue = COUNTRY_SLUG_TO_VALUE[country]
  if (!countryValue) return { countryValue: null, cityValue: null, jobTypeValue: null, jobs: [] }
  const countryJobs = await getActiveJobsByDestination({ country: countryValue })
  const cityJobs = countryJobs.filter(j => j.city && slugify(j.city) === city)
  const jobs = cityJobs.filter(j => slugify(j.job_type) === specialty)
  return {
    countryValue,
    cityValue: cityJobs[0]?.city ?? null,
    jobTypeValue: jobs[0]?.job_type ?? null,
    jobs,
  }
})

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, city, specialty } = await params
  const { countryValue, cityValue, jobTypeValue } = await findJobs(country, city, specialty)
  if (!countryValue || !cityValue || !jobTypeValue) return {}
  const title = `${jobTypeValue} Nursing Jobs in ${cityValue}, ${countryValue}`
  const description = `Browse approved ${jobTypeValue.toLowerCase()} nursing jobs in ${cityValue}, ${countryValue}.`
  return {
    title,
    description,
    alternates: { canonical: `/jobs/${country}/${city}/${specialty}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://overseasnursing.com/jobs/${country}/${city}/${specialty}`,
    },
  }
}

export default async function JobsBySpecialtyPage({ params }: PageProps) {
  const { country, city, specialty } = await params
  const { countryValue, cityValue, jobTypeValue, jobs } = await findJobs(country, city, specialty)
  if (!countryValue || !cityValue || !jobTypeValue || jobs.length === 0) notFound()

  const schemas = [
    buildJobsCollectionPageSchema({
      name: `${jobTypeValue} Nursing Jobs in ${cityValue}, ${countryValue}`,
      description: `Browse approved ${jobTypeValue.toLowerCase()} nursing jobs in ${cityValue}, ${countryValue}.`,
      path: `/jobs/${country}/${city}/${specialty}`,
      jobCount: jobs.length,
      placeName: `${cityValue}, ${countryValue}`,
    }),
    buildBreadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Jobs', href: '/jobs' },
      { name: countryValue, href: `/jobs/${country}` },
      { name: cityValue, href: `/jobs/${country}/${city}` },
      { name: jobTypeValue, href: `/jobs/${country}/${city}/${specialty}` },
    ]),
  ]

  return (
    <>
      <MultiJsonLd schemas={schemas} />
      <DestinationJobsView
        heading={`${jobTypeValue} Nursing Jobs in ${cityValue}, ${countryValue}`}
        subheading={`${jobs.length} open position${jobs.length !== 1 ? 's' : ''} from approved healthcare recruiters and hospitals.`}
        breadcrumbItems={[
          { name: 'Home', href: '/' },
          { name: 'Jobs', href: '/jobs' },
          { name: countryValue, href: `/jobs/${country}` },
          { name: cityValue, href: `/jobs/${country}/${city}` },
          { name: jobTypeValue, href: `/jobs/${country}/${city}/${specialty}` },
        ]}
        jobs={jobs}
        emptyMessage={`No open ${jobTypeValue.toLowerCase()} nursing jobs in ${cityValue} right now.`}
      />
    </>
  )
}
