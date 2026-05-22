import type { MetadataRoute } from 'next'
import { getAllCountrySlugs } from '@/lib/data/countries'
import { getAllPricingCountrySlugs } from '@/lib/data/pricing'
import { getAllScamReports } from '@/lib/data/scamReports'
import { getAllAgencySlugs } from '@/lib/data/agencies'
import { getAllLocationCitiesFromDb } from '@/lib/data/getLocationData'
import { getAllComparisonSlugs } from '@/lib/data/comparisons'
import { getAllSalarySlugs } from '@/lib/data/salaries'
import { getAllExamSlugs } from '@/lib/data/exams'
import { getAllGuideSlugs } from '@/lib/data/guides'
import { STATIC_SITEMAP_ENTRIES } from '@/lib/seo/sitemap'

const BASE = 'https://overseasnursing.com'

function abs(path: string): string {
  return `${BASE}${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date()

  const staticPages: MetadataRoute.Sitemap = STATIC_SITEMAP_ENTRIES.map((e) => ({
    url: abs(e.path),
    lastModified: today,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }))

  const countryPages: MetadataRoute.Sitemap = getAllCountrySlugs().map((slug) => ({
    url: abs(`/country/${slug}`),
    lastModified: today,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  const agencyPages: MetadataRoute.Sitemap = getAllAgencySlugs().map((slug) => ({
    url: abs(`/agency/${slug}`),
    lastModified: today,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const pricingPages: MetadataRoute.Sitemap = getAllPricingCountrySlugs().map((slug) => ({
    url: abs(`/pricing/${slug}`),
    lastModified: today,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const locationCities = await getAllLocationCitiesFromDb()
  const locationPages: MetadataRoute.Sitemap = locationCities.map(({ slug }) => ({
    url: abs(`/location/${slug}`),
    lastModified: today,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const comparisonPages: MetadataRoute.Sitemap = getAllComparisonSlugs().map((slug) => ({
    url: abs(`/compare/${slug}`),
    lastModified: today,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const salaryPages: MetadataRoute.Sitemap = getAllSalarySlugs().map((slug) => ({
    url: abs(`/salary/${slug}`),
    lastModified: today,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const examPages: MetadataRoute.Sitemap = getAllExamSlugs().map((slug) => ({
    url: abs(`/exam/${slug}`),
    lastModified: today,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const guidePages: MetadataRoute.Sitemap = getAllGuideSlugs().map((slug) => ({
    url: abs(`/guides/${slug}`),
    lastModified: today,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const scamPages: MetadataRoute.Sitemap = getAllScamReports().map((r) => ({
    url: abs(`/scam-report/${r.slug}`),
    lastModified: new Date(r.reportedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...countryPages,
    ...agencyPages,
    ...pricingPages,
    ...locationPages,
    ...comparisonPages,
    ...salaryPages,
    ...examPages,
    ...guidePages,
    ...scamPages,
  ]
}
