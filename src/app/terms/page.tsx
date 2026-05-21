import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — OverseasNursing',
  description: 'Terms of service for OverseasNursing.com — the nursing migration platform for Indian nurses.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <h1 className="text-[32px] font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-[14px] text-slate-400 mb-10">Last updated: January 2025</p>

        <div className="flex flex-col gap-8 text-[15px] text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using OverseasNursing.com, you agree to be bound by these Terms of Service. If you do not agree, please do not use this platform.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">2. Platform Purpose</h2>
            <p>OverseasNursing.com is an independent information and review platform for nurses exploring overseas migration. We are not a recruitment agency, visa consultant, or employment service. We do not guarantee placements or employment outcomes.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">3. User Accounts</h2>
            <p className="mb-2">To submit reviews or scam reports, you must create an account. You are responsible for:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Keeping your account credentials secure</li>
              <li>All activity under your account</li>
              <li>Providing accurate registration information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">4. Content & Reviews</h2>
            <p className="mb-2">All reviews and reports submitted must be:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Based on genuine personal experience</li>
              <li>Truthful and not misleading</li>
              <li>Free from defamatory, abusive, or illegal content</li>
              <li>Not submitted in exchange for payment or incentive</li>
            </ul>
            <p className="mt-3">Submitting false reviews is a violation of these terms and may result in account suspension and legal action.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">5. Moderation</h2>
            <p>We reserve the right to review, approve, reject, or remove any content submitted to the platform at our sole discretion. We are not liable for any content posted by users.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">6. Disclaimer</h2>
            <p>Information on this platform is provided for general guidance only. Always verify information independently and consult qualified professionals before making migration decisions. OverseasNursing.com is not liable for decisions made based on content found on this site.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">7. Intellectual Property</h2>
            <p>All original content, branding, and design on this platform is owned by OverseasNursing.com. You may not reproduce, distribute, or use our content without written permission.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">8. Changes to Terms</h2>
            <p>We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the revised terms.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">9. Contact</h2>
            <p>For any questions about these terms, contact us at <a href="/contact" className="text-primary hover:underline font-medium">our contact page</a>.</p>
          </section>

        </div>
      </div>
    </div>
  )
}
