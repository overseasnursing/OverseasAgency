import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security Policy — OverseasNursing',
  description: 'How to responsibly report a security vulnerability on OverseasNursing.com.',
  alternates: { canonical: '/security-policy' },
}

export default function SecurityPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <h1 className="text-[32px] font-bold text-slate-900 mb-2">Security Policy</h1>
        <p className="text-[14px] text-slate-400 mb-10">Last updated: July 2026</p>

        <div className="flex flex-col gap-8 text-[15px] text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">Our Commitment</h2>
            <p>OverseasNursing.com handles personal information for nurses and agencies, so we take security seriously. We welcome reports from security researchers who discover vulnerabilities in our platform, and we&apos;re committed to working with you to understand and resolve issues quickly.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">Reporting a Vulnerability</h2>
            <p className="mb-2">If you believe you&apos;ve found a security vulnerability, please email us at <a href="mailto:hello@overseasnursing.com" className="text-primary hover:underline font-medium">hello@overseasnursing.com</a> with:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>A description of the vulnerability and its potential impact</li>
              <li>Step-by-step instructions to reproduce it</li>
              <li>Any relevant URLs, screenshots, or proof-of-concept code</li>
            </ul>
            <p className="mt-3">Please do not disclose the issue publicly or to third parties until we&apos;ve had a reasonable opportunity to investigate and address it.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">Scope</h2>
            <p className="mb-2">In scope:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>overseasnursing.com and all its subdomains</li>
            </ul>
            <p className="mt-3 mb-2">Out of scope:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Denial-of-service (DoS/DDoS) attacks</li>
              <li>Social engineering of our staff, users, or contractors</li>
              <li>Physical attacks against our offices or infrastructure</li>
              <li>Automated vulnerability scanning that generates excessive traffic</li>
              <li>Third-party services we integrate with but don&apos;t control (e.g. payment processors, analytics providers)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">Safe Harbor</h2>
            <p>We will not pursue legal action against researchers who discover and report vulnerabilities in good faith, provided they act within the scope of this policy, make a genuine effort to avoid privacy violations and service disruption, and do not access, modify, or exfiltrate more data than necessary to demonstrate the issue.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">What to Expect</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>An acknowledgment of your report within 5 business days</li>
              <li>An initial assessment of severity and validity within 10 business days</li>
              <li>Ongoing updates as we work toward a fix</li>
            </ul>
            <p className="mt-3">We don&apos;t currently run a paid bug bounty program, but we&apos;re happy to credit researchers (with permission) once an issue is resolved.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-slate-800 mb-3">Contact</h2>
            <p>Reach us at <a href="mailto:hello@overseasnursing.com" className="text-primary hover:underline font-medium">hello@overseasnursing.com</a>. See our machine-readable <a href="/.well-known/security.txt" className="text-primary hover:underline font-medium">security.txt</a> for the canonical contact record.</p>
          </section>

        </div>
      </div>
    </div>
  )
}
