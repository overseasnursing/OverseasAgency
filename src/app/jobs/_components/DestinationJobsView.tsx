import { JobCard } from './JobCard'
import type { ActiveJobListing } from '@/lib/db/jobs'

/** Shared listing shell for /jobs/[country], [country]/[city], and
 * [country]/[city]/[specialty] — avoids duplicating header/grid/empty-state
 * markup across the three destination-hierarchy route levels (Phase 7). */
export function DestinationJobsView({
  heading,
  subheading,
  breadcrumbItems,
  jobs,
  emptyMessage,
}: {
  heading: string
  subheading: string
  breadcrumbItems: { name: string; href: string }[]
  jobs: ActiveJobListing[]
  emptyMessage: string
}) {
  return (
    <>
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-7">
          <nav className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-3 flex-wrap" aria-label="Breadcrumb">
            {breadcrumbItems.map((item, i) => (
              <span key={item.href} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {i === breadcrumbItems.length - 1
                  ? <span className="text-slate-600">{item.name}</span>
                  : <a href={item.href} className="hover:text-slate-600 transition-colors">{item.name}</a>}
              </span>
            ))}
          </nav>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-slate-900 leading-tight">{heading}</h1>
          <p className="text-[14px] text-slate-400 mt-1.5">{subheading}</p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-10 bg-[#F8FAFC] min-h-screen">
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        ) : (
          <p className="text-[14px] text-slate-500 py-16 text-center">{emptyMessage}</p>
        )}
      </div>
    </>
  )
}
