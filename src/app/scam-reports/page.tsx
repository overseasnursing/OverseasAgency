import React from 'react'
import type { Metadata } from 'next'
import { AlertTriangle, XCircle, ShieldCheck, FileText } from 'lucide-react'
import { getAllScamReports, getScamReportStats } from '@/lib/data/scamReports'
import { fetchAgenciesForSearch } from '@/lib/data/fetchAgencies'
import { ScamReportsListClient } from './ScamReportsListClient'
import { ScamAgencySearch } from './_components/ScamAgencySearch'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Overseas Nursing Agency Scam Reports — Verified Fraud Incidents | OverseasNursing.com',
  description:
    'Verified scam and fraud reports against overseas nursing recruitment agencies in India. Read full incident details, warning signs, and lessons from affected nurses.',
  alternates: { canonical: '/scam-reports' },
  openGraph: {
    title: 'Overseas Nursing Agency Scam Reports',
    description: 'Verified fraud reports against nursing agencies with full incident details and warning signs.',
    url: '/scam-reports',
    type: 'website',
    images: [{ url: '/api/og?type=default&title=Scam+Reports', width: 1200, height: 630, alt: 'Scam Reports — OverseasNursing.com' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Overseas Nursing Agency Scam Reports',
    description: 'Verified fraud reports against nursing agencies with full incident details and warning signs.',
    images: ['/api/og?type=default&title=Scam+Reports'],
  },
}

export default async function ScamReportsPage() {
  const stats     = getScamReportStats()
  const reports   = getAllScamReports()
  const agencies  = await fetchAgenciesForSearch(200)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://overseasnursing.com/' },
      { '@type': 'ListItem', position: 2, name: 'Scam Reports', item: 'https://overseasnursing.com/scam-reports' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero — calm protective tone */}
      <div className="relative bg-white border-b border-slate-200 overflow-hidden">
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #B91C1C 1.5px, transparent 1.5px)',
            backgroundSize: '26px 26px',
          }}
        />
        {/* Soft background gradient */}
        <div
          className="absolute top-0 right-0 w-[480px] h-[320px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(254,226,226,0.6) 0%, transparent 65%)' }}
        />

        <div className="relative max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Left: text */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#FEE2E2] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={18} className="text-[#B91C1C]" />
                </div>
                <p className="text-[12px] font-semibold text-[#B91C1C] uppercase tracking-widest">
                  Verified Scam Reports
                </p>
              </div>
              <h1 className="text-[36px] sm:text-[42px] font-bold text-slate-900 leading-tight mb-4">
                Agency Fraud Reports.<br />
                Documented. Verified. Public.
              </h1>
              <p className="text-[16px] text-slate-600 leading-relaxed max-w-[500px]">
                These reports are submitted by nurses who lost money to fraudulent agencies. Every incident includes a full timeline, warning signs missed, and lessons learned. All reports are verified by our team before publication.
              </p>

              {/* Agency scam search */}
              <ScamAgencySearch agencies={agencies} reports={reports} />
            </div>

            {/* Right: stat cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-[#FECACA] rounded-2xl p-5 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] flex items-center justify-center mb-2">
                  <FileText size={15} className="text-[#DC2626]" />
                </div>
                <p className="text-[28px] font-bold text-slate-800 leading-none">{stats.total}</p>
                <p className="text-[12px] text-slate-500 mt-1">Total verified reports</p>
              </div>
              <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-2xl p-5">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mb-2 shadow-sm">
                  <XCircle size={15} className="text-[#DC2626]" />
                </div>
                <p className="text-[28px] font-bold text-[#DC2626] leading-none">{stats.critical}</p>
                <p className="text-[12px] text-[#B91C1C]/70 mt-1">Critical severity</p>
              </div>
              <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-5">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mb-2 shadow-sm">
                  <AlertTriangle size={15} className="text-[#92400E]" />
                </div>
                <p className="text-[28px] font-bold text-[#92400E] leading-none">
                  ₹{(stats.totalLost / 100000).toFixed(1)}L
                </p>
                <p className="text-[12px] text-[#92400E]/70 mt-1">Reported losses (est.)</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] flex items-center justify-center mb-2">
                  <ShieldCheck size={15} className="text-[#166534]" />
                </div>
                <p className="text-[28px] font-bold text-slate-800 leading-none">{stats.agenciesReported}</p>
                <p className="text-[12px] text-slate-500 mt-1">Agencies reported</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[20px] font-bold text-slate-800 mb-1">All Scam Reports</h2>
                <p className="text-[13.5px] text-slate-500">Sorted by community helpfulness. Filter by type or severity.</p>
              </div>
              <a
                href="/scam-reports/submit"
                className="hidden sm:flex items-center h-9 px-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[13px] font-semibold rounded-xl transition-colors"
              >
                Report a Scam
              </a>
            </div>
            <ScamReportsListClient reports={reports} />
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-5 w-[272px] flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-5">
              {/* Report CTA */}
              <div className="bg-white border border-[#FECACA] rounded-2xl p-5">
                <h3 className="text-[15px] font-bold text-slate-800 mb-2">Were you scammed?</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-4">
                  Your report protects nurses who come after you. All reports are anonymized and verified before publication.
                </p>
                <a
                  href="/scam-reports/submit"
                  className="flex items-center justify-center h-10 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[13.5px] font-semibold rounded-xl transition-colors"
                >
                  Report a Scam
                </a>
              </div>

              {/* Red flags */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-[13px] font-bold text-slate-700 mb-3">Universal Red Flags</h3>
                <ul className="flex flex-col gap-2.5">
                  {[
                    'Fees not listed in a signed written agreement',
                    'Urgency pressure — "pay now or lose your spot"',
                    'Hospital offer letters before NMC/AHPRA registration',
                    'Agency cannot provide registration certificate or APSO membership',
                    'No traceable progress after 3+ months of payment',
                    'Case manager becomes unreachable without explanation',
                  ].map((flag, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12.5px] text-slate-500 leading-relaxed">
                      <XCircle size={12} className="text-[#DC2626] mt-0.5 flex-shrink-0" />
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emergency links */}
              <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-4">
                <p className="text-[13px] font-semibold text-[#92400E] mb-2">If you have been scammed</p>
                <ul className="flex flex-col gap-1.5 text-[12.5px] text-[#92400E]/80">
                  <li>• File an FIR at local police station</li>
                  <li>• Report to National Consumer Helpline: 1915</li>
                  <li>• File online at consumerhelpline.gov.in</li>
                  <li>• Report to cybercrime.gov.in for digital fraud</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
