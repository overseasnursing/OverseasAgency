import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getMyReviews } from '@/lib/db/reviews'
import { Star, MessageSquare, EyeOff } from 'lucide-react'
import { ReviewRowActions } from './_components/ReviewRowActions'

export const metadata: Metadata = { title: 'My Reviews — OverseasNursing' }
export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  approved: 'bg-[#DCFCE7] text-[#166534]',
  pending:  'bg-[#FEF3C7] text-[#92400E]',
  rejected: 'bg-[#FEE2E2] text-[#B91C1C]',
}

export default async function MyReviewsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const reviews = user ? await getMyReviews(user.id) : []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-900 mb-1">My Reviews</h1>
        <p className="text-[13px] text-slate-500">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''} — edit or disable your own reviews at any time. Disabling hides a review from public view without deleting it.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} className="text-slate-300" />
          </div>
          <p className="text-[15px] font-semibold text-slate-700 mb-1">No reviews yet</p>
          <p className="text-[13px] text-slate-400 mb-5">
            Share your experience with an agency to help other nurses.
          </p>
          <a
            href="/reviews/submit"
            className="inline-flex items-center gap-2 h-9 px-5 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
          >
            Write a Review
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-semibold text-slate-800">{review.agency_name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${STATUS_STYLES[review.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {review.status}
                    </span>
                    {review.user_disabled && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">
                        <EyeOff size={10} /> Disabled
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={12} fill={i <= review.overall_rating ? '#F59E0B' : '#E2E8F0'} className={i <= review.overall_rating ? 'text-[#F59E0B]' : 'text-slate-200'} />
                    ))}
                  </div>
                </div>
                <ReviewRowActions id={review.id} disabled={review.user_disabled} />
              </div>

              <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2 mb-3">{review.review_text}</p>

              {review.status === 'rejected' && review.reject_reason && (
                <p className="text-[12px] text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3 py-2">
                  Rejected: {review.reject_reason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
