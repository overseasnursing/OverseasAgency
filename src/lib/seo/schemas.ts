const BASE_URL = 'https://overseasnursing.com'
const SITE_NAME = 'OverseasNursing.com'

function abs(path: string): string {
  return path.startsWith('http') ? path : `${BASE_URL}${path}`
}

// ─── Breadcrumb ────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string
  href: string
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.href),
    })),
  }
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

// ─── Organization ──────────────────────────────────────────────────────────────

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      'OverseasNursing.com is the trusted comparison and review platform for Indian nurses migrating abroad. We cover agency fees, visa processes, exam guides, and verified nurse experiences.',
    sameAs: [],
  }
}

// ─── LocalBusiness (agency) ───────────────────────────────────────────────────

export function buildLocalBusinessSchema(agency: {
  name: string
  slug: string
  description?: string
  rating?: number
  reviewCount?: number
  streetAddress?: string
  city?: string
  phone?: string
  email?: string
  url?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: agency.name,
    url: agency.url ?? `${BASE_URL}/agency/${agency.slug}`,
    ...(agency.description && { description: agency.description }),
    ...(agency.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: agency.rating.toFixed(1),
        bestRating: '5',
        worstRating: '1',
        reviewCount: agency.reviewCount ?? 1,
      },
    }),
    ...(agency.streetAddress && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: agency.streetAddress,
        addressLocality: agency.city ?? 'Kerala',
        addressRegion: 'KL',
        addressCountry: 'IN',
      },
    }),
    ...(agency.phone && { telephone: agency.phone }),
    ...(agency.email && { email: agency.email }),
  }
}

// ─── Review ────────────────────────────────────────────────────────────────────

export function buildReviewSchema(review: {
  authorName: string
  rating: number
  title: string
  body: string
  date: string
  agencyName: string
  agencySlug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: { '@type': 'Person', name: review.authorName },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    name: review.title,
    reviewBody: review.body,
    datePublished: review.date,
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: review.agencyName,
      url: `${BASE_URL}/agency/${review.agencySlug}`,
    },
  }
}

// ─── Article ───────────────────────────────────────────────────────────────────

export function buildArticleSchema(article: {
  title: string
  description: string
  path: string
  publishedDate?: string
  modifiedDate?: string
  imageUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: abs(article.path),
    datePublished: article.publishedDate ?? '2025-01-01',
    dateModified: article.modifiedDate ?? article.publishedDate ?? '2025-01-01',
    ...(article.imageUrl && { image: abs(article.imageUrl) }),
    author: { '@type': 'Organization', name: SITE_NAME, url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
  }
}

// ─── WebPage ───────────────────────────────────────────────────────────────────

export function buildWebPageSchema(page: {
  title: string
  description: string
  path: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: abs(page.path),
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: BASE_URL },
  }
}

// ─── Aggregate review (for agency pages) ─────────────────────────────────────

export function buildAggregateRatingSchema(entity: {
  name: string
  slug: string
  type: 'agency' | 'country'
  ratingValue: number
  reviewCount: number
}) {
  const url =
    entity.type === 'agency'
      ? `${BASE_URL}/agency/${entity.slug}`
      : `${BASE_URL}/country/${entity.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: entity.name,
    url,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: entity.ratingValue.toFixed(1),
      bestRating: '5',
      worstRating: '1',
      reviewCount: entity.reviewCount,
    },
  }
}
