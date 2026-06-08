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
            ratingValue: (agency.rating ?? 0).toFixed(1),
            bestRating: '5',
            worstRating: '1',
            reviewCount: agency.reviewCount ?? 0,
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

// ─── LearningResource (mock test category page) ───────────────────────────────

export function buildLearningResourceSchema(page: {
  name: string
  description: string
  path: string
  examName: string
  testCount: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: page.name,
    description: page.description,
    url: abs(page.path),
    learningResourceType: ['Practice Problem', 'Quiz'],
    educationalLevel: 'Professional',
    teaches: page.examName,
    inLanguage: 'en',
    isAccessibleForFree: true,
    provider: { '@type': 'Organization', name: 'OverseasNursing', url: BASE_URL },
  }
}

// ─── Quiz ItemList (one item per mock test) ────────────────────────────────────

export function buildQuizItemListSchema(
  tests: Array<{
    name: string
    slug: string
    duration_minutes: number
    total_questions: number
  }>,
  basePath: string,
  categoryName: string,
) {
  if (!tests.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryName} — Mock Test List`,
    numberOfItems: tests.length,
    itemListElement: tests.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': ['Quiz', 'LearningResource'],
        name: t.name,
        url: abs(`${basePath}/${t.slug}`),
        timeRequired: `PT${t.duration_minutes}M`,
        numberOfItems: t.total_questions,
        educationalLevel: 'Professional',
        inLanguage: 'en',
        isAccessibleForFree: true,
        provider: { '@type': 'Organization', name: 'OverseasNursing', url: BASE_URL },
      },
    })),
  }
}

// ─── Person — guide author / reviewer ─────────────────────────────────────────

export function buildGuidePersonSchema(person: {
  name: string
  description: string
  jobTitle?: string
  linkedin?: string
}) {
  if (!person.name) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    description: person.description,
    ...(person.jobTitle  ? { jobTitle: person.jobTitle }           : {}),
    ...(person.linkedin  ? { sameAs:  [person.linkedin] }         : {}),
    worksFor: { '@type': 'Organization', name: 'OverseasNursing', url: BASE_URL },
  }
}

// ─── Mock-test reviews (AggregateRating + Review items for exam category pages) ─

export function buildMockTestReviewsSchema(data: {
  examName:    string
  path:        string
  avgRating:   number
  reviewCount: number
  reviews: Array<{
    reviewerName:    string
    reviewerCountry: string | null
    rating:          number
    title:           string | null
    text:            string | null
    date:            string
  }>
}): Record<string, unknown> | null {
  if (data.reviewCount < 1) return null

  // Individual Review items — eligible for any count; include title + body + author + date
  const reviewItems = data.reviews
    .slice(0, 10)
    .map(r => ({
      '@type':       'Review',
      name:          r.title ?? undefined,
      author: {
        '@type': 'Person',
        name:    r.reviewerName,
        ...(r.reviewerCountry && {
          address: { '@type': 'PostalAddress', addressCountry: r.reviewerCountry },
        }),
      },
      reviewRating: {
        '@type':      'Rating',
        ratingValue:  r.rating,
        bestRating:   5,
        worstRating:  1,
      },
      reviewBody:    r.text ?? undefined,
      datePublished: r.date,
    }))

  // AggregateRating only when ≥ 3 reviews — avoids misleading single-review averages
  const aggregate = data.reviewCount >= 3
    ? {
        aggregateRating: {
          '@type':      'AggregateRating',
          ratingValue:  data.avgRating.toFixed(1),
          reviewCount:  data.reviewCount,
          bestRating:   '5',
          worstRating:  '1',
        },
      }
    : {}

  return {
    '@context': 'https://schema.org',
    '@type':    'Course',
    name:       data.examName,
    url:        abs(data.path),
    ...aggregate,
    ...(reviewItems.length > 0 && { review: reviewItems }),
  }
}

// ─── Agency (full schema for agency detail pages) ─────────────────────────────

export function buildAgencySchema(agency: {
  name: string
  slug: string
  description?: string
  website?: string
  telephone?: string
  email?: string
  streetAddress?: string
  city?: string
  state?: string
  rating?: number
  reviewCount?: number
  pricingIsFree?: boolean
  minCost?: number
  maxCost?: number
  meaLicenseNo?: string
  meaLicenseExpiry?: string
  countries?: string[]
}) {
  const priceRange = (() => {
    if (agency.pricingIsFree) return 'Free'
    if (!agency.minCost && !agency.maxCost) return undefined
    const minL = agency.minCost ? (agency.minCost / 100000).toFixed(1) : null
    const maxL = agency.maxCost ? (agency.maxCost / 100000).toFixed(1) : null
    if (minL && maxL) return `INR ${agency.minCost} - INR ${agency.maxCost}`
    return minL ? `INR ${agency.minCost}` : `INR ${agency.maxCost}`
  })()

  const agencyId = `${BASE_URL}/agency/${agency.slug}#agency`
  const pageUrl  = `${BASE_URL}/agency/${agency.slug}`

  const medicalBusiness = {
    '@type': 'MedicalBusiness',
    '@id': agencyId,
    name: agency.name,
    url: agency.website ?? pageUrl,
    ...(agency.description && { description: agency.description }),
    ...(agency.telephone && { telephone: agency.telephone }),
    ...(agency.email && { email: agency.email }),
    ...(priceRange && { priceRange }),
    ...((agency.city || agency.streetAddress) && {
      address: {
        '@type': 'PostalAddress',
        ...(agency.streetAddress && { streetAddress: agency.streetAddress }),
        ...(agency.city && { addressLocality: agency.city }),
        ...(agency.state && { addressRegion: agency.state }),
        addressCountry: 'IN',
      },
    }),
    ...((agency.rating ?? 0) > 0 && (agency.reviewCount ?? 0) > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: (agency.rating ?? 0).toFixed(1),
            reviewCount: agency.reviewCount,
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
    ...(agency.meaLicenseNo && {
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Recruitment License',
        name: 'Ministry of External Affairs (MEA) Overseas Recruitment License',
        value: agency.meaLicenseNo,
        ...(agency.meaLicenseExpiry && { validUntil: agency.meaLicenseExpiry }),
        recognizedBy: {
          '@type': 'GovernmentOrganization',
          name: 'Ministry of External Affairs, Government of India',
          url: 'https://epoe.mea.gov.in',
        },
      },
    }),
    ...((agency.countries ?? []).length > 0 && {
      areaServed: (agency.countries ?? []).map(c => ({ '@type': 'Country', name: c })),
    }),
    serviceType: 'Overseas Nursing Recruitment',
  }

  // ItemPage wraps MedicalBusiness as mainEntity — Google's recommended directory architecture
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    '@id': pageUrl,
    url: pageUrl,
    name: `${agency.name} — Reviews, Fees & Verification`,
    description: agency.description,
    mainEntity: medicalBusiness,
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
