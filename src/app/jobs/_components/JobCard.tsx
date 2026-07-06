import React from 'react'
import Link from 'next/link'
import { MapPin, Building2, Calendar, ChevronRight } from 'lucide-react'
import type { ActiveJobListing } from '@/lib/db/jobs'

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + '…'
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function JobCardImpl({ job }: { job: ActiveJobListing }) {
  return (
    <article className="bg-white rounded-card shadow-card hover:shadow-card-md border border-slate-100 transition-shadow flex flex-col p-4 gap-3">

      {/* Title */}
      <div className="flex items-start gap-3">
        {job.logo_url && (
          <div className="w-10 h-10 rounded-lg border border-slate-100 overflow-hidden flex-shrink-0 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={job.logo_url} alt={job.agency_name || job.title} loading="lazy" decoding="async" className="w-full h-full object-contain" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-bold text-slate-800 leading-tight line-clamp-2 mb-1.5">
            {job.title}
          </h2>
          <div className="flex items-center gap-1 text-[12px] text-slate-500">
            <MapPin size={11} className="flex-shrink-0" />
            <span>{[job.city, job.state, job.country].filter(Boolean).join(' · ')}</span>
          </div>
        </div>
      </div>

      {/* Agency + date */}
      <div className="flex items-center justify-between gap-2 text-[11.5px] text-slate-400">
        {job.agency_name ? (
          <span className="flex items-center gap-1 min-w-0">
            <Building2 size={11} className="flex-shrink-0" />
            <span className="truncate">{job.agency_name}</span>
          </span>
        ) : (
          <span />
        )}
        <span className="flex items-center gap-1 flex-shrink-0 ml-auto">
          <Calendar size={11} />
          {new Date(job.created_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </span>
      </div>

      {/* Badges */}
      {(job.job_type || job.salary_amount != null || job.experience_years != null) && (
        <div className="flex flex-wrap gap-1.5">
          {job.job_type && (
            <span className="px-2 py-0.5 bg-[#EFF6FF] text-[#1D4ED8] text-[11px] font-medium rounded-full">
              {job.job_type}
            </span>
          )}
          {job.salary_amount != null && (
            <span className="px-2 py-0.5 bg-[#F0FDF4] text-[#166534] text-[11px] font-medium rounded-full">
              {job.salary_currency ?? ''} {job.salary_amount.toLocaleString('en-IN')}
            </span>
          )}
          {job.experience_years != null && (
            <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#92400E] text-[11px] font-medium rounded-full">
              {job.experience_years}+ yrs
            </span>
          )}
        </div>
      )}

      {/* Description */}
      <p className="text-[12.5px] text-slate-500 leading-relaxed flex-1">
        {truncate(stripHtml(job.description), 140)}
      </p>

      {/* CTA */}
      <Link
        href={`/jobs/${job.slug}`}
        className="flex items-center justify-center gap-1 h-9 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors mt-auto"
      >
        View Job <ChevronRight size={14} />
      </Link>
    </article>
  )
}

// Memoized — JobsClient re-renders this card grid on every filter/search
// change; without this every card (and its stripHtml/date-formatting work)
// would re-run even when its own `job` prop hasn't changed.
export const JobCard = React.memo(JobCardImpl)
