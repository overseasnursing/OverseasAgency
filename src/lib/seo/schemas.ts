const BASE_URL = 'https://overseasnursing.com'
const SITE_NAME = 'OverseasNursing.com'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.svg`

function abs(path: string): string {
  return path.startsWith('http') ? path : `${BASE_URL}${path}`
}

// Converts YYYY-MM-DD to YYYY-MM-DDTHH:mm:ssZ so schema.org validators
// accept it as a valid ISO 8601 datetime with timezone.
function toSchemaDate(date: string): string {
  if (date.includes('T')) return date
  return `${date}T00:00:00Z`
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
  '@type':       'Organization',
  '@id':         `${BASE_URL}#organization`,
  name:          'OverseasNursing',
  alternateName: 'OverseasNursing.com',
  url:           BASE_URL,
  // PNG required — Google does not index SVG for Organization logo rich results
  logo: {
    '@type':    'ImageObject',
    url:        `${BASE_URL}/logo.png`,
    contentUrl: `${BASE_URL}/logo.png`,
    width:      1312,
    height:     218,
  },
  description:
    'OverseasNursing is the independent comparison and review platform for Indian nurses migrating to Germany, UK, Australia, Canada, and Dubai. Real nurse reviews, transparent agency pricing, scam alerts, and expert exam guides.',
  foundingDate: '2024',
  contactPoint: {
    '@type':           'ContactPoint',
    contactType:       'customer support',
    email:             'hello@overseasnursing.com',
    availableLanguage: ['English'],
  },
  sameAs: ['https://twitter.com/overseasnursing', 'https://instagram.com/overseasnursing'],
  knowsAbout: [
    'Overseas nursing migration',
    'Indian nurse visa',
    'OET exam preparation',
    'NCLEX-RN exam',
    'DHA exam preparation',
    'Germany nursing migration',
    'UK NMC registration',
    'Australia AHPRA registration',
    'Canada nursing migration',
    'Nursing agency reviews',
    'Migration agency scams',
  ],
  // Destination countries the platform covers — not the nurses' country of origin
  areaServed: [
    { '@type': 'Country', name: 'Germany' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'Australia' },
    { '@type': 'Country', name: 'Canada' },
    { '@type': 'Country', name: 'United Arab Emirates' },
  ],
  audience: {
    '@type':      'Audience',
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
    image: DEFAULT_OG_IMAGE,
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
      image: DEFAULT_OG_IMAGE,
    },
  }
}

// ─── Article / TechArticle ────────────────────────────────────────────────────

export function buildArticleSchema(article: {
  title: string
  description: string
  path: string
  publishedDate?: string
  modifiedDate?: string
  imageUrl?: string
  type?: 'Article' | 'TechArticle'
  about?: string
}) {
  const published = toSchemaDate(article.publishedDate ?? '2025-01-01')
  const modified  = toSchemaDate(article.modifiedDate ?? article.publishedDate ?? '2025-01-01')

  return {
    '@context': 'https://schema.org',
    '@type': article.type ?? 'Article',
    headline: article.title,
    description: article.description,
    url: abs(article.path),
    datePublished: published,
    dateModified:  modified,
    image: article.imageUrl ? abs(article.imageUrl) : DEFAULT_OG_IMAGE,
    ...(article.about && {
      about: { '@type': 'DefinedTerm', name: article.about },
    }),
    inLanguage: 'en',
    author: { '@type': 'Organization', name: SITE_NAME, url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png`, width: 1312, height: 218 },
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Registered nurses preparing for overseas licensing exams',
    },
  }
}

// ─── WebPage ───────────────────────────────────────────────────────────────────

export function buildWebPageSchema(page: {
  title: string
  description: string
  path: string
  dateModified?: string
  datePublished?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: abs(page.path),
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: BASE_URL },
    ...(page.dateModified  && { dateModified:  toSchemaDate(page.dateModified) }),
    ...(page.datePublished && { datePublished: toSchemaDate(page.datePublished) }),
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

// ─── Exam category Course schema (replaces separate LearningResource + Course) ─
// Single authoritative Course entity — always emitted, AggregateRating added when ≥3 reviews

export function buildExamCategorySchema(page: {
  name:        string
  description: string
  path:        string
  examName:    string
  tests: Array<{
    name:             string
    slug:             string
    duration_minutes: number
    total_questions:  number
    difficulty:       string
  }>
  avgRating?:   number
  reviewCount?: number
  reviews?: Array<{
    reviewerName:    string
    reviewerCountry: string | null
    rating:          number
    title:           string | null
    text:            string | null
    date:            string
  }>
}) {
  const url = abs(page.path)

  // AggregateRating only when ≥3 reviews (avoids misleading averages)
  const aggregate = (page.reviewCount ?? 0) >= 3 && (page.avgRating ?? 0) > 0
    ? {
        aggregateRating: {
          '@type':      'AggregateRating',
          ratingValue:  (page.avgRating ?? 0).toFixed(1),
          reviewCount:  page.reviewCount,
          bestRating:   '5',
          worstRating:  '1',
        },
      }
    : {}

  // Individual Review items (up to 10) when any reviews exist
  const reviewItems = (page.reviews ?? []).slice(0, 10).map(r => ({
    '@type':       'Review',
    ...(r.title && { name: r.title }),
    author: {
      '@type': 'Person',
      name:    r.reviewerName,
      ...(r.reviewerCountry && {
        address: { '@type': 'PostalAddress', addressCountry: r.reviewerCountry },
      }),
    },
    reviewRating: {
      '@type':     'Rating',
      ratingValue: r.rating,
      bestRating:  5,
      worstRating: 1,
    },
    ...(r.text && { reviewBody: r.text }),
    datePublished: r.date,
  }))

  // hasCourseInstance — one per test variant
  const instances = page.tests.map(t => ({
    '@type':     'CourseInstance',
    name:        t.name,
    url:         abs(`${page.path}/${t.slug}`),
    courseMode:  'online',
    duration:    `PT${t.duration_minutes}M`,
    courseWorkload: `${t.total_questions} questions`,
  }))

  return {
    '@context': 'https://schema.org',
    '@type':    'Course',
    name:       page.name,
    description: page.description,
    url,
    '@id':      `${url}#course`,
    about: {
      '@type': 'DefinedTerm',
      name:    page.examName,
    },
    educationalLevel:    'Professional',
    teaches:             page.examName,
    learningResourceType: 'Practice Test',
    inLanguage:          'en',
    isAccessibleForFree: true,
    numberOfItems:       page.tests.length,
    provider: { '@type': 'Organization', name: 'OverseasNursing', url: BASE_URL },
    audience: {
      '@type':       'EducationalAudience',
      educationalRole: 'student',
      audienceType:  'Registered nurses preparing for overseas licensing exams',
    },
    ...(instances.length > 0 && { hasCourseInstance: instances }),
    ...aggregate,
    ...(reviewItems.length > 0 && { review: reviewItems }),
  }
}

// ─── LearningResource (kept for non-exam pages that still use it) ─────────────

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

// ─── Product schema for mock test category pages ─────────────────────────────
// Google deprecated the Quiz rich result; Product + AggregateRating is the
// reliable path to star ratings in search results for a free digital product.

export function buildMockTestProductSchema(page: {
  name:         string
  description:  string
  path:         string
  testCount:    number
  imageUrl?:    string
  avgRating?:   number
  reviewCount?: number
  reviews?: Array<{
    reviewerName:    string
    reviewerCountry: string | null
    rating:          number
    title:           string | null
    text:            string | null
    date:            string
  }>
}) {
  const url = abs(page.path)

  // Include AggregateRating from the first review — Google's Product rich result
  // requires at least 1 review + visible reviews on the page.
  const aggregate = (page.reviewCount ?? 0) >= 1 && (page.avgRating ?? 0) > 0
    ? {
        aggregateRating: {
          '@type':      'AggregateRating',
          ratingValue:  (page.avgRating ?? 0).toFixed(1),
          reviewCount:  page.reviewCount,
          bestRating:   '5',
          worstRating:  '1',
        },
      }
    : {}

  // Stable @id for this Product entity — lets nested reviews back-reference it explicitly
  const productId = `${url}#product`

  const reviewItems = (page.reviews ?? []).slice(0, 5).map(r => ({
    '@type': 'Review',
    ...(r.title && { name: r.title }),
    // itemReviewed links each review back to the Product entity unambiguously —
    // Google requires this to associate the review text with the star rating
    itemReviewed: { '@id': productId },
    author: {
      '@type': 'Person',
      name:    r.reviewerName,
      ...(r.reviewerCountry && {
        address: { '@type': 'PostalAddress', addressCountry: r.reviewerCountry },
      }),
    },
    reviewRating: {
      '@type':     'Rating',
      ratingValue: r.rating,
      bestRating:  5,
      worstRating: 1,
    },
    ...(r.text && { reviewBody: r.text }),
    datePublished: r.date,
  }))

  return {
    '@context': 'https://schema.org',
    '@type':    'Product',
    '@id':      productId,
    name:       page.name,
    description: page.description,
    url,
    ...(page.imageUrl && { image: abs(page.imageUrl) }),
    brand: {
      '@type': 'Brand',
      name:    'OverseasNursing',
    },
    offers: {
      '@type':        'Offer',
      price:          '0',
      priceCurrency:  'INR',
      availability:   'https://schema.org/InStock',
      url,
      priceSpecification: {
        '@type':        'UnitPriceSpecification',
        price:          0,
        priceCurrency:  'INR',
      },
    },
    ...aggregate,
    ...(reviewItems.length > 0 && { review: reviewItems }),
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

// ─── buildMockTestReviewsSchema — deprecated alias, use buildExamCategorySchema ─
// Kept temporarily so old call sites don't break during migration
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
  return buildExamCategorySchema({
    name:        data.examName,
    description: '',
    path:        data.path,
    examName:    data.examName,
    tests:       [],
    avgRating:   data.avgRating,
    reviewCount: data.reviewCount,
    reviews:     data.reviews,
  })
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
  postalCode?: string
  logoUrl?: string
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
    image: agency.logoUrl ? abs(agency.logoUrl) : DEFAULT_OG_IMAGE,
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
        ...(agency.postalCode && { postalCode: agency.postalCode }),
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

// ─── CollectionPage (state + city location directory pages) ──────────────────

export function buildCollectionPageSchema(page: {
  name: string
  description: string
  path: string
  locationName: string
  locationRegion?: string
  agencyCount: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.name,
    description: page.description,
    url: abs(page.path),
    '@id': `${abs(page.path)}#webpage`,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: BASE_URL },
    about: {
      '@type': 'Place',
      name: page.locationName,
      ...(page.locationRegion && { containedInPlace: { '@type': 'State', name: page.locationRegion } }),
      address: { '@type': 'PostalAddress', addressCountry: 'IN' },
    },
    numberOfItems: page.agencyCount,
    inLanguage: 'en-IN',
  }
}

// ─── ItemList (agency listings on location pages) ─────────────────────────────

export function buildAgencyItemListSchema(agencies: Array<{
  name: string
  slug: string
  rating: number
  reviewCount: number
  city: string
  state: string
}>, listName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: agencies.length,
    itemListElement: agencies.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: a.name,
        url: `${BASE_URL}/agency/${a.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: a.city,
          addressRegion: a.state,
          addressCountry: 'IN',
        },
        ...((a.rating > 0 && a.reviewCount > 0) && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: a.rating.toFixed(1),
            reviewCount: a.reviewCount,
            bestRating: '5',
            worstRating: '1',
          },
        }),
      },
    })),
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
    image: DEFAULT_OG_IMAGE,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: entity.ratingValue.toFixed(1),
      bestRating: '5',
      worstRating: '1',
      reviewCount: entity.reviewCount,
    },
  }
}
