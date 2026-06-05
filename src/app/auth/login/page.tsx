import type { Metadata } from 'next'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Sign In | OverseasNursing',
  description: 'Sign in to submit reviews, report scams, and access your nursing migration dashboard.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/auth/login',
  },
}

export default function LoginPage() {
  return <LoginClient />
}
