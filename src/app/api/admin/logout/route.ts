import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/admin-auth'

export async function POST() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const response = NextResponse.redirect(new URL('/admin/login', siteUrl))

  // Clear by setting the same flags used at login — browser won't remove
  // a cookie if the path/domain/secure attributes don't match exactly.
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   0,
    path:     '/admin',
  })

  return response
}
