import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function isRefreshTokenNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false

  const candidate = error as { code?: string; message?: string }
  if (candidate.code === 'refresh_token_not_found') return true
  return (candidate.message ?? '').toLowerCase().includes('invalid refresh token')
}

function clearSupabaseAuthCookies(request: NextRequest, response: NextResponse) {
  const authCookieNames = request.cookies
    .getAll()
    .map((c) => c.name)
    .filter((name) => name.startsWith('sb-') && name.includes('-auth-token'))

  authCookieNames.forEach((name) => {
    request.cookies.delete(name)
    response.cookies.delete(name)
  })
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh session — do not remove
  try {
    await supabase.auth.getUser()
  } catch (error) {
    if (isRefreshTokenNotFoundError(error)) {
      clearSupabaseAuthCookies(request, supabaseResponse)
    } else {
      console.error('[middleware] Supabase getUser failed; continuing request', {
        path: request.nextUrl.pathname,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
