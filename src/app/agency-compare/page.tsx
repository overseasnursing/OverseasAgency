import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Agency Compare Redirect | OverseasNursing',
  description: 'Legacy agency compare URLs redirect to the agencies listing page.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/agencies',
  },
}

// Agency compare tool removed — query-param URLs like ?a=X&b=Y were being indexed
// by Google as thousands of near-duplicate pages. All existing URLs redirect to
// the agencies listing where users can browse and find agencies.
export default function AgencyComparePage() {
  permanentRedirect('/agencies')
}
