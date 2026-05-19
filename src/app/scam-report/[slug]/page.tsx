import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  AlertTriangle,
  XCircle,
  ThumbsUp,
  ShieldCheck,
  Clock,
  DollarSign,
  FileText,
  Lightbulb,
} from 'lucide-react'
import { getAllScamReports, getScamReport } from '@/lib/data/scamReports'
import { SeverityBadge, CategoryBadge } from '@/components/trust/TrustBadges'
import { ScamReportCard } from '@/components/scam/ScamReportCard'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllScamReports().map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const report = getScamReport(slug)
  if (!report) return {}

  const title = `${report.title} — Scam Report | OverseasNursing.com`
  const description = `${report.summary} Reported by ${report.reporterName} from ${report.reporterFrom}. ₹${(report.amountLost / 100000).toFixed(1)}L lost.`

  return {
    title,
    description,
    alternates: { canonical: `/scam-report/${slug}` },
    openGraph: {
      title,
      description,
      url: `/scam-report/${slug}`,
      type: 'article',
      images: [{ url: '/og/scam-reports.png', width: 1200, height: 630, alt: 'Scam Report — OverseasNursing.com' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og/scam-reports.png'] },
  }
}

export default async function ScamReportPage({ params }: PageProps) {
  const { slug } = await params
  const report = getScamReport(slug)
  if (!report) notFound()

  const all = getAllScamReports()
  const related = report.relatedReportSlugs
    .map((s) => all.find((r) => r.slug === s))
    .filter(Boolean) as typeof all

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://overseasnursing.com/' },
      { '@type': 'ListItem', position: 2, name: 'Scam Reports', item: 'https://overseasnursing.com/scam-reports' },
      { '@type': 'ListItem', position: 3, name: report.title, item: `https://overseasnursing.com/scam-report/${slug}` },
    ],
  }

  const borderColor =
    report.severity === 'critical'
      ? 'border-[#FCA5A5]'
      : report.severity === 'high'
      ? 'border-[#FDE68A]'
      : 'border-slate-200'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Severity banner */}
      {report.severity === 'critical' && (
        <div className="bg-[#DC2626] text-white">
          <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
            <AlertTriangle size={15} className="flex-shrink-0" />
            <p className="text-[13px] font-medium">
              Critical severity — {report.resolved ? 'resolved' : 'this agency may still be operating'}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Main */}
          <main className="flex-1 min-w-0 flex flex-col gap-8">
            {/* Report header */}
            <div className={`bg-white border ${borderColor} rounded-2xl p-6`}>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <SeverityBadge severity={report.severity} />
                <CategoryBadge category={report.category} />
                {report.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D4ED8] bg-[#DBEAFE] px-2 py-0.5 rounded-full">
                    <ShieldCheck size={11} /> Verified Report
                  </span>
                )}
                {!report.resolved && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#991B1B] bg-[#FEE2E2] px-2 py-0.5 rounded-full">
                    <XCircle size={11} /> Unresolved
                  </span>
                )}
              </div>

              <p className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                {report.agencyName}
              </p>
              <h1 className="text-[22px] sm:text-[26px] font-bold text-slate-900 leading-snug mb-4">
                {report.title}
              </h1>

              {/* Reporter */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-[#FEE2E2] flex items-center justify-center flex-shrink-0">
                  <span className="text-[13px] font-bold text-[#DC2626]">{report.reporterInitials}</span>
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold text-slate-800">{report.reporterName}</p>
                  <p className="text-[12px] text-slate-400">{report.reporterFrom} · {report.displayDate}</p>
                </div>
              </div>

              {/* Key figures */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#FFF5F5] rounded-xl p-4">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-0.5">Amount Lost</p>
                  <p className="text-[20px] font-bold text-[#DC2626]">₹{(report.amountLost / 100000).toFixed(1)}L</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-0.5">Total Paid</p>
                  <p className="text-[20px] font-bold text-slate-700">₹{(report.amountPaid / 100000).toFixed(1)}L</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-0.5">Country Promised</p>
                  <p className="text-[16px] font-semibold text-slate-700">{report.countryPromised}{report.cityPromised ? `, ${report.cityPromised}` : ''}</p>
                </div>
                {report.amountRecovered > 0 && (
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-0.5">Recovered</p>
                    <p className="text-[16px] font-semibold text-[#166534]">₹{(report.amountRecovered / 100000).toFixed(1)}L</p>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="text-[18px] font-bold text-slate-800 mb-3">Summary</h2>
              <p className="text-[14.5px] text-slate-600 leading-relaxed">{report.summary}</p>
            </section>

            {/* Full incident */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={16} className="text-slate-400" />
                <h2 className="text-[18px] font-bold text-slate-800">Full Incident</h2>
              </div>
              <div className="text-[14px] text-slate-600 leading-[1.8] whitespace-pre-line">
                {report.fullIncident}
              </div>
            </section>

            {/* Timeline */}
            {report.timelineEvents.length > 0 && (
              <section className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Clock size={16} className="text-slate-400" />
                  <h2 className="text-[18px] font-bold text-slate-800">Incident Timeline</h2>
                </div>
                <div className="flex flex-col gap-0">
                  {report.timelineEvents.map((event, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626] mt-1 flex-shrink-0" />
                        {i < report.timelineEvents.length - 1 && (
                          <div className="w-px flex-1 bg-slate-200 my-1" />
                        )}
                      </div>
                      <div className="pb-5">
                        <p className="text-[12px] font-semibold text-[#DC2626] mb-0.5">{event.date}</p>
                        <p className="text-[13.5px] text-slate-700 leading-relaxed">{event.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Warning signs */}
            {report.warningSignsMissed.length > 0 && (
              <section className="bg-[#FFF5F5] border border-[#FECACA] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={16} className="text-[#DC2626]" />
                  <h2 className="text-[18px] font-bold text-slate-800">Warning Signs Missed</h2>
                </div>
                <p className="text-[13px] text-slate-500 mb-4">
                  The reporter identified these red flags in retrospect. Learn to recognize them before signing anything.
                </p>
                <ul className="flex flex-col gap-3">
                  {report.warningSignsMissed.map((warning, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <XCircle size={14} className="text-[#DC2626] mt-0.5 flex-shrink-0" />
                      <span className="text-[13.5px] text-slate-700 leading-relaxed">{warning}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Lessons learned */}
            {report.lessonsLearned.length > 0 && (
              <section className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={16} className="text-[#166534]" />
                  <h2 className="text-[18px] font-bold text-slate-800">Lessons Learned</h2>
                </div>
                <ul className="flex flex-col gap-3">
                  {report.lessonsLearned.map((lesson, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <ShieldCheck size={14} className="text-[#166534] mt-0.5 flex-shrink-0" />
                      <span className="text-[13.5px] text-slate-700 leading-relaxed">{lesson}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Emotional experience */}
            {report.emotionalExperience && (
              <section className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-[18px] font-bold text-slate-800 mb-3">In Their Own Words</h2>
                <blockquote className="border-l-4 border-[#DC2626] pl-4 text-[14.5px] text-slate-600 italic leading-relaxed">
                  {report.emotionalExperience}
                </blockquote>
              </section>
            )}

            {/* Resolution / agency response */}
            {(report.resolved || report.resolutionNote || report.agencyResponse) && (
              <section className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-[18px] font-bold text-slate-800 mb-4">Status & Response</h2>
                {report.resolved && report.resolutionNote && (
                  <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4 mb-4">
                    <p className="text-[12px] font-semibold text-[#166534] mb-1">Resolved</p>
                    <p className="text-[13.5px] text-[#166534]/80 leading-relaxed">{report.resolutionNote}</p>
                  </div>
                )}
                {!report.resolved && (
                  <div className="bg-[#FFF5F5] border border-[#FECACA] rounded-xl p-4 mb-4">
                    <p className="text-[12px] font-semibold text-[#DC2626] mb-1">Unresolved</p>
                    <p className="text-[13px] text-[#DC2626]/80">This case has not been resolved. The reporter has not recovered their money.</p>
                  </div>
                )}
                {report.agencyResponse && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-[12px] font-semibold text-slate-500 mb-1">Agency Response</p>
                    <p className="text-[13.5px] text-slate-600 italic leading-relaxed">{report.agencyResponse}</p>
                  </div>
                )}
              </section>
            )}

            {/* Helpful + report another */}
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl">
              <div className="flex items-center gap-2 text-[13px] text-slate-500">
                <ThumbsUp size={14} />
                {report.helpful} nurses found this report helpful
              </div>
              <a
                href="/scam-reports/submit"
                className="text-[13px] font-semibold text-[#DC2626] hover:underline"
              >
                Report your experience →
              </a>
            </div>

            {/* Related reports */}
            {related.length > 0 && (
              <section>
                <h2 className="text-[20px] font-bold text-slate-800 mb-2">Related Reports</h2>
                <p className="text-[13.5px] text-slate-500 mb-5">Other reports involving the same agency.</p>
                <div className="flex flex-col gap-4">
                  {related.map((r) => (
                    <ScamReportCard key={r.id} report={r} />
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-5 w-[272px] flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-5">
              {/* Quick facts */}
              <div className={`bg-white border ${borderColor} rounded-2xl p-5`}>
                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Report Summary</p>
                <div className="flex flex-col gap-2.5 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Agency</span>
                    <span className="font-semibold text-slate-700 text-right ml-4">{report.agencyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Country</span>
                    <span className="font-semibold text-slate-700">{report.countryPromised}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount lost</span>
                    <span className="font-bold text-[#DC2626]">₹{(report.amountLost / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status</span>
                    <span className={`font-semibold ${report.resolved ? 'text-[#166534]' : 'text-[#DC2626]'}`}>
                      {report.resolved ? 'Resolved' : 'Unresolved'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Evidence</span>
                    <span className="font-semibold text-slate-700">{report.evidenceCount} items</span>
                  </div>
                </div>
              </div>

              {/* Emergency */}
              <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-4">
                <p className="text-[13px] font-semibold text-[#92400E] mb-2">If this happened to you</p>
                <ul className="flex flex-col gap-1.5 text-[12px] text-[#92400E]/80">
                  <li>• File FIR at local police</li>
                  <li>• Consumer Helpline: 1915</li>
                  <li>• consumerhelpline.gov.in</li>
                  <li>• cybercrime.gov.in</li>
                </ul>
              </div>

              {/* Report CTA */}
              <div className="flex flex-col gap-2.5">
                <a
                  href="/scam-reports/submit"
                  className="flex items-center justify-center h-10 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[13px] font-semibold rounded-xl transition-colors"
                >
                  Report Your Experience
                </a>
                <a
                  href="/scam-reports"
                  className="flex items-center justify-center h-10 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13px] font-medium rounded-xl transition-colors"
                >
                  All Scam Reports
                </a>
                <a
                  href="/reviews"
                  className="flex items-center justify-center h-10 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13px] font-medium rounded-xl transition-colors"
                >
                  Read Verified Reviews
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
