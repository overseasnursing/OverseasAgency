import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ShieldCheck, FileText } from 'lucide-react'
import { getAllReviewers, getReviewerBySlug, getReviewedContentSlugs } from '@/lib/reviewers/data'
import { ProfileHero } from '@/components/profiles/ProfileHero'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildReviewerPersonSchema } from '@/lib/seo/schemas'

export async function generateStaticParams() {
  const reviewers = await getAllReviewers()
  return reviewers.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const reviewer = await getReviewerBySlug(slug)
  if (!reviewer) return {}
  return {
    title: `${reviewer.displayName} — Expert Reviewer | OverseasNursing`,
    description: reviewer.shortBio,
    alternates: { canonical: `https://overseasnursing.com/reviewers/${reviewer.slug}` },
    ...(reviewer.isDemoProfile ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${reviewer.displayName} — Expert Reviewer | OverseasNursing`,
      description: reviewer.shortBio,
      url: `https://overseasnursing.com/reviewers/${reviewer.slug}`,
      type: 'profile',
    },
  }
}

export default async function ReviewerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const reviewer = await getReviewerBySlug(slug)
  if (!reviewer) notFound()

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Reviewers', href: '/reviewers' },
    { name: reviewer.displayName, href: `/reviewers/${reviewer.slug}` },
  ]

  const schema = buildReviewerPersonSchema(reviewer)
  const paragraphs = reviewer.longBio.split('\n\n').filter(Boolean)

  // Extension point: Phase 2 will populate reviewed content here
  const reviewedSlugs = await getReviewedContentSlugs(reviewer.slug)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <JsonLd schema={schema} />

      <div className="bg-white border-b border-slate-100 pt-6">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <ProfileHero
        displayName={reviewer.displayName}
        roleTitle={reviewer.reviewerTitle}
        shortBio={reviewer.shortBio}
        expertiseAreas={reviewer.expertiseAreas}
        profileLastUpdated={reviewer.profileLastUpdated}
        profileType="reviewer"
        isDemoProfile={reviewer.isDemoProfile}
        verificationStatus={reviewer.verificationStatus}
        credentialSummary={reviewer.credentialSummary}
        issuingBody={reviewer.issuingBody}
        registrationNumber={reviewer.registrationNumber}
        jurisdiction={reviewer.jurisdiction}
        yearsExperience={reviewer.yearsExperience}
        socialLinks={reviewer.socialLinks}
      />

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl flex flex-col gap-8">

          {/* Bio */}
          <section
            aria-labelledby="bio-heading"
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8"
          >
            <h2 id="bio-heading" className="text-[18px] font-bold text-slate-800 mb-5">
              About {reviewer.displayName}
            </h2>
            <div className="flex flex-col gap-4 text-[14.5px] text-slate-600 leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {/* Review specialties */}
          <section
            aria-labelledby="specialties-heading"
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-[#DCFCE7] rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={15} className="text-[#166534]" />
              </div>
              <h2 id="specialties-heading" className="text-[18px] font-bold text-slate-800">
                Review Specialties
              </h2>
            </div>
            <ul className="flex flex-col gap-2">
              {reviewer.reviewSpecialties.map((s) => (
                <li key={s} className="flex items-center gap-2.5 text-[13.5px] text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {/* Professional memberships */}
          {reviewer.professionalMemberships && reviewer.professionalMemberships.length > 0 && (
            <section
              aria-labelledby="memberships-heading"
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8"
            >
              <h2 id="memberships-heading" className="text-[18px] font-bold text-slate-800 mb-4">
                Professional Memberships
              </h2>
              <ul className="flex flex-col gap-2">
                {reviewer.professionalMemberships.map((m) => (
                  <li key={m} className="flex items-center gap-2.5 text-[13.5px] text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Content reviewed — Phase 2 extension point */}
          <section
            aria-labelledby="reviewed-heading"
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText size={15} className="text-slate-400" />
              </div>
              <h2 id="reviewed-heading" className="text-[18px] font-bold text-slate-800">
                Content Reviewed
              </h2>
            </div>
            {reviewedSlugs.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {reviewedSlugs.map((s) => (
                  <li key={s}>
                    <a href={`/${s}`} className="text-[13.5px] text-primary hover:underline">
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-slate-400">
                Reviewer credits are being added to published content. Articles reviewed by this
                expert will appear here.
              </p>
            )}
          </section>

          {/* Independence note */}
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-5 py-4">
            <p className="text-[13px] text-[#166534] leading-relaxed">
              <strong>Editorial independence:</strong> This reviewer has no financial relationship
              with any agency listed on OverseasNursing and does not participate in recruitment or
              placement activity. All content reviewed under our{' '}
              <a href="/editorial-policy" className="font-semibold hover:underline">
                editorial policy
              </a>
              .
            </p>
          </div>

          <a
            href="/reviewers"
            className="text-[13.5px] font-semibold text-primary hover:underline"
          >
            ← All reviewers
          </a>
        </div>
      </div>
    </div>
  )
}
