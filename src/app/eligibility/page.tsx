import type { Metadata } from 'next'
import { EligibilityCalculator } from '@/app/pricing/EligibilityCalculator'

export const metadata: Metadata = {
  title: 'Check Your Eligibility — Which Country Suits You Best?',
  description:
    'Answer 8 quick questions and get a personalised country match for overseas nursing migration — Germany, UK, Australia, Canada, or Dubai.',
  alternates: { canonical: 'https://overseasnursing.com/eligibility' },
  openGraph: {
    title: 'Nursing Migration Eligibility Checker',
    description: 'Find out which country is the best fit for your nursing migration journey.',
    url: 'https://overseasnursing.com/eligibility',
  },
}

export default function EligibilityPage() {
  return <EligibilityCalculator />
}
