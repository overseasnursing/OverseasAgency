import React from 'react'
import { getAllReviewsAdmin } from '@/lib/db/reviews'
import { approveReview, rejectReview, holdReview, removeReview } from '@/app/actions/moderate'
import { requirePermission } from '@/lib/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { Star, CheckCircle, XCircle, Clock, Trash2, MapPin, Building2 } from 'lucide-react'

const PAGE_SIZE = 20

export const dynamic = 'force-dynamic'

const STATUS_TABS = [
  { key: 'all',      label: 'All' },
  { key: 'pending',  label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  approved: { label: 'Approved', className: 'bg-[#DCFCE7] text-[#166534]' },
  pending:  { label: 'Pending',  className: 'bg-[#FEF9C3] text-[#854D0E]' },
  rejected: { label: 'Rejected', className: 'bg-[#FEE2E2] text-[#B91C1C]' },
}

interface PageProps {
  searchParams: Promise<{ status?: string; agency?: string; page?: string }>
}

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  await requirePermission('reviews')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { status = 'all', agency = '', page: pageStr = '1' } = await searchParams
  const page = Math.max(1, Number(pageStr) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to   = from + PAGE_SIZE - 1

  // Paginated reviews for current filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pagedQuery: any = db
    .from('reviews')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
  if (status !== 'all') pagedQuery = pagedQuery.eq('status', status)
  if (agency) pagedQuery = pagedQuery.eq('agency_slug', agency)
  const { data: reviews, count: filteredCount } = await pagedQuery

  const totalPages = Math.ceil((filteredCount ?? 0) / PAGE_SIZE)

  // All reviews for counts + agency filter options (no pagination)
  const allReviews = await getAllReviewsAdmin('all')
  const agencyOptions = Array.from(
    new Map(allReviews.map(r => [r.agency_slug, r.agency_name])).entries()
  ).sort((a, b) => (a[1] ?? '').localeCompare(b[1] ?? ''))

  const counts: Record<string, number> = { all: allReviews.length }
  for (const r of allReviews) {
    counts[r.status ?? 'pending'] = (counts[r.status ?? 'pending'] ?? 0) + 1
  }

  function buildHref(p: number) {
    const params = new URLSearchParams()
    params.set('status', status)
    if (agency) params.set('agency', agency)
    params.set('page', String(p))
    return `/admin/reviews?${params}`
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 mb-1">Reviews</h1>
          <p className="text-[13px] text-slate-500">
            {filteredCount ?? 0} review{(filteredCount ?? 0) !== 1 ? 's' : ''} {status !== 'all' ? `· ${status}` : ''}
            {agency ? ` · ${agencyOptions.find(([s]) => s === agency)?.[1] ?? agency}` : ''}
          </p>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 self-start">
          {STATUS_TABS.map(tab => (
            <a
              key={tab.key}
              href={`/admin/reviews?status=${tab.key}${agency ? `&agency=${agency}` : ''}&page=1`}
              className={`px-3 py-1.5 text-[12.5px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
                status === tab.key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {counts[tab.key] !== undefined && (
                <span className="ml-1.5 text-[11px] text-slate-400">{counts[tab.key]}</span>
              )}
            </a>
          ))}
        </div>

        {/* Agency filter */}
        <form method="get" action="/admin/reviews" className="flex items-center gap-2">
          <input type="hidden" name="status" value={status} />
          <select
            name="agency"
            defaultValue={agency}
            onChange={undefined}
            className="h-9 pl-3 pr-8 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
          >
            <option value="">All Agencies</option>
            {agencyOptions.map(([slug, name]) => (
              <option key={slug} value={slug ?? ''}>{name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="h-9 px-3 text-[12.5px] font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl transition-colors"
          >
            Filter
          </button>
          {agency && (
            <a
              href={`/admin/reviews?status=${status}`}
              className="h-9 px-3 flex items-center text-[12.5px] font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl transition-colors"
            >
              Clear
            </a>
          )}
        </form>
      </div>

      {/* Review list */}
      {!reviews?.length ? (
        <div className="text-center py-16 text-slate-400 text-[14px]">No reviews found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review: {
            id: string; agency_name: string | null; agency_slug: string | null
            status: string | null; created_at: string | null; author_name: string | null
            overall_rating: number | null; author_from: string | null; country_placed: string | null
            actual_cost_paid: string | null; timeline_months: number | null; recommends: boolean | null
            review_text: string | null; surprise_charges: string | null; reject_reason: string | null
          }) => {
            const badge = STATUS_BADGE[review.status ?? 'pending'] ?? STATUS_BADGE.pending
            return (
              <div key={review.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5">
                  {/* Top row: agency + status + date */}
                  <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1.5 text-[13px] font-bold text-slate-800">
                        <Building2 size={13} className="text-slate-400" />
                        {review.agency_name}
                      </span>
                      <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-400">
                      {new Date(review.created_at ?? '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Author + rating row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-bold text-primary">
                        {review.author_name?.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">{review.author_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={11}
                              className={i < (review.overall_rating ?? 0) ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-slate-200 fill-slate-200'}
                            />
                          ))}
                        </div>
                        <span className="text-[11.5px] text-slate-400">{review.overall_rating}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Meta chips */}
                  <div className="flex flex-wrap gap-2 text-[11.5px] text-slate-500 mb-3">
                    {review.author_from && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full">
                        <MapPin size={10} /> {review.author_from}
                      </span>
                    )}
                    {review.country_placed && (
                      <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full">
                        → {review.country_placed}
                      </span>
                    )}
                    {review.actual_cost_paid && (
                      <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full">
                        {review.actual_cost_paid}
                      </span>
                    )}
                    {review.timeline_months && (
                      <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full">
                        {review.timeline_months} mo.
                      </span>
                    )}
                    {review.recommends && (
                      <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#166534] rounded-full font-medium">
                        Recommends
                      </span>
                    )}
                  </div>

                  {/* Review text */}
                  <p className="text-[13.5px] text-slate-700 leading-relaxed mb-3">
                    {review.review_text}
                  </p>

                  {/* Surprise charges */}
                  {review.surprise_charges && (
                    <div className="bg-[#FFF5F5] border border-[#FECACA] rounded-xl px-4 py-2.5 mb-3">
                      <p className="text-[11.5px] font-semibold text-red-700 mb-0.5">Surprise charges noted</p>
                      <p className="text-[12.5px] text-red-700">{review.surprise_charges}</p>
                    </div>
                  )}

                  {/* Reject reason if present */}
                  {review.reject_reason && (
                    <p className="text-[12px] text-slate-400 mt-1">
                      Reject reason: <span className="text-slate-600">{review.reject_reason}</span>
                    </p>
                  )}
                </div>

                {/* Action bar */}
                <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center gap-2 flex-wrap">
                  {review.status !== 'approved' && (
                    <form action={async () => { 'use server'; await approveReview(review.id) }}>
                      <button type="submit" className="flex items-center gap-1.5 h-8 px-3.5 bg-[#166534] hover:bg-[#14532d] text-white text-[12px] font-semibold rounded-lg transition-colors">
                        <CheckCircle size={12} /> Approve
                      </button>
                    </form>
                  )}
                  {review.status !== 'pending' && (
                    <form action={async () => { 'use server'; await holdReview(review.id) }}>
                      <button type="submit" className="flex items-center gap-1.5 h-8 px-3.5 border border-[#D97706] text-[#92400E] hover:bg-[#FEF3C7] text-[12px] font-semibold rounded-lg transition-colors">
                        <Clock size={12} /> Hold
                      </button>
                    </form>
                  )}
                  {review.status !== 'rejected' && (
                    <form action={async () => { 'use server'; await rejectReview(review.id, 'Does not meet guidelines') }}>
                      <button type="submit" className="flex items-center gap-1.5 h-8 px-3.5 border border-red-200 text-red-600 hover:bg-red-50 text-[12px] font-semibold rounded-lg transition-colors">
                        <XCircle size={12} /> Reject
                      </button>
                    </form>
                  )}
                  <form action={async () => { 'use server'; await removeReview(review.id) }}>
                    <button type="submit" className="flex items-center gap-1.5 h-8 px-3.5 border border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-600 text-[12px] font-semibold rounded-lg transition-colors ml-auto">
                      <Trash2 size={12} /> Delete
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={filteredCount ?? 0}
        pageSize={PAGE_SIZE}
        buildHref={buildHref}
        itemLabel="reviews"
      />
    </div>
  )
}
