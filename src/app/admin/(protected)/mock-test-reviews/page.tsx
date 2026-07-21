import { revalidatePath } from 'next/cache'
import { Star, CheckCircle, XCircle, Trash2, MapPin, BookOpen } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { requirePermission } from '@/lib/require-admin'

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

// ── Server actions ────────────────────────────────────────────────────────

async function setStatus(id: string, status: string, locationSlug: string, categorySlug: string) {
  'use server'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  await db.from('mock_test_reviews').update({ status }).eq('id', id)
  revalidatePath(`/mock-tests/${locationSlug}/${categorySlug}`)
  revalidatePath('/admin/mock-test-reviews')
}

async function deleteReview(id: string, locationSlug: string, categorySlug: string) {
  'use server'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  await db.from('mock_test_reviews').delete().eq('id', id)
  revalidatePath(`/mock-tests/${locationSlug}/${categorySlug}`)
  revalidatePath('/admin/mock-test-reviews')
}

// ── Page ─────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function MockTestReviewsAdmin({ searchParams }: PageProps) {
  await requirePermission('mock-tests')
  const { status = 'pending' } = await searchParams

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Fetch reviews joined with category + location slugs
  const query = db
    .from('mock_test_reviews')
    .select(`
      id, reviewer_name, reviewer_country, rating,
      review_title, review_text, status, created_at,
      mock_test_categories!inner (
        id, name, slug,
        mock_test_locations!inner ( slug )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(200)

  if (status !== 'all') query.eq('status', status)

  const { data: rows } = await query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviews = (rows ?? []) as any[]

  // Counts for tab badges (count-only, zero row payload)
  const [allCount, pendingCount, approvedCount, rejectedCount] = await Promise.all([
    db.from('mock_test_reviews').select('*', { count: 'exact', head: true }),
    db.from('mock_test_reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('mock_test_reviews').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    db.from('mock_test_reviews').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
  ])
  const counts: Record<string, number> = {
    all:      allCount.count      ?? 0,
    pending:  pendingCount.count  ?? 0,
    approved: approvedCount.count ?? 0,
    rejected: rejectedCount.count ?? 0,
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-slate-900 mb-1">Exam Reviews</h1>
        <p className="text-[13px] text-slate-500">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}{status !== 'all' ? ` · ${status}` : ''}
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 self-start">
        {STATUS_TABS.map(tab => (
          <a
            key={tab.key}
            href={`/admin/mock-test-reviews?status=${tab.key}`}
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

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-[14px]">No reviews found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => {
            const badge   = STATUS_BADGE[review.status] ?? STATUS_BADGE.pending
            const cat     = review.mock_test_categories
            const locSlug = cat?.mock_test_locations?.slug ?? ''
            const catSlug = cat?.slug ?? ''
            const initials = (review.reviewer_name as string)
              .split(' ').slice(0, 2).map((w: string) => w[0] ?? '').join('').toUpperCase()

            return (
              <div key={review.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1.5 text-[13px] font-bold text-slate-800">
                        <BookOpen size={13} className="text-slate-400" />
                        {cat?.name ?? 'Unknown Exam'}
                      </span>
                      <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-400">
                      {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Author + rating */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-bold text-primary">{initials}</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">{review.reviewer_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11}
                              className={i < review.rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-slate-200 fill-slate-200'}
                            />
                          ))}
                        </div>
                        <span className="text-[11.5px] text-slate-400">{review.rating}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Country */}
                  {review.reviewer_country && (
                    <div className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-2">
                      <MapPin size={11} /> {review.reviewer_country}
                    </div>
                  )}

                  {/* Review title */}
                  {review.review_title && (
                    <p className="text-[14px] font-semibold text-slate-800 mb-1.5">
                      &ldquo;{review.review_title}&rdquo;
                    </p>
                  )}

                  {/* Review text */}
                  {review.review_text && (
                    <p className="text-[13.5px] text-slate-700 leading-relaxed">
                      {review.review_text}
                    </p>
                  )}

                  {/* Category link */}
                  {locSlug && catSlug && (
                    <a
                      href={`/mock-tests/${locSlug}/${catSlug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 mt-2 text-[11.5px] text-primary hover:underline"
                    >
                      View exam page →
                    </a>
                  )}
                </div>

                {/* Action bar */}
                <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center gap-2 flex-wrap">
                  {review.status !== 'approved' && (
                    <form action={setStatus.bind(null, review.id, 'approved', locSlug, catSlug)}>
                      <button type="submit" className="flex items-center gap-1.5 h-8 px-3.5 bg-[#166534] hover:bg-[#14532d] text-white text-[12px] font-semibold rounded-lg transition-colors">
                        <CheckCircle size={12} /> Approve
                      </button>
                    </form>
                  )}
                  {review.status !== 'rejected' && (
                    <form action={setStatus.bind(null, review.id, 'rejected', locSlug, catSlug)}>
                      <button type="submit" className="flex items-center gap-1.5 h-8 px-3.5 border border-red-200 text-red-600 hover:bg-red-50 text-[12px] font-semibold rounded-lg transition-colors">
                        <XCircle size={12} /> Reject
                      </button>
                    </form>
                  )}
                  {review.status !== 'pending' && (
                    <form action={setStatus.bind(null, review.id, 'pending', locSlug, catSlug)}>
                      <button type="submit" className="flex items-center gap-1.5 h-8 px-3.5 border border-slate-200 text-slate-600 hover:bg-slate-100 text-[12px] font-semibold rounded-lg transition-colors">
                        Hold
                      </button>
                    </form>
                  )}
                  <form action={deleteReview.bind(null, review.id, locSlug, catSlug)} className="ml-auto">
                    <button type="submit" className="flex items-center gap-1.5 h-8 px-3.5 border border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-600 text-[12px] font-semibold rounded-lg transition-colors">
                      <Trash2 size={12} /> Delete
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
