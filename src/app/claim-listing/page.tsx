import type { Metadata } from 'next'
import { ClaimListingClient } from './_components/ClaimListingClient'

export const metadata: Metadata = {
  title: 'Claim Your Agency Listing | OverseasNursing.com',
  description:
    'Are you the owner or manager of a nursing agency listed on OverseasNursing? Claim your listing to manage your profile, pricing, and respond to reviews.',
  robots: { index: true, follow: true },
}

export default function ClaimListingPage() {
  return <ClaimListingClient />
}
