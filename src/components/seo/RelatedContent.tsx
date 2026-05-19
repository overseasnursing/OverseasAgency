import React from 'react'
import { InternalLinkCluster, type ClusterLink } from './InternalLinkCluster'

// ─── Pre-built cluster types ──────────────────────────────────────────────────

export function RelatedCountriesCluster({ countrySlugs }: { countrySlugs: string[] }) {
  const COUNTRY_META: Record<string, { name: string; tagline: string }> = {
    germany:   { name: 'Germany',         tagline: 'EU Blue Card + long-term PR' },
    uk:        { name: 'United Kingdom',  tagline: 'NHS jobs, fast process' },
    canada:    { name: 'Canada',          tagline: 'Express Entry + PR pathway' },
    australia: { name: 'Australia',       tagline: 'High salary + skilled visa' },
    dubai:     { name: 'Dubai / UAE',     tagline: 'Tax-free, fastest process' },
  }

  const links: ClusterLink[] = countrySlugs
    .map((slug) => {
      const meta = COUNTRY_META[slug]
      if (!meta) return null
      return {
        href: `/country/${slug}`,
        label: meta.name,
        description: meta.tagline,
      }
    })
    .filter(Boolean) as ClusterLink[]

  return <InternalLinkCluster heading="Related Destinations" links={links} columns={2} />
}

export function RelatedPricingCluster({ countrySlugs }: { countrySlugs: string[] }) {
  const COUNTRY_NAMES: Record<string, string> = {
    germany: 'Germany',
    uk: 'UK',
    canada: 'Canada',
    australia: 'Australia',
    dubai: 'Dubai',
  }

  const links: ClusterLink[] = countrySlugs.map((slug) => ({
    href: `/pricing/${slug}`,
    label: `${COUNTRY_NAMES[slug] ?? slug} Migration Costs`,
    description: 'Full fee breakdown with hidden charges',
  }))

  return <InternalLinkCluster heading="Compare Migration Costs" links={links} columns={2} />
}

export function RelatedComparisonsCluster({
  comparisons,
}: {
  comparisons: { slug: string; label: string }[]
}) {
  const links: ClusterLink[] = comparisons.map((c) => ({
    href: `/compare/${c.slug}`,
    label: c.label,
    badge: 'Compare',
  }))

  return <InternalLinkCluster heading="Country Comparisons" links={links} columns={2} />
}

export function RelatedSalariesCluster({ countrySlugs }: { countrySlugs: string[] }) {
  const COUNTRY_NAMES: Record<string, string> = {
    germany: 'Germany',
    uk: 'UK',
    canada: 'Canada',
    australia: 'Australia',
    dubai: 'Dubai',
  }

  const links: ClusterLink[] = countrySlugs.map((slug) => ({
    href: `/salary/${slug}-nurse-salary`,
    label: `${COUNTRY_NAMES[slug] ?? slug} Nurse Salary`,
    description: 'Complete salary guide with INR equivalent',
  }))

  return <InternalLinkCluster heading="Salary Guides" links={links} columns={2} />
}

export function RelatedExamsCluster({
  exams,
}: {
  exams: { slug: string; name: string; countries: string }[]
}) {
  const links: ClusterLink[] = exams.map((e) => ({
    href: `/exam/${e.slug}`,
    label: e.name,
    description: `Required for ${e.countries}`,
    badge: 'Exam',
  }))

  return <InternalLinkCluster heading="Exam Guides" links={links} columns={2} />
}

export function RelatedLocationsCluster({
  locations,
}: {
  locations: { city: string; slug: string }[]
}) {
  const links: ClusterLink[] = locations.map((l) => ({
    href: `/location/${l.slug}`,
    label: `Agencies in ${l.city}`,
  }))

  return <InternalLinkCluster heading="Find Agencies Near You" links={links} columns={3} />
}

// ─── Full content cluster section ─────────────────────────────────────────────

interface ContentClusterConfig {
  relatedCountrySlugs?: string[]
  relatedPricingSlugs?: string[]
  relatedComparisons?: { slug: string; label: string }[]
  relatedSalaries?: string[]
  relatedExams?: { slug: string; name: string; countries: string }[]
  relatedLocations?: { city: string; slug: string }[]
}

export function ContentCluster({
  relatedCountrySlugs,
  relatedPricingSlugs,
  relatedComparisons,
  relatedSalaries,
  relatedExams,
  relatedLocations,
}: ContentClusterConfig) {
  const hasContent =
    (relatedCountrySlugs?.length ?? 0) > 0 ||
    (relatedPricingSlugs?.length ?? 0) > 0 ||
    (relatedComparisons?.length ?? 0) > 0 ||
    (relatedSalaries?.length ?? 0) > 0 ||
    (relatedExams?.length ?? 0) > 0 ||
    (relatedLocations?.length ?? 0) > 0

  if (!hasContent) return null

  return (
    <section
      aria-label="Related content"
      className="border-t border-slate-100 pt-10 flex flex-col gap-8"
    >
      <h2 className="text-[20px] font-bold text-slate-800">Explore More</h2>
      {relatedCountrySlugs && relatedCountrySlugs.length > 0 && (
        <RelatedCountriesCluster countrySlugs={relatedCountrySlugs} />
      )}
      {relatedPricingSlugs && relatedPricingSlugs.length > 0 && (
        <RelatedPricingCluster countrySlugs={relatedPricingSlugs} />
      )}
      {relatedComparisons && relatedComparisons.length > 0 && (
        <RelatedComparisonsCluster comparisons={relatedComparisons} />
      )}
      {relatedSalaries && relatedSalaries.length > 0 && (
        <RelatedSalariesCluster countrySlugs={relatedSalaries} />
      )}
      {relatedExams && relatedExams.length > 0 && (
        <RelatedExamsCluster exams={relatedExams} />
      )}
      {relatedLocations && relatedLocations.length > 0 && (
        <RelatedLocationsCluster locations={relatedLocations} />
      )}
    </section>
  )
}
