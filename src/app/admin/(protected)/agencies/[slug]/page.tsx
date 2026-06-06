import React from 'react'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import AgencyForm, { type AgencyFullData } from '../_components/AgencyForm'

export const dynamic = 'force-dynamic'

export default async function EditAgencyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data: agency, error } = await db.from('agencies').select('*').eq('slug', slug).single()
  if (error || !agency) notFound()

  const [{ data: branches }, { data: faqs }] = await Promise.all([
    db.from('branches').select('*').eq('agency_id', agency.id).order('is_head_office', { ascending: false }),
    db.from('agency_faqs').select('*').eq('agency_id', agency.id).order('sort_order'),
  ])

  const fullData: AgencyFullData = {
    id:                            agency.id,
    slug:                          agency.slug,
    name:                          agency.name,
    seo_title:                     agency.seo_title                  ?? '',
    seo_description:               agency.seo_description            ?? '',
    tagline:                       agency.tagline                    ?? '',
    description:                   agency.description                ?? '',
    logo_url:                      agency.logo_url                   ?? '',
    featured_image_url:            agency.featured_image_url         ?? '',
    city:                          agency.city,
    state:                         agency.state,
    location:                      agency.location,
    established:                   agency.established                ?? null,
    trust_level:                   agency.trust_level,
    is_active:                     agency.is_active,
    featured:                      agency.featured,
    email:                         agency.email                      ?? '',
    website:                       agency.website                    ?? '',
    whatsapp:                      agency.whatsapp                   ?? '',
    transparency_score:            agency.transparency_score         ?? null,
    placement_count:               agency.placement_count,
    recommendation_percent:        agency.recommendation_percent     ?? null,
    visa_success_rate:             agency.visa_success_rate          ?? null,
    average_timeline_months:       agency.average_timeline_months    ?? '',
    hidden_charges_reported:       agency.hidden_charges_reported,
    pricing_is_free:               agency.pricing_is_free            ?? false,
    pricing_free_note:             agency.pricing_free_note          ?? '',
    pricing_min_lakhs:             agency.pricing_min_lakhs          ?? null,
    pricing_max_lakhs:             agency.pricing_max_lakhs          ?? null,
    pricing_is_approximate:        agency.pricing_is_approximate,
    pricing_includes:              agency.pricing_includes            ?? [],
    pricing_excludes:              agency.pricing_excludes            ?? [],
    pricing_installment_available: agency.pricing_installment_available,
    pricing_installment_note:      agency.pricing_installment_note   ?? '',
    pricing_disclaimer:            agency.pricing_disclaimer         ?? '',
    pricing_last_updated:          agency.pricing_last_updated       ?? '',
    countries:                     agency.countries                  ?? [],
    exams_supported:               agency.exams_supported            ?? [],
    services:                      agency.services                   ?? [],
    visa_sponsorship:              agency.visa_sponsorship,
    language_training_offered:     agency.language_training_offered  ?? false,
    post_placement_support:        agency.post_placement_support     ?? false,
    related_slugs:                 agency.related_slugs              ?? [],
    // Legal & Credentials
    mea_license_no:                agency.mea_license_no             ?? '',
    mea_license_expiry:            agency.mea_license_expiry         ?? '',
    mea_license_url:               agency.mea_license_url            ?? '',
    company_registration_no:       agency.company_registration_no    ?? '',
    company_registration_url:      agency.company_registration_url   ?? '',
    certifications:                agency.certifications             ?? [],
    // Language Academy
    language_institute_name:       agency.language_institute_name    ?? '',
    batch_type:                    agency.batch_type                 ?? '',
    class_schedule_note:           agency.class_schedule_note        ?? '',
    // Media & Social
    video_testimonials:            agency.video_testimonials         ?? [],
    social_links:                  agency.social_links               ?? {},
    // Jobs
    current_openings_url:          agency.current_openings_url       ?? '',
    // Google Reviews fallback
    google_place_id:               agency.google_place_id      ?? '',
    google_rating:                 agency.google_rating        ?? null,
    google_review_count:           agency.google_review_count  ?? null,
    branches:                      branches ?? [],
    faqs:                          faqs     ?? [],
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[12px] text-slate-400 mb-1">
          <a href="/admin/agencies" className="hover:text-primary transition-colors">Agencies</a>
          {' / '}{agency.name}
        </p>
        <h1 className="text-[22px] font-bold text-slate-900">{agency.name}</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          <a href={`/agency/${slug}`} target="_blank" className="text-primary hover:underline">
            View public page ↗
          </a>
        </p>
      </div>

      <AgencyForm initialData={fullData} />
    </div>
  )
}
