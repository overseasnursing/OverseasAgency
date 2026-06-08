import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, BookOpen } from 'lucide-react'
import {
  getMockTestCategoryData,
  getAllMockTestCategorySlugs,
  type PublicTest,
} from '@/lib/data/getMockTestData'
import { CategoryPageClient } from './_components/CategoryPageClient'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import {
  buildWebPageSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildArticleSchema,
  buildOrganizationSchema,
  buildLearningResourceSchema,
  buildQuizItemListSchema,
  buildGuidePersonSchema,
  buildMockTestReviewsSchema,
} from '@/lib/seo/schemas'
import { getMockTestContent } from '@/lib/data/getMockTestContent'
import { ExamGuideContent } from './_components/ExamGuideContent'
import { AutoInternalLinks } from './_components/AutoInternalLinks'
import { DestinationAgencyCards } from './_components/DestinationAgencyCards'
import { MockTestReviews } from './_components/MockTestReviews'
import { ReviewFormInline } from './_components/ReviewFormInline'
import { getLocationLinks, getDestinationByCountrySlug } from '@/lib/data/mockTestMappings'
import { createAdminClient } from '@/lib/supabase/admin'

export const revalidate = 3600

type PageProps = { params: Promise<{ locationSlug: string; categorySlug: string }> }

export async function generateStaticParams() {
  const pairs = await getAllMockTestCategorySlugs()
  return pairs.map(p => ({ locationSlug: p.locationSlug, categorySlug: p.categorySlug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationSlug, categorySlug } = await params
  const data = await getMockTestCategoryData(locationSlug, categorySlug)
  if (!data) return {}
  const { category, location } = data
  const title = category.seo_title || `${category.name} — Free Mock Tests | OverseasNursing`
  const desc  = category.seo_description || category.description ||
    `Practice ${category.name} with free timed mock tests. Part of ${location.name} licensing preparation.`
  return {
    title,
    description: desc,
    alternates: { canonical: `https://overseasnursing.com/mock-tests/${locationSlug}/${categorySlug}` },
    openGraph: { title, description: desc, url: `https://overseasnursing.com/mock-tests/${locationSlug}/${categorySlug}` },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { locationSlug, categorySlug } = await params
  const data = await getMockTestCategoryData(locationSlug, categorySlug)
  if (!data) notFound()
  const { location, category, tests, siblingCategories } = data

  const avgDuration = tests.length
    ? Math.round(tests.reduce((s, t) => s + t.duration_minutes, 0) / tests.length)
    : 0
  const avgPass = tests.length
    ? Math.round(tests.reduce((s, t) => s + t.passing_percentage, 0) / tests.length)
    : 0

  const pageTitle = category.seo_title || `${category.name} — Free Mock Tests | OverseasNursing`
  const pageDesc  = category.seo_description || category.description ||
    `Practice ${category.name} with free timed mock tests. Part of ${location.name} licensing preparation.`

  const content = await getMockTestContent(category.id, categorySlug)

  const pagePath = `/mock-tests/${locationSlug}/${categorySlug}`

  // Fetch reviews for schema + display
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data: reviewRows, error: reviewErr } = await db
    .from('mock_test_reviews')
    .select('reviewer_name, reviewer_country, rating, difficulty, review_title, review_text, created_at')
    .eq('category_id', category.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(20)

  // If v2 columns are missing, fall back to base columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let reviews: any[]
  if (reviewErr || !reviewRows) {
    const { data: fb } = await db
      .from('mock_test_reviews')
      .select('reviewer_name, rating, difficulty, review_text, created_at')
      .eq('category_id', category.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(20)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reviews = (fb ?? []).map((r: any) => ({ ...r, reviewer_country: null, review_title: null }))
  } else {
    reviews = reviewRows
  }
  const reviewCount = reviews.length
  const avgRating = reviewCount > 0
    ? Math.round((reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviewCount) * 10) / 10
    : 0

  // Build all schemas; nulls are filtered at the end
  const rawSchemas: (Record<string, unknown> | null)[] = [
    // 1. WebPage
    buildWebPageSchema({ title: pageTitle, description: pageDesc, path: pagePath }),

    // 2. BreadcrumbList
    buildBreadcrumbSchema([
      { name: 'Home',       href: '/' },
      { name: 'Mock Tests', href: '/mock-tests' },
      { name: location.name, href: `/mock-tests/${locationSlug}` },
      { name: category.name, href: pagePath },
    ]),

    // 3. Organization
    buildOrganizationSchema(),

    // 4. LearningResource
    buildLearningResourceSchema({
      name:        pageTitle,
      description: pageDesc,
      path:        pagePath,
      examName:    category.name,
      testCount:   tests.length,
    }),

    // 5. ItemList of Quiz items — one per test, auto-generated
    tests.length > 0
      ? buildQuizItemListSchema(tests, pagePath, category.name)
      : null,

    // 6. Article — only when guide content exists
    content
      ? buildArticleSchema({
          title:         pageTitle,
          description:   pageDesc,
          path:          pagePath,
          publishedDate: content.meta.publishedDate ?? '2025-01-01',
          modifiedDate:  content.meta.modifiedDate,
        })
      : null,

    // 7. FAQPage — only when FAQs exist in guide
    content?.meta.faqs?.length
      ? buildFaqSchema(content.meta.faqs.map(f => ({ question: f.q, answer: f.a })))
      : null,

    // 8. Person (Author) — only when guide has author name
    content?.meta.author?.name
      ? buildGuidePersonSchema({
          name:        content.meta.author.name,
          description: content.meta.author.credentials ?? '',
          linkedin:    content.meta.author.linkedin,
        })
      : null,

    // 9. Person (Reviewer) — only when guide has reviewer name
    content?.meta.reviewer?.name
      ? buildGuidePersonSchema({
          name:        content.meta.reviewer.name,
          description: content.meta.reviewer.experience ?? '',
          jobTitle:    content.meta.reviewer.title,
        })
      : null,

    // 10. AggregateRating + Review items — only when reviews exist
    reviewCount > 0
      ? buildMockTestReviewsSchema({
          examName:    category.name,
          path:        pagePath,
          avgRating,
          reviewCount,
          reviews: reviews.map((r: any) => ({
            reviewerName:    r.reviewer_name,
            reviewerCountry: r.reviewer_country ?? null,
            rating:          r.rating,
            title:           r.review_title    ?? null,
            text:            r.review_text     ?? null,
            date:            r.created_at?.split('T')[0] ?? '',
          })),
        })
      : null,
  ]

  const schemas = rawSchemas.filter((s): s is Record<string, unknown> => s != null)

  return (
    <div className="bg-surface-page min-h-screen">
      <MultiJsonLd schemas={schemas} />

      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12.5px] text-slate-400 mb-5 flex-wrap">
            <Link href="/mock-tests" className="hover:text-primary transition-colors font-medium">Mock Tests</Link>
            <ChevronRight size={12} />
            <Link href={`/mock-tests/${locationSlug}`} className="hover:text-primary transition-colors">{location.name}</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 font-medium">{category.name}</span>
          </nav>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <BookOpen size={22} className="text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-title-sm font-bold text-slate-900">{category.name}</h1>

              {/* Aggregate rating — shown only when reviews exist */}
              {reviewCount > 0 && (
                <a
                  href="#candidate-reviews"
                  className="inline-flex items-center gap-2 mt-2 group"
                >
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(avgRating) ? '#F59E0B' : '#E2E8F0'}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-[14px] font-bold text-slate-800">{avgRating.toFixed(1)}</span>
                  <span className="text-[13px] text-slate-500 group-hover:text-primary transition-colors">
                    ({reviewCount} Review{reviewCount !== 1 ? 's' : ''})
                  </span>
                </a>
              )}

              {category.description && (
                <p className="text-[14px] text-slate-500 mt-1.5 max-w-[680px] leading-relaxed">{category.description}</p>
              )}
              {/* Stats strip */}
              {tests.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {[
                    { label: 'Mock Tests', value: tests.length },
                    { label: 'Avg Duration', value: avgDuration > 0 ? `${avgDuration} min` : '—' },
                    { label: 'Avg Pass %', value: avgPass > 0 ? `${avgPass}%` : '—' },
                  ].map(s => (
                    <div key={s.label} className="bg-surface-section border border-slate-200 rounded-xl px-4 py-2 text-center min-w-[90px]">
                      <p className="text-[16px] font-bold text-primary">{s.value}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8">

        {/* SEO intro */}
        {category.seo_description && (
          <p className="text-[13.5px] text-slate-500 mb-7 max-w-[720px] leading-relaxed">{category.seo_description}</p>
        )}

        {/* Interactive section — passing criteria + test cards */}
        <CategoryPageClient
          location={{ id: location.id, name: location.name, slug: location.slug }}
          category={{ id: category.id, name: category.name, slug: category.slug, description: category.description }}
          tests={tests as PublicTest[]}
          locationSlug={locationSlug}
          categorySlug={categorySlug}
          avgRating={avgRating}
          reviewCount={reviewCount}
        />

        {/* Auto-generated internal links — zero manual work, driven by DB + mappings */}
        <AutoInternalLinks
          locationSlug={locationSlug}
          categorySlug={categorySlug}
          siblingCategories={siblingCategories}
          destOverrides={content?.meta.destinationOverrides ?? null}
          destCountrySlug={location.country_slug ?? null}
        />

        {/* SEO guide content — only renders when guide content has been added */}
        {content && (
          <ExamGuideContent content={content} categoryName={category.name} />
        )}

        {/* Nurse reviews for this exam category */}
        <MockTestReviews categoryId={category.id} examName={category.name} />

        {/* Inline review form — lets users review any test without taking the exam */}
        {tests.length > 0 && (
          <ReviewFormInline
            categoryId={category.id}
            tests={tests.map(t => ({ id: t.id, name: t.name }))}
          />
        )}

        {/* Top agencies for the destination country — shown at bottom of page */}
        {(() => {
          const dest = location.country_slug
            ? getDestinationByCountrySlug(location.country_slug)
            : getLocationLinks(locationSlug)
          return dest ? (
            <DestinationAgencyCards
              countryTerms={dest.agencyCountryTerms}
              countryName={dest.countryName}
              countrySlug={dest.countrySlug}
              flagCode={dest.flagCode}
              agencyFilterCountry={dest.agencyFilterCountry}
            />
          ) : null
        })()}
      </div>
    </div>
  )
}
