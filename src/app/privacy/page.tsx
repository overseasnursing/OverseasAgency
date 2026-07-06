import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — OverseasNursing',
  description: 'Privacy policy for OverseasNursing.com — how we collect, use, and protect your data.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <h1 className="text-[32px] font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-[14px] text-slate-400 mb-10">Last updated: January 2025</p>

        <div className="flex flex-col gap-8 text-[15px] text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">1. Information We Collect</h2>
            <p className="mb-2">We collect the following types of information:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Account data:</strong> Email address and display name when you register</li>
              <li><strong>Review & report content:</strong> Text, ratings, and other content you submit</li>
              <li><strong>Usage data:</strong> Pages visited, search queries, and interaction data collected via Cloudflare Zaraz and Microsoft Clarity</li>
              <li><strong>Device data:</strong> Browser type, IP address, and operating system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>To operate and improve the platform</li>
              <li>To display your submitted reviews and reports</li>
              <li>To moderate content and prevent abuse</li>
              <li>To send transactional emails (e.g. email verification)</li>
              <li>To analyse usage patterns and improve SEO and UX</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">3. Data Storage & Security</h2>
            <p>Your data is stored securely using Supabase (PostgreSQL) hosted on AWS. We use industry-standard encryption in transit (HTTPS) and at rest. We do not sell your personal data to third parties.</p>
          </section>

          <section id="cookies">
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">4. Cookies & Analytics</h2>
            <p>
              We use necessary cookies for security, authentication, and core site functionality —
              these can&apos;t be disabled. Optional analytics cookies (Microsoft Clarity) help us
              understand how the website is used and are only loaded if you consent to them. You can
              accept, reject, or change your analytics preference at any time via the &ldquo;Cookie
              Preferences&rdquo; link in the footer, or your browser&apos;s own cookie settings.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">5. Third-Party Services</h2>
            <p className="mb-2">We use the following third-party services:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Supabase</strong> — Authentication and database</li>
              <li><strong>Vercel</strong> — Hosting and deployment</li>
              <li><strong>Cloudflare Zaraz</strong> — Analytics tag management and tracking</li>
              <li><strong>Cloudflare</strong> — CDN and security</li>
            </ul>
            <p className="mt-3">Each of these services has its own privacy policy governing their data use.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">6. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us via our <a href="/contact" className="text-primary hover:underline font-medium">contact page</a>.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">7. Data Retention</h2>
            <p>We retain your account data for as long as your account is active. Reviews and scam reports may be retained even after account deletion to preserve the integrity of the platform&apos;s information.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">8. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify users of significant changes via email or a notice on the platform.</p>
          </section>

        </div>
      </div>
    </div>
  )
}
