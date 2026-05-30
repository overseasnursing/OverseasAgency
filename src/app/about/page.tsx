import type { Metadata } from 'next'
import {
  CheckCircle2, XCircle, BookOpen, ShieldCheck, Scale,
  Users, Award, Mail, ArrowRight, Target, FileText,
} from 'lucide-react'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { buildAboutPageSchema, buildOrganizationSchema } from '@/lib/seo/schemas'
import { MailtoLink } from '@/components/ui/MailtoLink'

export const metadata: Metadata = {
  title: 'About OverseasNursing — Independent Nursing Migration Platform',
  description:
    'Independent review and comparison platform for Indian nurses planning overseas migration. No agency commissions, no paid rankings. Real verified reviews.',
  alternates: { canonical: 'https://overseasnursing.com/about' },
  openGraph: {
    title: 'About OverseasNursing — Independent Nursing Migration Platform',
    description:
      'The independent platform helping Indian nurses safely navigate overseas migration through verified reviews, transparent pricing, and expert guides.',
    url: 'https://overseasnursing.com/about',
    type: 'website',
  },
}

const IS_ITEMS = [
  'A search and discovery platform for nursing migration agencies across India',
  'A verified review system where nurses rate agencies on transparency, timelines, and cost accuracy',
  'A pricing comparison engine showing what agencies actually charge — not just what they advertise',
  'A scam awareness and reporting database maintained by the nursing community',
  'An educational platform for exam guides, country migration guides, and salary data',
  'An independent publisher with no commercial ties to the agencies we list',
]

const IS_NOT_ITEMS = [
  'A recruitment agency or employment service',
  'A visa consultancy or immigration law firm',
  'A guarantor of job placements or visa outcomes',
  'Paid by agencies to rank them higher or hide negative reviews',
  'An affiliate marketing site — we earn no commission from agencies or exam providers',
  'Responsible for decisions made based on content found on this platform',
]

const CONTENT_PROCESS = [
  {
    title: 'Official sources first',
    body: 'Every country guide, exam article, and visa process overview is cross-referenced with government websites, nursing regulatory body publications (NMC, AHPRA, NCSBN), and embassy visa guidelines.',
  },
  {
    title: 'Community-verified data',
    body: 'Salary ranges, timeline estimates, and agency fee data are benchmarked against real nurse migration experiences collected through our review system.',
  },
  {
    title: 'Dated and versioned',
    body: 'All content displays when it was last reviewed. Exam guides are updated every six months at minimum, or immediately when official requirements change.',
  },
  {
    title: 'Corrections policy',
    body: 'Factual errors reported via our contact page are investigated within 48 hours. Confirmed errors are corrected and the change is noted with the updated date.',
  },
]

const REVIEW_PROCESS = [
  { step: '01', title: 'Account verification', body: 'Every reviewer must create an account with a verified email address. Anonymous reviews are not accepted.' },
  { step: '02', title: 'Required disclosures', body: 'Reviewers must disclose the agency used, destination country, approximate timeline, and whether their visa was received.' },
  { step: '03', title: 'Manual moderation', body: 'Every review is read by a member of our moderation team before it appears publicly. Automated approval is not used.' },
  { step: '04', title: 'Consistency checks', body: 'Implausible timelines, anomalous costs, duplicate submissions, and language patterns inconsistent with genuine experience are flagged for investigation.' },
  { step: '05', title: 'Agency response — not removal', body: 'Agencies may respond to reviews publicly. They cannot request removal. Only demonstrably false factual claims can be disputed through our corrections process.' },
]

export default function AboutPage() {
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
  ]

  const schemas = [
    buildAboutPageSchema(),
    buildOrganizationSchema(),
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MultiJsonLd schemas={schemas} />

      {/* ── Page header ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-5">
            <h1 className="text-[32px] sm:text-[38px] font-bold text-slate-900 leading-tight mb-3">
              About OverseasNursing
            </h1>
            <p className="text-[16px] text-slate-500 leading-relaxed max-w-2xl">
              The independent search and comparison platform for Indian nurses planning overseas migration.
              No agency commissions. No paid rankings. No commercial pressure — just the information you need
              to migrate safely.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 mt-8 max-w-lg">
            {[
              { value: '100+', label: 'Verified nurse reviews' },
              { value: '150+', label: 'Agencies listed' },
              { value: '5',    label: 'Destination countries' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-[26px] font-black text-primary leading-none">{value}</p>
                <p className="text-[12px] text-slate-500 mt-1 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">

          {/* Mission */}
          <section aria-labelledby="mission-heading" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target size={18} className="text-primary" />
              </div>
              <h2 id="mission-heading" className="text-[20px] font-bold text-slate-800">Our Mission</h2>
            </div>

            <div className="flex flex-col gap-4 text-[15px] text-slate-600 leading-relaxed">
              <p>
                OverseasNursing was built on a simple observation: Indian nurses planning to migrate abroad
                had almost no reliable, independent source of information. Agency websites showed only the good.
                Social media was full of noise. And the nurses who had real experience — good and bad — had
                nowhere to share it.
              </p>
              <p>
                Our mission is to fix that. We exist to give every Indian nurse the information they need to
                make a safe, informed, and cost-effective decision about overseas migration — without any
                commercial pressure from the agencies they are evaluating.
              </p>
              <blockquote className="border-l-4 border-primary pl-5 py-1 mt-2">
                <p className="text-[15px] text-slate-700 font-medium italic">
                  &ldquo;We measure our success not by how many agencies are listed, but by how many nurses
                  avoid bad agencies because of what they found here.&rdquo;
                </p>
              </blockquote>
            </div>
          </section>

          {/* What we are / are not */}
          <section aria-labelledby="platform-heading" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <h2 id="platform-heading" className="text-[20px] font-bold text-slate-800 mb-6">What OverseasNursing Is — and Is Not</h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* IS */}
              <div>
                <p className="text-[13px] font-bold text-[#166534] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> What we are
                </p>
                <ul className="flex flex-col gap-3">
                  {IS_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-slate-600 leading-snug">
                      <CheckCircle2 size={14} className="text-[#22C55E] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* IS NOT */}
              <div className="sm:border-l sm:border-slate-100 sm:pl-6">
                <p className="text-[13px] font-bold text-[#B91C1C] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <XCircle size={14} /> What we are not
                </p>
                <ul className="flex flex-col gap-3">
                  {IS_NOT_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-slate-600 leading-snug">
                      <XCircle size={14} className="text-slate-300 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* How content is created */}
          <section aria-labelledby="content-heading" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-[#DBEAFE] rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen size={18} className="text-primary" />
              </div>
              <h2 id="content-heading" className="text-[20px] font-bold text-slate-800">How Our Content Is Created</h2>
            </div>

            <p className="text-[14.5px] text-slate-500 mb-6 leading-relaxed">
              Every guide, country page, exam article, and pricing breakdown on OverseasNursing follows
              a consistent editorial process. Our{' '}
              <a href="/editorial-policy" className="text-primary font-medium hover:underline">
                full editorial policy
              </a>{' '}
              is published separately — here is a summary.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {CONTENT_PROCESS.map(({ title, body }) => (
                <div key={title} className="bg-[#F8FAFC] rounded-xl p-4">
                  <p className="text-[13.5px] font-bold text-slate-800 mb-1.5">{title}</p>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How reviews are verified */}
          <section aria-labelledby="reviews-heading" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-[#DCFCE7] rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={18} className="text-[#166534]" />
              </div>
              <h2 id="reviews-heading" className="text-[20px] font-bold text-slate-800">How We Verify Reviews</h2>
            </div>

            <p className="text-[14.5px] text-slate-500 mb-6 leading-relaxed">
              Reviews on OverseasNursing are not anonymous and are not automatically published.
              Every review goes through a five-step process before appearing on an agency profile.
            </p>

            <div className="flex flex-col gap-4">
              {REVIEW_PROCESS.map(({ step, title, body }) => (
                <div key={step} className="flex gap-4 items-start">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-[12px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step}
                  </span>
                  <div>
                    <p className="text-[13.5px] font-bold text-slate-800 mb-0.5">{title}</p>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-4 py-3">
              <p className="text-[13px] text-[#166534] leading-relaxed">
                <strong>Our commitment:</strong> We do not guarantee that every review is perfectly accurate,
                but we operate one of the most rigorous verification processes in the Indian nursing migration
                space. If you believe a review contains false information, you can report it via our{' '}
                <a href="/contact" className="font-semibold hover:underline">contact page</a>.
              </p>
            </div>
          </section>

          {/* Editorial independence */}
          <section
            aria-labelledby="independence-heading"
            className="bg-primary rounded-2xl p-6 sm:p-8 text-white"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Scale size={18} className="text-white" />
              </div>
              <h2 id="independence-heading" className="text-[20px] font-bold text-white">
                Editorial Independence
              </h2>
            </div>

            <ul className="flex flex-col gap-3 mb-5">
              {[
                'No agency has paid for their listing or their review score',
                'Agency rankings are determined by user ratings, review count, and transparency score — not commercial relationships',
                'We accept no commission, referral fee, or affiliate payment from any agency listed on this platform',
                'No agency can pay to suppress negative reviews or boost their profile position',
                'Sponsored content, if ever introduced, will be clearly and prominently labelled — it will never appear within agency profiles or ratings',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-white/90 leading-snug">
                  <CheckCircle2 size={14} className="text-white mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-[13px] text-white/80 leading-relaxed">
              Read our full{' '}
              <a href="/editorial-policy" className="text-white font-semibold hover:underline">
                editorial policy →
              </a>
            </p>
          </section>

          {/* Team placeholder */}
          <section aria-labelledby="team-heading" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-[#F3E8FF] rounded-xl flex items-center justify-center flex-shrink-0">
                <Users size={18} className="text-[#7C3AED]" />
              </div>
              <h2 id="team-heading" className="text-[20px] font-bold text-slate-800">Our Team</h2>
            </div>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
              OverseasNursing is built and maintained by a team of writers, researchers, and former migration
              industry professionals. Individual author profiles — including credentials, content portfolios,
              and professional backgrounds — are being published as part of our ongoing editorial development.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {['Content Writer', 'Migration Researcher', 'Platform Editor'].map((role) => (
                <div
                  key={role}
                  className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 flex flex-col items-center gap-3 text-center"
                >
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                    <FileText size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-600">{role}</p>
                    <p className="text-[11.5px] text-slate-400 mt-0.5">Profile coming soon</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <a
                href="/authors"
                className="text-[13.5px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                View all author profiles <ArrowRight size={13} />
              </a>
            </div>
          </section>

          {/* Advisory board placeholder */}
          <section id="advisory-board" aria-labelledby="advisory-heading" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-[#FEF3C7] rounded-xl flex items-center justify-center flex-shrink-0">
                <Award size={18} className="text-[#92400E]" />
              </div>
              <h2 id="advisory-heading" className="text-[20px] font-bold text-slate-800">Advisory Board</h2>
            </div>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
              Our content is reviewed by practising nurses and migration specialists before publication.
              Expert reviewer profiles — including their credentials, licensing information, and areas of
              specialisation — are being prepared as part of our EEAT implementation.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {['Clinical Reviewer', 'Visa & Immigration Advisor', 'Exam Preparation Expert'].map((role) => (
                <div
                  key={role}
                  className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 flex flex-col items-center gap-3 text-center"
                >
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                    <Award size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-600">{role}</p>
                    <p className="text-[11.5px] text-slate-400 mt-0.5">Profile coming soon</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <a
                href="/reviewers"
                className="text-[13.5px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                View all reviewer profiles <ArrowRight size={13} />
              </a>
            </div>
          </section>

          {/* Contact */}
          <section aria-labelledby="contact-heading" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-[#EFF6FF] rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-primary" />
              </div>
              <h2 id="contact-heading" className="text-[20px] font-bold text-slate-800">Get in Touch</h2>
            </div>

            <p className="text-[14.5px] text-slate-500 mb-6 leading-relaxed">
              We are a small independent team. We read every message and aim to respond within 2–5 business
              days. For scam reports, please use the dedicated report form — it is reviewed daily.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary-hover text-white text-[13.5px] font-semibold rounded-xl transition-colors"
              >
                Contact us <ArrowRight size={14} />
              </a>
              <MailtoLink
                email="hello@overseasnursing.com"
                className="inline-flex items-center justify-center gap-2 h-10 px-5 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-[13.5px] font-medium rounded-xl transition-colors"
              >
                hello@overseasnursing.com
              </MailtoLink>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
