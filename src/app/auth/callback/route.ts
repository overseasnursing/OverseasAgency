import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const requestedNext = searchParams.get('next')
  // Must be a same-site path — reject protocol-relative ("//evil.com") and
  // backslash variants, which browsers/URL parsers treat as a different host.
  const isSafeNext = !!requestedNext && requestedNext.startsWith('/') && !requestedNext.startsWith('//') && !requestedNext.startsWith('/\\')
  const next = isSafeNext ? requestedNext : '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const redirectUrl = new URL(next, origin)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.redirect(new URL('/auth/login?error=auth', origin))
}
