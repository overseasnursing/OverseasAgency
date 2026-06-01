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

const ORGANIZATION_ENTITY = {
  '@type': 'Organization',
  name: 'OverseasNursing',
  alternateName: 'OverseasNursing.com',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/og-image.svg`,
  },
  description:
    'OverseasNursing is the independent comparison and review platform for Indian nurses migrating to Germany, UK, Australia, Canada, and Dubai. Real nurse reviews, transparent agency pricing, scam alerts, and expert exam guides.',
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'hello@overseasnursing.com',
    availableLanguage: ['English'],
  },
  sameAs: ['https://twitter.com/overseasnursing', 'https://instagram.com/overseasnursing'],
  knowsAbout: [
    'Overseas nursing migration',
    'Indian nurse visa',
    'OET exam preparation',
    'NCLEX-RN exam',
    'Germany nursing migration',
    'UK NMC registration',
    'Australia AHPRA registration',
    'Nursing agency reviews',
    'Migration agency scams',
  ],
  areaServed: { '@type': 'Country', name: 'India' },
  audience: {
    '@type': 'Audience',
    audienceType: 'Indian registered nurses planning overseas migration',
  },
}

export function buildOrganizationSchema() {
  return { '@context': 'https://schema.org', ...ORGANIZATION_ENTITY }
}

export function buildAboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About OverseasNursing — Independent Nursing Migration Platform',
    url: `${BASE_URL}/about`,
    description:
      'Learn about OverseasNursing — the independent search and review platform helping Indian nurses safely navigate overseas migration through verified reviews, transparent pricing, and expert guides.',
    inLanguage: 'en-IN',
    isPartOf: { '@type': 'WebSite', name: 'OverseasNursing', url: BASE_URL },
    mainEntity: ORGANIZATION_ENTITY,
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
    ...((agency.rating ?? 0) > 0 && (agency.reviewCount ?? 0) > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: agency.rating.toFixed(1),
            bestRating: '5',
            worstRating: '1',
            reviewCount: agency.reviewCount,
          },
        }
      : {}),
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
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/og-image.svg` },
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

// ─── Person (Author) ──────────────────────────────────────────────────────────

export function buildAuthorPersonSchema(author: {
  slug: string
  fullName: string
  roleTitle: string
  shortBio: string
  profileImage?: string
  expertiseAreas: string[]
  socialLinks?: { platform: string; url: string }[]
  website?: string
}) {
  const sameAs = [
    ...(author.website ? [author.website] : []),
    ...(author.socialLinks?.map((l) => l.url) ?? []),
  ]
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.fullName,
    description: author.shortBio,
    ...(author.profileImage ? { image: abs(author.profileImage) } : {}),
    url: `${BASE_URL}/authors/${author.slug}`,
    jobTitle: author.roleTitle,
    knowsAbout: author.expertiseAreas,
    ...(sameAs.length > 0 && { sameAs }),
    worksFor: { '@type': 'Organization', name: 'OverseasNursing', url: BASE_URL },
  }
}

// ─── Person (Reviewer) ────────────────────────────────────────────────────────

export function buildReviewerPersonSchema(reviewer: {
  slug: string
  fullName: string
  reviewerTitle: string
  shortBio: string
  credentialSummary: string
  profileImage?: string
  expertiseAreas: string[]
  registrationNumber?: string
  issuingBody?: string
  socialLinks?: { platform: string; url: string }[]
}) {
  const sameAs = reviewer.socialLinks?.map((l) => l.url) ?? []
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: reviewer.fullName,
    description: `${reviewer.shortBio} ${reviewer.credentialSummary}`.trim(),
    ...(reviewer.profileImage ? { image: abs(reviewer.profileImage) } : {}),
    url: `${BASE_URL}/reviewers/${reviewer.slug}`,
    jobTitle: reviewer.reviewerTitle,
    knowsAbout: reviewer.expertiseAreas,
    ...(reviewer.registrationNumber && {
      identifier: {
        '@type': 'PropertyValue',
        name: reviewer.issuingBody ?? 'Professional Registration',
        value: reviewer.registrationNumber,
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
    worksFor: { '@type': 'Organization', name: 'OverseasNursing', url: BASE_URL },
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
  if (entity.reviewCount <= 0 || entity.ratingValue <= 0) return null

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
