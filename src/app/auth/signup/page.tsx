import type { Metadata } from 'next'
import SignupClient from './SignupClient'

export const metadata: Metadata = {
  title: 'Create Account | OverseasNursing',
  description: 'Create your OverseasNursing account to submit agency reviews and scam reports.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/auth/signup',
  },
}

export default function SignupPage() {
  return <SignupClient />
}
