import type { Metadata } from 'next'
import LoginClient from '../auth/login/LoginClient'

export const metadata: Metadata = {
	title: 'Sign In | OverseasNursing',
	description: 'Sign in to access your OverseasNursing dashboard and account features.',
	robots: {
		index: false,
		follow: false,
	},
	alternates: {
		canonical: '/auth/login',
	},
}

export default function LoginAliasPage() {
	return <LoginClient />
}