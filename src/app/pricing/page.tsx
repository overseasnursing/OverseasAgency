import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { EligibilityCalculator } from './EligibilityCalculator'

export const metadata: Metadata = {
  title: 'Check Eligibility — Which Country Is Right for You?',
  description:
    'Free 3-minute eligibility assessment for Indian nurses. Answer 8 questions about your qualifications, goals and budget. Get personalised rankings for Germany, UK, Canada, Australia and Dubai with cost estimates and next steps.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Free Nursing Eligibility Calculator — Find Your Best Country',
    description: 'Personalised country matches based on your qualification, experience, budget and goals.',
    url: 'https://overseasnursing.com/pricing',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function EligibilityPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Container>
        <EligibilityCalculator />
      </Container>
    </div>
  )
}
