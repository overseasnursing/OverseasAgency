import React from 'react'
import type { Metadata } from 'next'
import { ReviewSubmitForm } from './ReviewSubmitForm'

export const metadata: Metadata = {
  title: 'Write a Review — OverseasNursing.com',
  description:
    'Share your experience with an overseas nursing recruitment agency. Help other Indian nurses make informed decisions.',
  alternates: { canonical: '/reviews/submit' },
}

export default function ReviewSubmitPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-10">
          <p className="text-[12px] font-semibold text-primary uppercase tracking-widest mb-3">
            Community Review
          </p>
          <h1 className="text-[28px] font-bold text-slate-800 mb-3">
            Share Your Agency Experience
          </h1>
          <p className="text-[14px] text-slate-500 leading-relaxed">
            Your review helps thousands of Indian nurses choose the right agency. Be honest, be detailed, be specific about costs and timelines.
          </p>
        </div>

        <ReviewSubmitForm />

        {/* Trust note */}
        <p className="text-center text-[12px] text-slate-400 mt-8">
          Reviews are moderated within 24–48 hours. We do not edit your content — only verify basic details. Fraudulent submissions are reported to authorities.
        </p>
      </div>
    </div>
  )
}
