import type { Metadata } from 'next'
import { AgencyLoginClient } from './_components/AgencyLoginClient'

export const metadata: Metadata = {
  title: 'Agency Login & Submit Your Agency | OverseasNursing.com',
  description:
    'Login to manage your agency listing on OverseasNursing.com, or submit your agency to be listed and reviewed by Indian nurses.',
  alternates: { canonical: '/agency-login' },
  robots: { index: false },
}

interface PageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function AgencyLoginPage({ searchParams }: PageProps) {
  const { tab } = await searchParams
  return <AgencyLoginClient defaultTab={tab === 'submit' ? 'submit' : 'login'} />
}
