import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = 'https://overseasnursing.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/mock-tests/*/attempt*',
          '/mock-tests/*/study*',
        ],
      },
    ],
    sitemap: [
      `${base}/sitemap.xml`,
      `${base}/sitemaps/agencies`,
      `${base}/sitemaps/countries`,
      `${base}/sitemaps/pricing`,
      `${base}/sitemaps/scam-reports`,
      `${base}/sitemaps/locations`,
      `${base}/sitemaps/comparisons`,
      `${base}/sitemaps/salaries`,
      `${base}/sitemaps/exams`,
    ],
  }
}
