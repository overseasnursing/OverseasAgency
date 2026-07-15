import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { buildJobsCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'
import { getActiveJobsByDestination } from '@/lib/db/jobs'
import { normalizeCountry } from '../../[slug]/_data/countryMappings'
import { JOB_COUNTRIES, slugify } from '@/lib/jobConstants'
import { DestinationJobsView } from '../../_components/DestinationJobsView'

export const revalidate = 1800

const COUNTRY_SLUG_TO_VALUE: Record<string, string> = Object.fromEntries(
  JOB_COUNTRIES.map(c => [normalizeCountry(c), c]),
)

interface PageProps {
  params: Promise<{ country: string; city: string }>
}

// No generateStaticParams — cities are free text with no dedicated slug
// column, so these are rendered on first request and cached via ISR
// (revalidate above), rather than pre-listed at build time. Avoids
// generating thin pages for city/country combinations with no real jobs.

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, city } = await params
  const countryValue = COUNTRY_SLUG_TO_VALUE[country]
  if (!countryValue) return {}
  const jobs = await getActiveJobsByDestination({ country: countryValue })
  const match = jobs.find(j => j.city && slugify(j.city) === city)
  if (!match?.city) return {}
  const cityValue = match.city
  const title = `Nursing Jobs in ${cityValue}, ${countryValue}`
  const description = `Browse approved nursing jobs in ${cityValue}, ${countryValue} from verified healthcare recruiters and hospitals.`
  return {
    title,
    description,
    alternates: { canonical: `/jobs/${country}/${city}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://overseasnursing.com/jobs/${country}/${city}`,
    },
  }
}

export default async function JobsByCityPage({ params }: PageProps) {
  const { country, city } = await params
  const countryValue = COUNTRY_SLUG_TO_VALUE[country]
  if (!countryValue) notFound()

  const countryJobs = await getActiveJobsByDestination({ country: countryValue })
  const jobs = countryJobs.filter(j => j.city && slugify(j.city) === city)
  // Below the real-content floor — avoid indexing a thin/empty leaf page.
  if (jobs.length === 0) notFound()

  const cityValue = jobs[0].city as string

  const schemas = [
    buildJobsCollectionPageSchema({
      name: `Nursing Jobs in ${cityValue}, ${countryValue}`,
      description: `Browse approved nursing jobs in ${cityValue}, ${countryValue}.`,
      path: `/jobs/${country}/${city}`,
      jobCount: jobs.length,
      placeName: `${cityValue}, ${countryValue}`,
    }),
    buildBreadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Jobs', href: '/jobs' },
      { name: countryValue, href: `/jobs/${country}` },
      { name: cityValue, href: `/jobs/${country}/${city}` },
    ]),
  ]

  return (
    <>
      <MultiJsonLd schemas={schemas} />
      <DestinationJobsView
        heading={`Nursing Jobs in ${cityValue}, ${countryValue}`}
        subheading={`${jobs.length} open position${jobs.length !== 1 ? 's' : ''} from approved healthcare recruiters and hospitals.`}
        breadcrumbItems={[
          { name: 'Home', href: '/' },
          { name: 'Jobs', href: '/jobs' },
          { name: countryValue, href: `/jobs/${country}` },
          { name: cityValue, href: `/jobs/${country}/${city}` },
        ]}
        jobs={jobs}
        emptyMessage={`No open nursing jobs in ${cityValue} right now.`}
      />
    </>
  )
}
