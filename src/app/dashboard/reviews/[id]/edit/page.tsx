import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOwnedReview, parseCostStr } from '@/lib/db/reviews'
import { ReviewSubmitForm } from '@/app/reviews/submit/ReviewSubmitForm'

export const metadata: Metadata = { title: 'Edit Review — OverseasNursing' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditReviewPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?next=/dashboard/reviews/${id}/edit`)

  const review = await getOwnedReview(id, user.id)
  if (!review) notFound()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-900 mb-1">Edit Review</h1>
        <p className="text-[13px] text-slate-500">
          Editing sends your review back for re-verification before it&apos;s public again.
        </p>
      </div>
      <ReviewSubmitForm
        editReviewId={review.id}
        lockedAgencySlug={review.agency_slug}
        lockedAgencyName={review.agency_name}
        initialData={{
          destinationCountry: review.country_placed,
          visaReceived: review.placed ? 'Yes' : 'No',
          timelineMonths: review.timeline_months ? String(review.timeline_months) : '',
          actualCostPaid: (() => {
            const n = parseCostStr(review.actual_cost_paid)
            return n > 0 ? String(n) : ''
          })(),
          hiddenCharges: review.hidden_charges === true ? 'Yes' : review.hidden_charges === false ? 'No' : '',
          hiddenChargesAmount: review.hidden_charges_amount != null ? String(review.hidden_charges_amount) : '',
          communicationRating: review.communication_rating ?? 0,
          transparencyRating: review.transparency_rating ?? 0,
          speedRating: review.speed_rating ?? 0,
          overallRating: review.overall_rating,
          body: review.review_text,
          wouldRecommend: review.recommend_condition ? 'With conditions' : (review.recommends ? 'Yes' : 'No'),
          recommendCondition: review.recommend_condition ?? '',
          authorName: review.author_name,
          authorFrom: review.author_from,
          verifyConsent: true,
        }}
      />
    </div>
  )
}
