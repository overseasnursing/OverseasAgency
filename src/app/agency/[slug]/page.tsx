import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LAST_REVIEWED } from '@/lib/data/freshness'

// ISR: revalidate agency pages every hour.
// New reviews/scam reports within that window appear on next regeneration.
export const revalidate = 3600
import { ShieldCheck, Building2, BookOpen, Instagram, Facebook, Youtube, Linkedin, Briefcase, Star, AlertTriangle, ExternalLink } from 'lucide-react'
import { getAgencyDetail } from '@/lib/data/getAgencyDetail'

import { AgencyVote } from './components/AgencyVote'
import { getVoteCountsWithUserVote } from '@/lib/db/agency-votes'
import { AgencyHero } from './components/AgencyHero'
import { TrustSummaryStrip } from './components/TrustSummaryStrip'
import { PricingSection } from './components/PricingSection'
import { ReviewsSection } from './components/ReviewsSection'
import { ScamAlertSection } from './components/ScamAlertSection'
import { TimelineSection } from './components/TimelineSection'
import { BranchesSection } from './components/BranchesSection'
import { FaqAccordion } from './components/FaqAccordion'
import { RelatedAgencies } from './components/RelatedAgencies'
import { ContentAttribution } from '@/components/seo/ContentAttribution'
import { getAttributionProfiles } from '@/lib/admin-profile'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema, buildReviewSchema, buildAgencySchema, buildFaqSchema } from '@/lib/seo/schemas'
import { StickyMobileCTA } from './components/StickyMobileCTA'
import { InquiryForm } from './components/InquiryForm'
import { LocationMap } from './components/LocationMap'
import { SectionNav } from './components/SectionNav'

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const agency = await getAgencyDetail(slug)
  if (!agency) return {}

  const autoTitle = `${agency.name} Reviews, Fees & Scam Reports — OverseasNursing.com`
  const autoDescription = agency.pricing.isFree
    ? `Read verified nurse reviews of ${agency.name}. Free placement agency — no recruitment fee charged. See scam reports, visa success rate, and transparency score before you sign up.`
    : `Read verified nurse reviews of ${agency.name}. See agency fees (₹${agency.pricing.minCost / 100000}–${agency.pricing.maxCost / 100000}L), scam reports, visa success rate, and transparency score before you pay.`
  const title       = agency.seoTitle       || autoTitle
  const description = agency.seoDescription || autoDescription
  const ogImageUrl  = `/api/og?type=agency&title=${encodeURIComponent(agency.name)}&location=${encodeURIComponent(agency.location ?? '')}&rating=${agency.rating > 0 ? agency.rating.toFixed(1) : ''}`

  return {
    title,
    description,
    alternates: {
      canonical: `/agency/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/agency/${slug}`,
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function AgencyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const agency = await getAgencyDetail(slug)
  if (!agency) notFound()

  const attribution = await getAttributionProfiles()

  const votes = await getVoteCountsWithUserVote(agency.id)
  const voteTotal = votes.thumbsUp + votes.thumbsDown
  const liveRecommendPercent = voteTotal === 0 ? 100 : Math.round((votes.thumbsUp / voteTotal) * 100)

  const headOffice = agency.branches.find(b => b.isHeadOffice) ?? agency.branches[0]

  const agencySchemas = [
    buildAgencySchema({
      name: agency.name,
      slug: agency.slug,
      description: agency.description,
      website: agency.website,
      telephone: headOffice?.phone,
      email: agency.email,
      streetAddress: headOffice?.address,
      city: agency.city,
      state: agency.state,
      rating: agency.rating,
      reviewCount: agency.reviewCount,
      pricingIsFree: agency.pricing.isFree,
      minCost: agency.pricing.minCost,
      maxCost: agency.pricing.maxCost,
      meaLicenseNo: agency.meaLicenseNo,
      meaLicenseExpiry: agency.meaLicenseExpiry,
      countries: agency.countries,
    }),
    buildBreadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Agencies', href: '/agencies' },
      { name: agency.name, href: `/agency/${agency.slug}` },
    ]),
    ...(agency.faqs.length > 0 ? [buildFaqSchema(agency.faqs)] : []),
    ...agency.reviews
      .filter(r => r.body)
      .slice(0, 5)
      .map(r => buildReviewSchema({
        authorName: r.authorName,
        rating: r.rating,
        title: r.title,
        body: r.body,
        date: r.date,
        agencyName: agency.name,
        agencySlug: agency.slug,
      })),
  ]

  return (
    <>
      <MultiJsonLd schemas={agencySchemas} />

      <AgencyHero agency={agency} recommendationPercent={liveRecommendPercent} />

      {/* Mobile contact buttons — shown only on mobile in place of TrustSummaryStrip */}
      <div className="lg:hidden bg-white border-b border-slate-100 px-5 py-5">
        <p className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Contact Agency
        </p>
        <div className="flex flex-col gap-2.5">
          <a
            href={`https://wa.me/${agency.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-11 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[14px] font-semibold rounded-xl transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
          <a
            href="#inquiry"
            className="flex items-center justify-center h-11 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors"
          >
            Send an Inquiry
          </a>
          {agency.branches[0]?.phone && (
            <a
              href={`tel:${agency.branches[0].phone}`}
              className="flex items-center justify-center h-11 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13.5px] font-medium rounded-xl transition-colors"
            >
              Call the Office
            </a>
          )}
        </div>
        <div className="border-t border-slate-100 pt-3 mt-1">
          <AgencyVote
            agencyId={agency.id}
            agencySlug={agency.slug}
            initialThumbsUp={votes.thumbsUp}
            initialThumbsDown={votes.thumbsDown}
            initialUserVote={votes.userVote}
            isLoggedIn={votes.isLoggedIn}
          />
        </div>
      </div>

      {/* TrustSummaryStrip — desktop only */}
      <div className="hidden lg:block">
        <TrustSummaryStrip agency={agency} recommendationPercent={liveRecommendPercent} />
      </div>

      {/* ── Sticky section nav ────────────────────────────────────────── */}
      <SectionNav sections={[
        { id: 'about',     label: 'About' },
        { id: 'pricing',   label: 'Pricing' },
        ...(agency.branches.length > 0 ? [{ id: 'offices', label: 'Offices' }] : []),
        ...(agency.branches.length > 0 ? [{ id: 'direction', label: 'Direction' }] : []),
        { id: 'contact',   label: 'Contact' },
        ...(agency.faqs.length > 0    ? [{ id: 'faqs',    label: 'FAQs' }]       : []),
        { id: 'reviews',   label: 'Reviews' },
      ]} />

      {/* Sentinel: SectionNav appears once this scrolls past the navbar */}
      <div id="nav-sentinel" style={{ height: 1, width: '100%', pointerEvents: 'none' }} />

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

          {/* Main content column */}
          <main className="flex-1 min-w-0 flex flex-col gap-12">

            {/* ── 2. About ──────────────────────────────────────────────── */}
            <section id="about" aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-[22px] font-bold text-slate-800 mb-4">
                About {agency.name}
              </h2>
              <p className="text-[15px] text-slate-600 leading-relaxed mb-5 whitespace-pre-wrap">
                {agency.description}
              </p>
              {agency.services.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {agency.services.map((service) => (
                    <span key={service} className="px-3 py-1.5 bg-[#F1F5F9] text-[#334155] text-[13px] font-medium rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {agency.languageTrainingOffered && (
                  <div className="px-3 py-1.5 bg-[#EFF6FF] rounded-xl text-[13px] font-medium text-[#1D4ED8]">
                    Language Training Offered
                  </div>
                )}
                {agency.postPlacementSupport && (
                  <div className="px-3 py-1.5 bg-[#F0FDF4] rounded-xl text-[13px] font-medium text-[#166534]">
                    Post-Placement Support
                  </div>
                )}
              </div>

              {/* Legal & Credentials — inline trust block inside About */}
              {(agency.meaLicenseNo || agency.companyRegistrationNo || (agency.certifications?.length ?? 0) > 0) && (
                <div className="mt-6 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 flex flex-col gap-4">
                  {agency.meaLicenseNo && (
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={16} className="text-[#166534] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11.5px] font-semibold text-[#166534] uppercase tracking-wide mb-0.5">MEA License</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[13.5px] font-medium text-slate-800">{agency.meaLicenseNo}
                            {agency.meaLicenseExpiry && <span className="text-slate-400 font-normal ml-2">· Valid until {agency.meaLicenseExpiry}</span>}
                          </p>
                          {agency.meaLicenseUrl && (
                            <a
                              href={agency.meaLicenseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Verify on government portal"
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#BBF7D0] text-[#166534] text-[11px] font-semibold rounded-full hover:bg-[#DCFCE7] transition-colors flex-shrink-0"
                            >
                              <ExternalLink size={10} />
                              Verify
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {agency.companyRegistrationNo && (
                    <div className="flex items-start gap-3">
                      <Building2 size={16} className="text-[#166534] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11.5px] font-semibold text-[#166534] uppercase tracking-wide mb-0.5">Company Registration</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[13.5px] font-medium text-slate-800">{agency.companyRegistrationNo}</p>
                          {agency.companyRegistrationUrl && (
                            <a
                              href={agency.companyRegistrationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Verify on MCA portal"
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#BBF7D0] text-[#166534] text-[11px] font-semibold rounded-full hover:bg-[#DCFCE7] transition-colors flex-shrink-0"
                            >
                              <ExternalLink size={10} />
                              Verify
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {(agency.certifications?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {agency.certifications.map((cert) => (
                        <span key={cert} className="px-3 py-1 bg-white border border-[#BBF7D0] text-[#166534] text-[12.5px] font-medium rounded-full">
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Language Academy — inline inside About */}
              {agency.languageTrainingOffered && agency.languageInstituteName && (
                <div className="mt-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <BookOpen size={16} className="text-[#1D4ED8] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11.5px] font-semibold text-[#1D4ED8] uppercase tracking-wide mb-0.5">Language Academy</p>
                      <p className="text-[13.5px] font-medium text-slate-800">{agency.languageInstituteName}</p>
                      {agency.batchType && (
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-white border border-[#BFDBFE] text-[#1D4ED8] text-[12px] font-medium rounded-full capitalize">
                          {agency.batchType}
                        </span>
                      )}
                    </div>
                  </div>
                  {agency.classScheduleNote && (
                    <p className="text-[13.5px] text-slate-600 leading-relaxed pl-7 whitespace-pre-wrap">{agency.classScheduleNote}</p>
                  )}
                </div>
              )}
            </section>

            {/* ── 3. Pricing ────────────────────────────────────────────── */}
            <div id="pricing"><PricingSection agency={agency} /></div>

            {/* ── 4 & 5. YouTube Videos + Media & Social Proof ─────────── */}
            {((agency.videoTestimonials?.length ?? 0) > 0 || Object.values(agency.socialLinks ?? {}).some(Boolean)) && (
              <section aria-labelledby="media-heading">
                <h2 id="media-heading" className="text-[22px] font-bold text-slate-800 mb-5">
                  {agency.name} — Nurse Testimonials &amp; Social Proof
                </h2>
                {(agency.videoTestimonials?.length ?? 0) > 0 && (
                  <div className="flex flex-col gap-4 mb-6">
                    {agency.videoTestimonials.slice(0, 2).map((url, i) => {
                      const vid = extractYouTubeId(url)
                      if (!vid) return null
                      return (
                        <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-slate-100">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${vid}?rel=0`}
                            title={`${agency.name} video testimonial ${i + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                            className="w-full h-full border-0"
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
                {Object.values(agency.socialLinks ?? {}).some(Boolean) && (
                  <div className="flex flex-wrap gap-3">
                    {agency.socialLinks?.instagram && (
                      <a href={agency.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-[#E1306C] hover:text-[#E1306C] text-slate-600 text-[13.5px] font-medium rounded-xl transition-colors">
                        <Instagram size={15} /> Instagram
                      </a>
                    )}
                    {agency.socialLinks?.facebook && (
                      <a href={agency.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-[#1877F2] hover:text-[#1877F2] text-slate-600 text-[13.5px] font-medium rounded-xl transition-colors">
                        <Facebook size={15} /> Facebook
                      </a>
                    )}
                    {agency.socialLinks?.youtube && (
                      <a href={agency.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-[#FF0000] hover:text-[#FF0000] text-slate-600 text-[13.5px] font-medium rounded-xl transition-colors">
                        <Youtube size={15} /> YouTube
                      </a>
                    )}
                    {agency.socialLinks?.linkedin && (
                      <a href={agency.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-[#0A66C2] hover:text-[#0A66C2] text-slate-600 text-[13.5px] font-medium rounded-xl transition-colors">
                        <Linkedin size={15} /> LinkedIn
                      </a>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* ── 6. Migration Process Timeline ─────────────────────────── */}
            <TimelineSection agencyName={agency.name} />

            {/* ── 7. Office Locations ───────────────────────────────────── */}
            <div id="offices"><BranchesSection agency={agency} /></div>

            {/* ── 8. Frequently Asked Questions ────────────────────────── */}
            <div id="faqs"><FaqAccordion faqs={agency.faqs} agencyName={agency.name} /></div>

            {/* ── 9. Location Map ───────────────────────────────────────── */}
            {agency.branches.length > 0 && <div id="direction"><LocationMap agency={agency} /></div>}

            {/* ── 10. Send an Inquiry ───────────────────────────────────── */}
            <div id="contact"><InquiryForm agency={agency} /></div>

            {/* ── 10. Nurse Reviews ─────────────────────────────────────── */}
            <ScamAlertSection agency={agency} />
            <div id="reviews"><ReviewsSection agency={agency} /></div>

            {/* ── 11. Compare Similar Agencies ─────────────────────────── */}
            <RelatedAgencies currentId={agency.id} city={agency.city} state={agency.state} />

            <ContentAttribution
              {...(attribution?.author && { author: attribution.author })}
              {...(attribution?.reviewer && { reviewer: attribution.reviewer })}
              lastReviewed={LAST_REVIEWED.agencies}
              sources={[
                { label: 'Ministry of External Affairs (MEA), India — ePOE Overseas Recruiter Register' },
                { label: 'State Nursing Council Registration Databases' },
                { label: 'Protector General of Emigrants (PGE), India — Recruitment Agent Licensing' },
                { label: 'Nurse-submitted reviews and direct agency verification' },
              ]}
              sourceNote="Agency information compiled from public business records, official licensing databases, MEA filings, and nurse-submitted reviews. Pricing and timelines are self-reported and independently verified where possible."
            />
          </main>

          {/* Desktop sidebar */}
          <aside className="hidden lg:flex flex-col gap-6 w-[300px] flex-shrink-0">
            {/* Sticky contact card */}
            <div className="sticky top-24 flex flex-col gap-3">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide mb-4">
                  Contact Agency
                </p>
                <div className="flex flex-col gap-2.5">
                  <a
                    href={`https://wa.me/${agency.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 h-11 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[14px] font-semibold rounded-xl transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                  <a
                    href="#inquiry"
                    className="flex items-center justify-center h-11 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors"
                  >
                    Send an Inquiry
                  </a>
                  <a
                    href={`tel:${agency.branches[0]?.phone}`}
                    className="flex items-center justify-center h-11 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13.5px] font-medium rounded-xl transition-colors"
                  >
                    Call the Office
                  </a>
                </div>
                <div className="border-t border-slate-100 pt-3 mt-1">
                  <AgencyVote
                    agencyId={agency.id}
                    agencySlug={agency.slug}
                    initialThumbsUp={votes.thumbsUp}
                    initialThumbsDown={votes.thumbsDown}
                    initialUserVote={votes.userVote}
                    isLoggedIn={votes.isLoggedIn}
                  />
                </div>
              </div>

              {/* Quick stats */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide mb-4">
                  Quick Facts
                </p>
                <div className="flex flex-col gap-3 text-[13.5px]">
                  {agency.reviewCount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Rating</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={13} fill={i <= Math.round(agency.rating) ? '#F59E0B' : '#E2E8F0'} className={i <= Math.round(agency.rating) ? 'text-[#F59E0B]' : 'text-slate-200'} />
                      ))}
                      <span className="font-semibold text-slate-800 ml-1.5">{agency.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Scam reports</span>
                    <span className={`inline-flex items-center gap-1 font-semibold ${agency.hiddenChargesReported === 0 ? 'text-[#166534]' : 'text-[#B91C1C]'}`}>
                      {agency.hiddenChargesReported > 0 && <AlertTriangle size={12} />}
                      {agency.hiddenChargesReported === 0 ? 'None reported' : agency.hiddenChargesReported}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Visa success rate</span>
                    <span className="font-semibold text-slate-800">{agency.visaSuccessRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Average timeline</span>
                    <span className="font-semibold text-slate-800">{agency.averageTimelineMonths} months</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Nurses placed</span>
                    <span className="font-semibold text-slate-800">{agency.placementCount.toLocaleString()}+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Est.</span>
                    <span className="font-semibold text-slate-800">{agency.established}</span>
                  </div>
                </div>
              </div>

              {/* Current openings */}
              {agency.currentOpeningsUrl && (
                <a
                  href={agency.currentOpeningsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-11 bg-[#F8FAFC] border border-slate-200 hover:border-primary hover:text-primary text-slate-600 text-[13.5px] font-semibold rounded-2xl transition-colors"
                >
                  <Briefcase size={15} />
                  View Current Openings
                </a>
              )}

              {/* Trust score */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide">
                    Transparency Score
                  </p>
                  <span className={`text-[16px] font-bold ${agency.transparencyScore >= 80 ? 'text-[#166534]' : 'text-[#92400E]'}`}>
                    {agency.transparencyScore}/100
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${agency.transparencyScore >= 80 ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'}`}
                    style={{ width: `${agency.transparencyScore}%` }}
                  />
                </div>
                <p className="text-[12px] text-slate-400 mt-2">
                  Based on pricing transparency, review quality, and verified placements.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <StickyMobileCTA agency={agency} />
    </>
  )
}
