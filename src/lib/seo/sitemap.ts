export const BASE_URL = 'https://overseasnursing.com'

export type ChangeFreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

export interface SitemapEntry {
  path: string
  lastModified?: string
  changeFrequency?: ChangeFreq
  priority?: number
}

// ─── XML builders ─────────────────────────────────────────────────────────────

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const today = new Date().toISOString().split('T')[0]

  const urls = entries
    .map((e) => {
      const loc = e.path.startsWith('http') ? e.path : `${BASE_URL}${e.path}`
      const lastmod = e.lastModified ?? today
      const freq = e.changeFrequency ? `\n    <changefreq>${e.changeFrequency}</changefreq>` : ''
      const prio = e.priority !== undefined ? `\n    <priority>${e.priority}</priority>` : ''
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>${freq}${prio}\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
}

export function buildSitemapIndexXml(
  sitemaps: { path: string; lastModified?: string }[]
): string {
  const today = new Date().toISOString().split('T')[0]

  const items = sitemaps
    .map((s) => {
      const loc = s.path.startsWith('http') ? s.path : `${BASE_URL}${s.path}`
      const lastmod = s.lastModified ?? today
      return `  <sitemap>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>`
}

// ─── Entry factories per content type ────────────────────────────────────────

export function agencySitemapEntries(slugs: string[]): SitemapEntry[] {
  return slugs.map((slug) => ({
    path: `/agency/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))
}

export function countrySitemapEntries(slugs: string[]): SitemapEntry[] {
  return slugs.map((slug) => ({
    path: `/country/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))
}

export function pricingSitemapEntries(slugs: string[]): SitemapEntry[] {
  return slugs.map((slug) => ({
    path: `/pricing/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))
}

export function scamReportSitemapEntries(slugs: string[]): SitemapEntry[] {
  return slugs.map((slug) => ({
    path: `/scam-report/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))
}

export function locationSitemapEntries(slugs: string[]): SitemapEntry[] {
  return slugs.map((slug) => ({
    path: `/location/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))
}

export function comparisonSitemapEntries(slugs: string[]): SitemapEntry[] {
  return slugs.map((slug) => ({
    path: `/compare/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))
}

export function salarySitemapEntries(slugs: string[]): SitemapEntry[] {
  return slugs.map((slug) => ({
    path: `/salary/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))
}

export function examSitemapEntries(slugs: string[]): SitemapEntry[] {
  return slugs.map((slug) => ({
    path: `/exam/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))
}

// ─── Static pages ─────────────────────────────────────────────────────────────

export const STATIC_SITEMAP_ENTRIES: SitemapEntry[] = [
  { path: '/', changeFrequency: 'daily', priority: 1.0 },
  { path: '/agencies', changeFrequency: 'daily', priority: 0.9 },
  { path: '/reviews', changeFrequency: 'daily', priority: 0.9 },
  { path: '/scam-reports', changeFrequency: 'daily', priority: 0.9 },
  { path: '/guides', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/reviews/submit', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/scam-reports/submit', changeFrequency: 'yearly', priority: 0.5 },
]

// ─── Sub-sitemap index entries (for robots.txt / sitemap index) ──────────────

export const SUB_SITEMAPS = [
  { path: '/sitemaps/agencies', label: 'Agencies' },
  { path: '/sitemaps/countries', label: 'Countries' },
  { path: '/sitemaps/pricing', label: 'Pricing' },
  { path: '/sitemaps/scam-reports', label: 'Scam Reports' },
  { path: '/sitemaps/locations', label: 'Locations' },
  { path: '/sitemaps/comparisons', label: 'Comparisons' },
  { path: '/sitemaps/salaries', label: 'Salaries' },
  { path: '/sitemaps/exams', label: 'Exams' },
]
