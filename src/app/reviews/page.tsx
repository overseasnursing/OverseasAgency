import React from 'react'
import type { Metadata } from 'next'
import { Star, ShieldCheck, Users, AlertTriangle } from 'lucide-react'
import { FlagIcon } from '@/components/ui/FlagIcon'
import { getPublicReviews, getPublicReviewStats } from '@/lib/db/reviews'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { ReviewsListClient } from './ReviewsListClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Nurse Reviews of Overseas Recruitment Agencies — Verified Experiences | OverseasNursing.com',
  description:
    'Read verified reviews from Indian nurses about overseas recruitment agencies. Real experiences covering costs, timelines, hidden charges, and placements in Germany, UK, Canada, Australia, and Dubai.',
  alternates: { canonical: '/reviews' },
  openGraph: {
    title: 'Nurse Reviews of Overseas Recruitment Agencies',
    description:
      'Verified reviews from Indian nurses covering agency experiences, costs, and placements.',
    url: '/reviews',
    type: 'website',
    images: [{ url: '/api/og?type=default&title=Nurse+Reviews', width: 1200, height: 630, alt: 'Nurse Reviews — OverseasNursing.com' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nurse Reviews of Overseas Recruitment Agencies',
    description: 'Verified reviews from Indian nurses covering agency experiences, costs, and placements.',
    images: ['/api/og?type=default&title=Nurse+Reviews'],
  },
}

export default async function ReviewsPage() {
  const [all, stats] = await Promise.all([
    getPublicReviews(),
    getPublicReviewStats(),
  ])
  const featured = all.filter(r => r.featured)

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Nurse Reviews — OverseasNursing.com',
    description: 'Verified reviews from Indian nurses about overseas recruitment agencies.',
    url: 'https://overseasnursing.com/reviews',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://overseasnursing.com/' },
      { '@type': 'ListItem', position: 2, name: 'Reviews', item: 'https://overseasnursing.com/reviews' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <div className="relative bg-[#FAFBFF] border-b border-slate-200 overflow-hidden">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #0F4C81 1.5px, transparent 1.5px)',
            backgroundSize: '26px 26px',
          }}
        />
        {/* Warm gradient blob */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[300px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(34,197,94,0.07) 0%, transparent 65%)' }}
        />

        <div className="relative max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* Left: text */}
            <div>
              <p className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#166534] uppercase tracking-widest bg-[#DCFCE7] px-3 py-1.5 rounded-full mb-5">
                <ShieldCheck size={11} />
                Verified Reviews
              </p>
              <h1 className="text-[36px] sm:text-[42px] font-bold text-slate-900 leading-tight mb-4">
                Real Nurse Experiences.<br />
                No Bias. No Ads.
              </h1>
              <p className="text-[16px] text-slate-500 leading-relaxed max-w-[480px]">
                Every review is submitted by nurses who have used these agencies. We verify placements where possible.
                Hidden charges and scams are reported without filter.
              </p>

              {/* Journey strip */}
              <div className="mt-6 flex items-center gap-2 flex-wrap">
                <span className="text-[12px] text-slate-400 font-medium">Reviews from:</span>
                {[
                  { slug: 'germany',   label: 'Germany' },
                  { slug: 'uk',        label: 'UK' },
                  { slug: 'canada',    label: 'Canada' },
                  { slug: 'australia', label: 'Australia' },
                  { slug: 'dubai',     label: 'Dubai' },
                ].map(({ slug, label }) => (
                  <span key={slug} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                    <FlagIcon slug={slug} size={14} className="rounded-sm" />
                    <span className="text-[11.5px] font-medium text-slate-600">{label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right: stat cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#F59E0B" className="text-[#F59E0B]" />)}
                </div>
                <p className="text-[28px] font-bold text-slate-800 leading-none">{stats.avgRating}</p>
                <p className="text-[12px] text-slate-500 mt-1">Average rating across all agencies</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Users size={15} className="text-primary" />
                </div>
                <p className="text-[28px] font-bold text-slate-800 leading-none">{stats.total}</p>
                <p className="text-[12px] text-slate-500 mt-1">Total reviews submitted</p>
              </div>
              <div className="bg-[#DCFCE7] border border-[#BBF7D0] rounded-2xl p-5">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mb-2 shadow-sm">
                  <ShieldCheck size={15} className="text-[#166534]" />
                </div>
                <p className="text-[28px] font-bold text-[#166534] leading-none">{stats.placed}</p>
                <p className="text-[12px] text-[#166534]/70 mt-1">Verified nurse placements</p>
              </div>
              <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-5">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mb-2 shadow-sm">
                  <AlertTriangle size={15} className="text-[#92400E]" />
                </div>
                <p className="text-[28px] font-bold text-[#92400E] leading-none">{stats.withHiddenCharges}</p>
                <p className="text-[12px] text-[#92400E]/70 mt-1">Hidden charge reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Featured reviews */}
            {featured.length > 0 && (
              <section className="mb-12">
                <h2 className="text-[20px] font-bold text-slate-800 mb-1">Featured Reviews</h2>
                <p className="text-[13.5px] text-slate-500 mb-5">
                  Highly detailed verified experiences from nurses who completed the full migration process.
                </p>
                <div className="flex flex-col gap-5">
                  {featured.map((review) => (
                    <ReviewCard key={review.id} review={review} showAgencyName />
                  ))}
                </div>
              </section>
            )}

            {/* All reviews with filters */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-[20px] font-bold text-slate-800 mb-1">All Reviews</h2>
                  <p className="text-[13.5px] text-slate-500">Filter by country, placement status, or sort by rating.</p>
                </div>
                <a
                  href="/reviews/submit"
                  className="hidden sm:flex items-center h-9 px-4 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
                >
                  Write a Review
                </a>
              </div>
              <ReviewsListClient reviews={all} />
            </section>
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-5 w-[272px] flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-5">
              {/* Write a review CTA */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-[15px] font-bold text-slate-800 mb-2">Share Your Experience</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-4">
                  Help other nurses make better decisions. Your review protects the community.
                </p>
                <a
                  href="/reviews/submit"
                  className="flex items-center justify-center h-10 bg-primary hover:bg-primary-hover text-white text-[13.5px] font-semibold rounded-xl transition-colors"
                >
                  Write a Review
                </a>
              </div>

              {/* Trust model */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-[13px] font-bold text-slate-700 mb-3">How We Verify Reviews</h3>
                <ul className="flex flex-col gap-2.5">
                  {[
                    'We cross-check placement claims with documented evidence where possible',
                    'Reviewers must provide agency contract details to verify engagement',
                    'Hidden charge reports include amount and circumstance',
                    'No paid promotions or agency-sponsored placements affect ratings',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12.5px] text-slate-500 leading-relaxed">
                      <ShieldCheck size={13} className="text-[#166534] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scam awareness */}
              <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-4">
                <p className="text-[13px] font-semibold text-[#92400E] mb-1">Scam reports are separate</p>
                <p className="text-[12px] text-[#92400E]/80 leading-relaxed mb-3">
                  Fraudulent agencies are reported in the scam reports section with full incident details and timelines.
                </p>
                <a
                  href="/scam-reports"
                  className="text-[12.5px] font-semibold text-[#92400E] hover:underline"
                >
                  View scam reports →
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
