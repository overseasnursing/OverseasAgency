import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  MapPin, Building2, Calendar,
  ArrowRight, BookOpen, ClipboardList,
  FileText, AlertCircle, ChevronRight, Star, ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getJobBySlugPublic, getSimilarJobs } from '@/lib/db/jobs'
import { hasUserApplied } from '@/lib/db/job-applications'
import { fetchAgenciesByCountry } from '@/lib/data/fetchAgencies'
import { buildBreadcrumbSchema } from '@/lib/seo/schemas'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { JobCard } from '../_components/JobCard'
import { ApplySection } from './ApplySection'
import type { Agency } from '@/types/agency'
import {
  normalizeCountry,
  EXAM_MAP,
  MOCK_TEST_MAP,
  GUIDE_MAP,
  type CountryLink,
} from './_data/countryMappings'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const job = await getJobBySlugPublic(slug)
  if (!job) return {}
  return {
    title: `${job.title} - ${job.country} Nursing Job`,
    description: `Apply for ${job.title} nursing opportunities in ${job.country}.`,
    alternates: { canonical: `/jobs/${slug}` },
    openGraph: {
      title: `${job.title} - ${job.country} Nursing Job`,
      description: `Apply for ${job.title} nursing opportunities in ${job.country}.`,
      url: `https://overseasnursing.com/jobs/${slug}`,
    },
  }
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-[12px] text-slate-400 w-28 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-[13px] font-semibold text-slate-700">{value}</span>
    </div>
  )
}

function LinkCard({
  item,
  iconBg,
  Icon,
  iconColor,
}: {
  item: CountryLink
  iconBg: string
  Icon: React.ElementType
  iconColor: string
}) {
  return (
    <a
      href={item.href}
      className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:border-primary/30 hover:shadow-card transition-all group"
    >
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={16} className={iconColor} />
      </div>
      <span className="text-[13px] font-semibold text-slate-700 group-hover:text-primary transition-colors leading-snug">
        {item.name}
      </span>
      <ChevronRight size={13} className="text-slate-300 ml-auto flex-shrink-0" />
    </a>
  )
}

function AgencyMiniCard({ agency }: { agency: Agency }) {
  const initials = agency.name.split(' ').slice(0, 2).map((w) => w[0]).join('')
  return (
    <a
      href={`/agency/${agency.slug}`}
      className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:border-primary/30 hover:shadow-card transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {agency.logo ? (
          <img src={agency.logo} alt={agency.name} className="w-full h-full object-contain" />
        ) : (
          <span className="text-[13px] font-bold text-primary">{initials}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
          {agency.name}
        </p>
        <p className="text-[12px] text-slate-400 truncate">{agency.location}</p>
      </div>
      <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
    </a>
  )
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const job = await getJobBySlugPublic(slug)
  if (!job) notFound()

  const isExpired = job.status === 'expired'
  const isLoggedIn = !!user
  const appliedStatus = isLoggedIn ? await hasUserApplied(job.id, user.id) : false

  const countryKey = normalizeCountry(job.country)
  const exams      = EXAM_MAP[countryKey]      ?? []
  const mockTests  = MOCK_TEST_MAP[countryKey] ?? []
  const guides     = GUIDE_MAP[countryKey]     ?? []

  const [similarJobs, countryAgencies] = await Promise.all([
    getSimilarJobs(job.country, job.id, 6),
    fetchAgenciesByCountry([job.country], 3),
  ])

  const breadcrumbs = buildBreadcrumbSchema([
    { name: 'Home',             href: '/' },
    { name: 'Jobs',             href: '/jobs' },
    { name: job.title,          href: `/jobs/${slug}` },
  ])

  const postedDate = new Date(job.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <>
      <MultiJsonLd schemas={[breadcrumbs]} />

      <div className="bg-[#F8FAFC] min-h-screen">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-6" aria-label="Breadcrumb">
            <a href="/" className="hover:text-slate-600 transition-colors">Home</a>
            <span>/</span>
            <a href="/jobs" className="hover:text-slate-600 transition-colors">Jobs</a>
            <span>/</span>
            <span className="text-slate-600 line-clamp-1">{job.title}</span>
          </nav>

          {/* ── SECTION 1: Job Details ── */}
          <div className="grid lg:grid-cols-3 gap-6 mb-14">

            {/* Left: title + description */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Expired banner */}
              {isExpired && (
                <div className="flex items-start gap-3 px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl">
                  <AlertCircle size={16} className="text-slate-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[13.5px] text-slate-600">
                    This job has expired and is no longer accepting applications.
                  </p>
                </div>
              )}

              {/* Title card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-3">
                  {job.logo_url && (
                    <div className="w-14 h-14 rounded-xl border border-slate-100 overflow-hidden flex-shrink-0 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={job.logo_url} alt="" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {job.job_type && (
                      <span className="px-2.5 py-0.5 bg-[#EFF6FF] text-[#1D4ED8] text-[11.5px] font-semibold rounded-full">
                        {job.job_type}
                      </span>
                    )}
                    {job.salary_amount != null && (
                      <span className="px-2.5 py-0.5 bg-[#F0FDF4] text-[#166534] text-[11.5px] font-semibold rounded-full">
                        {job.salary_currency ?? ''} {job.salary_amount.toLocaleString('en-IN')}
                      </span>
                    )}
                    {isExpired && (
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-[11.5px] font-semibold rounded-full">
                        Expired
                      </span>
                    )}
                  </div>
                </div>

                <h1 className="text-[24px] sm:text-[28px] font-bold text-slate-900 leading-tight mb-4">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="flex-shrink-0" />
                    {[job.city, job.state, job.country].filter(Boolean).join(' · ')}
                  </span>
                  {job.agency_name && (
                    <span className="flex items-center gap-1.5">
                      <Building2 size={13} className="flex-shrink-0" />
                      {job.agency_slug ? (
                        <a
                          href={`/agency/${job.agency_slug}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {job.agency_name}
                        </a>
                      ) : (
                        job.agency_name
                      )}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="flex-shrink-0" />
                    Posted {postedDate}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-[17px] font-bold text-slate-800 mb-4">About this Role</h2>
                <div
                  className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-[22px] prose-h2:text-[18px] prose-h3:text-[15px] prose-p:text-[14px] prose-p:leading-relaxed prose-li:text-[14px] prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>

              {/* Posted By */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-[17px] font-bold text-slate-800 mb-4">Posted By</h2>
                {job.agency_name ? (
                  <a
                    href={job.agency_slug ? `/agency/${job.agency_slug}` : '#'}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 bg-white flex items-center justify-center">
                      {job.agency_logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={job.agency_logo_url} alt={job.agency_name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[15px] font-bold text-primary">
                          {job.agency_name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                        {job.agency_name}
                      </p>
                      {job.agency_review_count > 0 ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                size={12}
                                fill={i <= Math.round(job.agency_rating ?? 0) ? '#F59E0B' : '#E2E8F0'}
                                className={i <= Math.round(job.agency_rating ?? 0) ? 'text-[#F59E0B]' : 'text-slate-200'}
                              />
                            ))}
                          </div>
                          <span className="text-[13px] font-bold text-slate-800">{(job.agency_rating ?? 0).toFixed(1)}</span>
                          <span className="text-[12px] text-slate-400">({job.agency_review_count})</span>
                        </div>
                      ) : job.agency_google_rating ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                size={12}
                                fill={i <= Math.round(job.agency_google_rating ?? 0) ? '#F59E0B' : '#E2E8F0'}
                                className={i <= Math.round(job.agency_google_rating ?? 0) ? 'text-[#F59E0B]' : 'text-slate-200'}
                              />
                            ))}
                          </div>
                          <span className="text-[13px] font-bold text-slate-800">{job.agency_google_rating.toFixed(1)}</span>
                          <span className="text-[12px] text-slate-400">({job.agency_google_review_count} Google)</span>
                        </div>
                      ) : (
                        <p className="text-[12px] text-slate-400 mt-1">No reviews yet</p>
                      )}
                    </div>
                    <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
                  </a>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 bg-white flex items-center justify-center p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logo.png" alt="OverseasNursing" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-slate-800 leading-tight">OverseasNursing</p>
                      <p className="text-[12.5px] text-slate-500 leading-relaxed mt-1">
                        Helping nurses safely navigate overseas migration — reviews, pricing, and scam protection.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: quick facts + apply */}
            <div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:sticky lg:top-[92px]">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-3">
                  Job Overview
                </h3>

                <div className="mb-5">
                  <QuickFact label="Country"    value={job.country} />
                  {job.state              && <QuickFact label="State"      value={job.state} />}
                  {job.city               && <QuickFact label="City"       value={job.city} />}
                  {job.job_type           && <QuickFact label="Job Type"   value={job.job_type} />}
                  {job.experience_years != null && <QuickFact label="Experience" value={`${job.experience_years}+ years`} />}
                  {job.salary_amount != null && (
                    <QuickFact label="Salary" value={`${job.salary_currency ?? ''} ${job.salary_amount.toLocaleString('en-IN')}`} />
                  )}
                  <QuickFact label="Posted"    value={postedDate} />
                </div>

                {job.apply_type === 'redirect' && job.redirect_url && !isExpired ? (
                  <a
                    href={job.redirect_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 h-11 w-full bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors"
                  >
                    Apply Now <ExternalLink size={15} />
                  </a>
                ) : (
                  <ApplySection
                    jobId={job.id}
                    jobSlug={slug}
                    isExpired={isExpired}
                    isLoggedIn={isLoggedIn}
                    hasApplied={appliedStatus}
                    userEmail={user?.email ?? ''}
                  />
                )}
              </div>
            </div>
          </div>

          {/* ── SECTION 2: Similar Jobs ── */}
          {similarJobs.length > 0 && (
            <section className="mb-14">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[20px] font-bold text-slate-800">
                  Similar Jobs in {job.country}
                </h2>
                <a
                  href={`/jobs?country=${encodeURIComponent(job.country)}`}
                  className="text-[13px] font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight size={13} />
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {similarJobs.map((j) => (
                  <JobCard key={j.id} job={j} />
                ))}
              </div>
            </section>
          )}

          {/* ── SECTION 3: Related Nursing Exams ── */}
          {exams.length > 0 && (
            <section className="mb-14">
              <h2 className="text-[20px] font-bold text-slate-800 mb-2">
                Required Exams for {job.country}
              </h2>
              <p className="text-[13.5px] text-slate-500 mb-5">
                Certifications and exams you will need to practice nursing in {job.country}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {exams.map((item) => (
                  <LinkCard
                    key={item.name}
                    item={item}
                    iconBg="bg-[#EFF6FF]"
                    Icon={BookOpen}
                    iconColor="text-[#1D4ED8]"
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── SECTION 4: Mock Tests ── */}
          {mockTests.length > 0 && (
            <section className="mb-14">
              <h2 className="text-[20px] font-bold text-slate-800 mb-2">
                Mock Tests for {job.country}
              </h2>
              <p className="text-[13.5px] text-slate-500 mb-5">
                Practice with free mock tests to prepare for your nursing exams.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mockTests.map((item) => (
                  <LinkCard
                    key={item.name}
                    item={item}
                    iconBg="bg-[#F0FDF4]"
                    Icon={ClipboardList}
                    iconColor="text-[#166534]"
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── SECTION 5: Related Agencies ── */}
          {countryAgencies.length > 0 && (
            <section className="mb-14">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[20px] font-bold text-slate-800">
                  Agencies Recruiting for {job.country}
                </h2>
                <a
                  href={`/agencies?country=${encodeURIComponent(job.country)}`}
                  className="text-[13px] font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight size={13} />
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {countryAgencies.map((agency) => (
                  <AgencyMiniCard key={agency.id} agency={agency} />
                ))}
              </div>
            </section>
          )}

          {/* ── SECTION 6: Country Guides ── */}
          {guides.length > 0 && (
            <section className="mb-8">
              <h2 className="text-[20px] font-bold text-slate-800 mb-2">
                {job.country} Nursing Guides
              </h2>
              <p className="text-[13.5px] text-slate-500 mb-5">
                Everything you need to know about nursing migration to {job.country}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {guides.map((item) => (
                  <LinkCard
                    key={item.name}
                    item={item}
                    iconBg="bg-[#F3E8FF]"
                    Icon={FileText}
                    iconColor="text-[#7E22CE]"
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  )
}
