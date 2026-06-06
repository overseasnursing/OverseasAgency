import { createAdminClient } from '@/lib/supabase/admin'
import type { AgencyDetail } from '@/types/agencyDetail'
import type { ReviewSnippet } from '@/types/agency'

/* ── Helpers ─────────────────────────────────────────────────────── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

function initials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase()
}

function categoryTitle(cat: string): string {
  const MAP: Record<string, string> = {
    'fee-fraud':       'Fee Fraud Reported',
    'fake-job':        'Fake Job Offer',
    'document-fraud':  'Document Fraud',
    'visa-fraud':      'Visa Fraud',
    'abandonment':     'Case Abandonment',
    'other':           'Misconduct Reported',
  }
  return MAP[cat] ?? 'Complaint Reported'
}

// Parses stored text like "₹4.2L" or "420000" → number in rupees
function parseCost(text: string | null): number {
  if (!text) return 0
  const clean = text.replace(/[₹,\s]/g, '')
  const lakh  = clean.match(/^([\d.]+)[Ll]/)
  if (lakh) return parseFloat(lakh[1]) * 100000
  const n = parseFloat(clean)
  return isNaN(n) ? 0 : n
}

/* ── Main fetcher ────────────────────────────────────────────────── */

export async function getAgencyDetail(slug: string): Promise<AgencyDetail | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data: a, error } = await db
    .from('agencies')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !a) return null

  const [
    { data: branches },
    { data: faqs },
    { data: reviews },
    { data: scamReports },
  ] = await Promise.all([
    db.from('branches')
      .select('*')
      .eq('agency_id', a.id)
      .order('is_head_office', { ascending: false }),
    db.from('agency_faqs')
      .select('*')
      .eq('agency_id', a.id)
      .order('sort_order'),
    db.from('reviews')
      .select('*')
      .eq('agency_id', a.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false }),
    db.from('scam_reports')
      .select('*')
      .eq('agency_id', a.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false }),
  ])

  // Compute live stats from actual approved reviews
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const approvedReviews = (reviews ?? []) as any[]
  const computedRating = approvedReviews.length > 0
    ? Math.round((approvedReviews.reduce((sum, r) => sum + r.overall_rating, 0) / approvedReviews.length) * 10) / 10
    : 0
  const computedReviewCount = approvedReviews.length
  const computedRecommendPercent = approvedReviews.length > 0
    ? Math.round((approvedReviews.filter(r => r.recommends).length / approvedReviews.length) * 100)
    : 0
  // hidden charges: count reviews that reported surprise charges
  const computedHiddenCharges = approvedReviews.filter(r => r.surprise_charges).length

  return {
    id:                   a.id,
    slug:                 a.slug,
    name:                 a.name,
    logo:                 a.logo_url        ?? undefined,
    location:             a.location,
    city:                 a.city,
    state:                a.state,
    established:          a.established     ?? 0,
    trustLevel:           a.trust_level,
    rating:               computedRating,
    reviewCount:          computedReviewCount,
    placementCount:       a.placement_count,
    transparencyScore:    a.transparency_score ?? 0,
    countries:            a.countries        ?? [],
    examsSupported:       a.exams_supported  ?? [],
    hiddenChargesReported:computedHiddenCharges,
    visaSponsorship:      a.visa_sponsorship,
    averageTimelineMonths:a.average_timeline_months ?? '',
    seoTitle:             a.seo_title        ?? undefined,
    seoDescription:       a.seo_description  ?? undefined,
    tagline:              a.tagline          ?? '',
    featured:             a.featured,
    description:          a.description      ?? '',
    email:                a.email            ?? '',
    website:              a.website          ?? undefined,
    whatsapp:             a.whatsapp         ?? '',
    recommendationPercent:computedRecommendPercent,
    visaSuccessRate:      a.visa_success_rate        ?? 0,
    services:             a.services         ?? [],
    languageTrainingOffered: a.language_training_offered ?? false,
    postPlacementSupport:    a.post_placement_support    ?? false,
    relatedSlugs:         a.related_slugs    ?? [],
    // New fields from migration 004
    featuredImage:           a.featured_image_url        ?? undefined,
    meaLicenseNo:            a.mea_license_no            ?? undefined,
    meaLicenseExpiry:        a.mea_license_expiry        ?? undefined,
    meaLicenseUrl:           a.mea_license_url           ?? undefined,
    companyRegistrationNo:   a.company_registration_no   ?? undefined,
    companyRegistrationUrl:  a.company_registration_url  ?? undefined,
    certifications:          a.certifications            ?? [],
    languageInstituteName:   a.language_institute_name   ?? undefined,
    batchType:               a.batch_type                ?? undefined,
    classScheduleNote:       a.class_schedule_note       ?? undefined,
    videoTestimonials:       a.video_testimonials        ?? [],
    socialLinks:             a.social_links              ?? {},
    currentOpeningsUrl:      a.current_openings_url      ?? undefined,
    googlePlaceId:           a.google_place_id            ?? undefined,
    googleRating:            a.google_rating              ?? undefined,
    googleReviewCount:       a.google_review_count        ?? undefined,

    pricing: {
      isFree:               a.pricing_is_free           ?? false,
      freeNote:             a.pricing_free_note         ?? '',
      minCost:              (a.pricing_min_lakhs ?? 0) * 100000,
      maxCost:              (a.pricing_max_lakhs ?? 0) * 100000,
      isApproximate:        a.pricing_is_approximate,
      includes:             a.pricing_includes ?? [],
      excludes:             a.pricing_excludes ?? [],
      installmentAvailable: a.pricing_installment_available,
      installmentNote:      a.pricing_installment_note  ?? undefined,
      disclaimer:           a.pricing_disclaimer        ?? '',
      lastUpdated:          a.pricing_last_updated      ?? '',
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    branches: (branches ?? []).map((b: any) => ({
      id:           b.id,
      name:         b.name,
      address:      b.address,
      city:         b.city,
      state:        b.state,
      country:      b.country,
      phone:        b.phone       ?? '',
      whatsapp:     b.whatsapp    ?? '',
      email:        b.email       ?? '',
      googleMapsUrl:b.google_maps_url ?? undefined,
      isHeadOffice: b.is_head_office,
      openingHours: b.office_hours   ?? undefined,
      latitude:     b.latitude       ?? undefined,
      longitude:    b.longitude      ?? undefined,
    })),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    faqs: (faqs ?? []).map((f: any) => ({
      question: f.question,
      answer:   f.answer,
    })),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reviews: (reviews ?? []).map((r: any) => ({
      id:               r.id,
      authorName:       r.author_name,
      authorFrom:       r.author_from,
      authorInitials:   initials(r.author_name),
      verified:         true,
      date:             formatDate(r.created_at),
      rating:           r.overall_rating,
      title:            r.country_placed ? `Placed in ${r.country_placed}` : 'Verified Review',
      body:             r.review_text,
      countryPlaced:    r.country_placed,
      actualCostPaid:   parseCost(r.actual_cost_paid),
      timelineMonths:   r.timeline_months ?? 0,
      wouldRecommend:   r.recommends,
      visaReceived:     r.placed,
      communicationRating: r.communication_rating ?? r.overall_rating,
      transparencyRating:  r.transparency_rating  ?? r.overall_rating,
      speedRating:         r.speed_rating          ?? r.overall_rating,
      hiddenChargesExperienced: !!r.surprise_charges,
      hiddenChargesAmount: undefined,
      helpful:          r.helpful_count,
    })),

    reviewSnippet: (() => {
      const r = (reviews ?? [])[0]
      const snippet: ReviewSnippet = r ? {
        authorName:     r.author_name,
        authorFrom:     r.author_from ?? '',
        countryPlaced:  r.country_placed ?? '',
        rating:         r.overall_rating,
        text:           r.review_text,
        actualCostPaid: r.actual_cost_paid ?? '—',
        timeline:       r.timeline_months ? `${r.timeline_months} months` : '',
        date:           formatDate(r.created_at),
      } : {
        authorName: 'Verified Nurse', authorFrom: a.city ?? '', countryPlaced: (a.countries ?? [])[0] ?? '',
        rating: computedRating, text: a.tagline ?? '', actualCostPaid: '—', timeline: '', date: '',
      }
      return snippet
    })(),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scamReports: (scamReports ?? []).map((s: any) => ({
      id:            s.id,
      title:         categoryTitle(s.category),
      description:   s.incident_text,
      amountLost:    s.amount_lost    ?? 0,
      countryPromised: s.country_promised,
      date:          formatDate(s.created_at),
      resolved:      s.resolved,
      resolutionNote:s.agency_response_text ?? undefined,
    })),
  }
}
