import type { Metadata } from 'next'
import { getAllReviewers } from '@/lib/reviewers/data'
import { ReviewerCard } from '@/components/reviewers/ReviewerCard'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildWebPageSchema } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'Expert Reviewers — OverseasNursing',
  description: 'Verified nurses and migration professionals who review OverseasNursing content for clinical and regulatory accuracy before publication.',
  alternates: { canonical: 'https://overseasnursing.com/reviewers' },
  openGraph: {
    title: 'Expert Reviewers — OverseasNursing',
    description: 'Verified nurses and migration professionals who review content for clinical and regulatory accuracy.',
    url: 'https://overseasnursing.com/reviewers',
    type: 'website',
  },
}

export default async function ReviewersPage() {
  const reviewers = await getAllReviewers()

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Reviewers', href: '/reviewers' },
  ]

  const schema = buildWebPageSchema({
    title: 'Expert Reviewers — OverseasNursing',
    description: 'Verified nurses and migration professionals who review OverseasNursing content for accuracy.',
    path: '/reviewers',
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <JsonLd schema={schema} />

      <div className="bg-white border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-5">
            <h1 className="text-[32px] sm:text-[38px] font-bold text-slate-900 leading-tight mb-3">
              Expert Reviewers
            </h1>
            <p className="text-[15px] text-slate-500 leading-relaxed max-w-2xl">
              Every clinical guide, exam article, and country migration page is reviewed by a verified
              nurse or registered migration professional before publication. Reviewer credentials are
              publicly verifiable and disclosed on each profile.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-12">
        {reviewers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl">
            {reviewers.map((reviewer) => (
              <ReviewerCard key={reviewer.slug} reviewer={reviewer} />
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-slate-400">Reviewer profiles are being prepared.</p>
        )}

        <div className="flex flex-wrap gap-6 mt-10 text-[13.5px]">
          <a href="/about" className="text-primary font-semibold hover:underline">
            ← About OverseasNursing
          </a>
          <a href="/editorial-policy" className="text-primary font-semibold hover:underline">
            Editorial Policy →
          </a>
        </div>
      </div>
    </div>
  )
}
