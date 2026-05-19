import type { NextRequest } from 'next/server'
import { getAllAgencies } from '@/lib/data/agencies'
import { getAllCountrySlugs } from '@/lib/data/countries'
import { getAllPricingCountrySlugs } from '@/lib/data/pricing'
import { getAllScamReports } from '@/lib/data/scamReports'
import { getAllLocationSlugs } from '@/lib/data/locations'
import { getAllComparisonSlugs } from '@/lib/data/comparisons'
import { getAllSalarySlugs } from '@/lib/data/salaries'
import { getAllExamSlugs } from '@/lib/data/exams'
import {
  buildSitemapXml,
  agencySitemapEntries,
  countrySitemapEntries,
  pricingSitemapEntries,
  scamReportSitemapEntries,
  locationSitemapEntries,
  comparisonSitemapEntries,
  salarySitemapEntries,
  examSitemapEntries,
} from '@/lib/seo/sitemap'

type SitemapType =
  | 'agencies'
  | 'countries'
  | 'pricing'
  | 'scam-reports'
  | 'locations'
  | 'comparisons'
  | 'salaries'
  | 'exams'

function buildXml(type: string): string | null {
  switch (type as SitemapType) {
    case 'agencies': {
      const slugs = getAllAgencies().map((a) => a.slug)
      return buildSitemapXml(agencySitemapEntries(slugs))
    }
    case 'countries': {
      return buildSitemapXml(countrySitemapEntries(getAllCountrySlugs()))
    }
    case 'pricing': {
      return buildSitemapXml(pricingSitemapEntries(getAllPricingCountrySlugs()))
    }
    case 'scam-reports': {
      const slugs = getAllScamReports().map((r) => r.slug)
      return buildSitemapXml(scamReportSitemapEntries(slugs))
    }
    case 'locations': {
      return buildSitemapXml(locationSitemapEntries(getAllLocationSlugs()))
    }
    case 'comparisons': {
      return buildSitemapXml(comparisonSitemapEntries(getAllComparisonSlugs()))
    }
    case 'salaries': {
      return buildSitemapXml(salarySitemapEntries(getAllSalarySlugs()))
    }
    case 'exams': {
      return buildSitemapXml(examSitemapEntries(getAllExamSlugs()))
    }
    default:
      return null
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params
  const xml = buildXml(type)

  if (!xml) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
