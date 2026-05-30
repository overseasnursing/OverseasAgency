import type { Metadata } from 'next'
import { ChevronRight } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'Editorial Policy — OverseasNursing',
  description:
    'Our editorial standards for content sourcing, review verification, expert oversight, and editorial independence. How we research and update all content.',
  alternates: { canonical: 'https://overseasnursing.com/editorial-policy' },
  openGraph: {
    title: 'Editorial Policy — OverseasNursing',
    description:
      'Our editorial standards for content sourcing, review verification, expert oversight, and editorial independence.',
    url: 'https://overseasnursing.com/editorial-policy',
    type: 'website',
  },
}

const LAST_UPDATED = 'May 2026'

export default function EditorialPolicyPage() {
  const webPageSchema = buildWebPageSchema({
    title: 'Editorial Policy — OverseasNursing',
    description:
      'How OverseasNursing researches, writes, reviews, and updates content about overseas nursing migration.',
    path: '/editorial-policy',
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Editorial Policy', href: '/editorial-policy' },
  ])

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <JsonLd schema={webPageSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <div className="max-w-3xl mx-auto px-5 py-16">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12.5px] text-slate-400 mb-8">
          <a href="/" className="hover:text-slate-600 transition-colors">Home</a>
          <ChevronRight size={12} />
          <a href="/about" className="hover:text-slate-600 transition-colors">About</a>
          <ChevronRight size={12} />
          <span className="text-slate-600 font-medium">Editorial Policy</span>
        </nav>

        {/* Header */}
        <h1 className="text-[32px] font-bold text-slate-900 mb-2">Editorial Policy</h1>
        <p className="text-[14px] text-slate-400 mb-4">Last updated: {LAST_UPDATED}</p>
        <p className="text-[15px] text-slate-500 leading-relaxed mb-10">
          This policy describes how OverseasNursing researches, writes, verifies, and maintains all
          content published on this platform. It applies to every guide, exam article, country page,
          pricing breakdown, scam report, and review published under the OverseasNursing brand.
          Questions about this policy can be directed to our{' '}
          <a href="/contact" className="text-primary font-medium hover:underline">contact page</a>.
        </p>

        {/* Internal link to About */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl px-5 py-4 mb-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-[13.5px] font-semibold text-primary mb-0.5">Who we are</p>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              This policy is written and maintained by the OverseasNursing editorial team.
              To learn more about the platform, our mission, and our independence, read our{' '}
              <a href="/about" className="text-primary font-medium hover:underline">About page</a>.
            </p>
          </div>
          <a
            href="/about"
            className="flex-shrink-0 inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary hover:underline whitespace-nowrap mt-0.5"
          >
            About us <ChevronRight size={12} />
          </a>
        </div>

        {/* Policy sections */}
        <div className="flex flex-col gap-10 text-[15px] text-slate-600 leading-relaxed">

          {/* 1. Content sourcing */}
          <section>
            <h2 className="text-[20px] font-bold text-slate-800 mb-4">
              1. Content Sourcing Policy
            </h2>
            <p className="mb-3">
              All editorial content on OverseasNursing is researched from primary, authoritative sources.
              We do not publish content based solely on agency claims, social media posts, or unverified
              secondary reporting.
            </p>
            <p className="mb-3">Our primary sources include:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mb-3">
              <li>Official nursing regulatory body publications — NMC (UK), AHPRA (Australia), NCSBN (USA/Canada), DHA/MOH/HAAD (UAE)</li>
              <li>Government immigration and visa authority websites — UK Home Office, IRCC Canada, Germany BAMF, Australian Department of Home Affairs</li>
              <li>Nursing council exam handbooks, official syllabus documents, and fee schedules</li>
              <li>Embassy and consulate official guidance for Indian nationals</li>
              <li>Published salary data from national health services and hospital groups</li>
            </ul>
            <p>
              Where primary data is unavailable, we disclose the basis for our information and the date
              it was last verified. We do not publish salary ranges, visa timelines, or exam fees without
              citing a source or providing a verification date.
            </p>
          </section>

          <div className="border-t border-slate-100" />

          {/* 2. Review verification */}
          <section>
            <h2 className="text-[20px] font-bold text-slate-800 mb-4">
              2. Review Verification Process
            </h2>
            <p className="mb-3">
              Reviews submitted to OverseasNursing are not automatically published. Every review
              undergoes the following process before appearing on the platform:
            </p>
            <ol className="list-decimal pl-5 flex flex-col gap-2 mb-3">
              <li><strong>Account creation with email verification.</strong> Reviewers must create an account using a valid, verified email address. Unverified accounts cannot submit reviews.</li>
              <li><strong>Mandatory disclosures.</strong> Reviewers must state the agency used, destination country, approximate migration timeline, and whether they received their visa or employment offer.</li>
              <li><strong>Manual moderation.</strong> Every review is read by a member of the OverseasNursing moderation team. Automated approval is not used for any review.</li>
              <li><strong>Consistency checks.</strong> We check for: implausible timelines relative to stated destinations, costs that fall far outside observed ranges for stated services, duplicate submissions, and writing patterns inconsistent with genuine first-person accounts.</li>
              <li><strong>Conflict of interest check.</strong> Reviews that appear to originate from agency staff, competitors, or parties with a financial interest in the outcome are removed.</li>
            </ol>
            <p>
              Agencies may publicly respond to reviews on their profile. They may not request removal
              of reviews unless a review contains demonstrably false factual claims, which must be
              submitted via our corrections process (see Section 5).
            </p>
          </section>

          <div className="border-t border-slate-100" />

          {/* 3. Expert review process */}
          <section>
            <h2 className="text-[20px] font-bold text-slate-800 mb-4">
              3. Expert Review Process
            </h2>
            <p className="mb-3">
              Content that covers clinical nursing competency, licensing exam requirements, visa and
              immigration processes, or regulatory body procedures is subject to expert review before
              publication.
            </p>
            <p className="mb-3">
              Expert reviewers are practising nurses, registered migration agents, or professionals with
              direct, verifiable experience in the subject matter they review. The criteria for becoming
              an expert reviewer are set out in Section 9.
            </p>
            <p className="mb-3">Content types that require expert review before publication:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mb-3">
              <li>Exam guides (OET, NCLEX-RN, DHA, AHPRA, CBSE/OSCE, MOH, HAAD)</li>
              <li>Country migration guides covering visa processes and regulatory requirements</li>
              <li>Scam report articles making specific factual claims about named agencies</li>
              <li>Salary guides where tax, deduction, or take-home calculations are involved</li>
            </ul>
            <p>
              Where a piece of content has been reviewed by a named expert, this will be indicated
              on the page with a reviewer credit and the date of review. Expert reviewer profiles
              are published at{' '}
              <a href="/reviewers" className="text-primary font-medium hover:underline">/reviewers</a>.
            </p>
          </section>

          <div className="border-t border-slate-100" />

          {/* 4. Update frequency */}
          <section>
            <h2 className="text-[20px] font-bold text-slate-800 mb-4">
              4. Update Frequency Policy
            </h2>
            <p className="mb-3">
              Overseas nursing migration involves regulatory requirements that change. We maintain the
              following minimum update schedules:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mb-3">
              <li><strong>Exam guides</strong> — reviewed every 6 months, or immediately when an official change to exam format, fees, or eligibility is announced</li>
              <li><strong>Country migration guides</strong> — reviewed every 6 months, or when visa rules change</li>
              <li><strong>Salary guides</strong> — updated annually at minimum, flagged as estimates between updates</li>
              <li><strong>Pricing data</strong> — agency fee data is sourced from reviews and agency disclosures; pages show the date the data was last verified</li>
              <li><strong>Scam reports</strong> — reviewed when new information is submitted or when the subject agency provides evidence of resolution</li>
            </ul>
            <p>
              Every content page displays a &ldquo;last updated&rdquo; date. Pages older than 12 months
              that cover time-sensitive regulatory topics are flagged with a freshness warning until they
              are reviewed.
            </p>
          </section>

          <div className="border-t border-slate-100" />

          {/* 5. Correction policy */}
          <section>
            <h2 className="text-[20px] font-bold text-slate-800 mb-4">
              5. Correction Policy
            </h2>
            <p className="mb-3">
              OverseasNursing is committed to factual accuracy. When we make an error, we correct it
              promptly and transparently.
            </p>
            <p className="mb-3">Our corrections process:</p>
            <ol className="list-decimal pl-5 flex flex-col gap-2 mb-3">
              <li>Factual errors can be reported via our <a href="/contact" className="text-primary font-medium hover:underline">contact page</a>. Please include the specific claim, the correct information, and your source.</li>
              <li>All correction requests are acknowledged within 48 hours.</li>
              <li>Substantiated errors are corrected within 5 business days. Critical errors (incorrect exam fees, wrong visa requirements) are corrected within 24 hours.</li>
              <li>Corrected content is updated with a revised &ldquo;last updated&rdquo; date. We do not delete inaccurate content; we correct and date it.</li>
              <li>Significant corrections are noted in-line on the page with a brief explanation of what changed.</li>
            </ol>
            <p>
              We do not correct content in response to complaints from agencies about negative — but accurate — reviews or reports. Corrections apply to factual errors only.
            </p>
          </section>

          <div className="border-t border-slate-100" />

          {/* 6. Editorial independence */}
          <section>
            <h2 className="text-[20px] font-bold text-slate-800 mb-4">
              6. Editorial Independence Policy
            </h2>
            <p className="mb-3">
              OverseasNursing operates with full editorial independence from the agencies, exam providers,
              and service companies it covers. Our editorial decisions are made without commercial influence.
            </p>
            <p className="mb-3">Specifically:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mb-3">
              <li>No agency has paid for their listing, their profile position, or their rating</li>
              <li>No agency can pay to have negative reviews suppressed or removed</li>
              <li>No agency can pay to have positive content written about them</li>
              <li>Agency rankings on listing pages are calculated algorithmically from user ratings, review volume, and transparency score — not from commercial agreements</li>
              <li>The editorial team operates independently of the business development team; no editorial decision requires commercial approval</li>
            </ul>
            <p>
              If our commercial model changes — for example, if we introduce a verified agency badge with
              a listing fee — this will be disclosed prominently in this policy and on the relevant listing
              pages. Any such commercial relationship will have no effect on review scores or content coverage.
            </p>
          </section>

          <div className="border-t border-slate-100" />

          {/* 7. Affiliate disclosure */}
          <section>
            <h2 className="text-[20px] font-bold text-slate-800 mb-4">
              7. Affiliate and Commercial Disclosure Policy
            </h2>
            <p className="mb-3">
              As of the date of this policy, OverseasNursing has no affiliate relationships with any
              agency, exam provider, visa service, language school, or accommodation provider.
            </p>
            <p className="mb-3">
              We do not earn commission from:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mb-3">
              <li>Agency referrals or nurse placements</li>
              <li>Exam registration links (OET, NCLEX-RN, DHA, AHPRA)</li>
              <li>Visa application services</li>
              <li>Language training providers</li>
            </ul>
            <p>
              If affiliate or sponsored relationships are introduced in future, this policy will be updated
              and all such content will be clearly labelled with a disclosure at the top of the relevant
              page. Sponsored content will never be embedded within agency review profiles or ratings.
            </p>
          </section>

          <div className="border-t border-slate-100" />

          {/* 8. Author criteria */}
          <section>
            <h2 className="text-[20px] font-bold text-slate-800 mb-4">
              8. Author Selection Criteria
            </h2>
            <p className="mb-3">
              Content authors on OverseasNursing are selected based on their relevant knowledge and
              writing quality. Authors are not required to have a nursing background, but are required
              to demonstrate research competency and the ability to write accurately for a nurse audience.
            </p>
            <p className="mb-3">Author requirements:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mb-3">
              <li>Ability to locate, read, and accurately summarise official regulatory and government source material</li>
              <li>Willingness to submit content for expert review and act on reviewer feedback</li>
              <li>Disclosure of any professional or personal connection to agencies, exam providers, or migration service companies</li>
              <li>Commitment to the corrections process — authors are expected to update their content when errors are identified</li>
              <li>Agree to have their name and professional background published on their author profile</li>
            </ul>
            <p>
              Authors with a direct commercial or personal connection to agencies they cover are
              recused from writing that content. This is a non-negotiable condition of authorship.
              Author profiles — including credentials and content portfolios — are published at{' '}
              <a href="/authors" className="text-primary font-medium hover:underline">/authors</a>.
            </p>
          </section>

          <div className="border-t border-slate-100" />

          {/* 9. Reviewer criteria */}
          <section>
            <h2 className="text-[20px] font-bold text-slate-800 mb-4">
              9. Expert Reviewer Criteria
            </h2>
            <p className="mb-3">
              Expert reviewers are professionals who validate the factual accuracy of content before
              publication. They are distinct from authors — reviewers do not write content, they assess it.
            </p>
            <p className="mb-3">Reviewer requirements:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mb-3">
              <li><strong>Active or recent professional registration</strong> in a field relevant to the content they review (e.g. active NMC registration for UK nursing content; AHPRA registration for Australia content; registered migration agent licence for visa content)</li>
              <li><strong>Verifiable professional identity</strong> — reviewers must provide their registration number, which is displayed on their reviewer profile</li>
              <li><strong>No commercial conflict of interest</strong> — reviewers may not review content covering agencies they have worked for, referred to, or have a financial relationship with</li>
              <li><strong>Commitment to review timelines</strong> — review turnaround must be within 14 days of content submission</li>
              <li><strong>Agreement to public disclosure</strong> — reviewer profiles are published with their name, credentials, registration details, and content reviewed</li>
            </ul>
            <p>
              Reviewer profiles are published at{' '}
              <a href="/reviewers" className="text-primary font-medium hover:underline">
                /reviewers
              </a>
              .
            </p>
          </section>

          <div className="border-t border-slate-100" />

          {/* 10. Conflict of interest */}
          <section>
            <h2 className="text-[20px] font-bold text-slate-800 mb-4">
              10. Conflict of Interest Policy
            </h2>
            <p className="mb-3">
              Conflicts of interest — real or perceived — undermine editorial credibility. OverseasNursing
              requires all contributors, reviewers, and editorial staff to disclose any potential conflict
              before beginning work on content.
            </p>
            <p className="mb-3">A conflict of interest exists when an author or reviewer has:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mb-3">
              <li>A current or recent employment or contractor relationship with an agency they are covering</li>
              <li>A financial stake (equity, commission, or referral arrangement) in an agency, exam provider, or migration service</li>
              <li>A close personal relationship (family member, business partner) with an agency owner or senior staff member</li>
              <li>Received gifts, travel, or hospitality from any entity they are covering, within the past 12 months</li>
            </ul>
            <p className="mb-3">
              When a conflict is disclosed:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mb-3">
              <li>The contributor is recused from that specific piece of content</li>
              <li>If a conflict is discovered after publication, the content is reassigned and reviewed by an independent contributor before any further updates</li>
              <li>Undisclosed conflicts that are later discovered result in permanent removal from the contributor programme</li>
            </ul>
            <p>
              Conflicts of interest discovered in published content can be reported to our editorial team
              via the <a href="/contact" className="text-primary font-medium hover:underline">contact page</a>.
            </p>
          </section>

          <div className="border-t border-slate-100" />

          {/* Footer nav */}
          <div className="flex flex-col sm:flex-row items-start gap-6 pt-2">
            <a
              href="/about"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-primary hover:underline"
            >
              ← Back to About
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-primary hover:underline"
            >
              Report a policy concern →
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
