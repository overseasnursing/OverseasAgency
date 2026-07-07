import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSourceCountryByIso } from '@/lib/data/countryList'
import { PREF_COUNTRY_COOKIE, SUGGESTED_COUNTRY_COOKIE } from '@/lib/cookies/sourceCountry'

const SUGGESTED_COUNTRY_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

/**
 * Lightweight, first-visit-only source-country detection. No redirects, no
 * URL changes, no HTML personalization — this only ever sets a cookie that
 * resolveSourceCountry() reads as its lowest-priority signal (see
 * src/lib/country/resolve.ts). Silently does nothing if the deployment
 * infra doesn't expose a geo header, or the detected country isn't
 * registered — resolveSourceCountry() already falls back to India either way.
 */
function applySuggestedCountry(request: NextRequest, response: NextResponse): void {
  // Never overwrite an existing suggestion or an explicit choice.
  if (request.cookies.get(PREF_COUNTRY_COOKIE) || request.cookies.get(SUGGESTED_COUNTRY_COOKIE)) return

  // Vercel populates x-vercel-ip-country natively; cf-ipcountry is Cloudflare's
  // equivalent when it terminates the request in front of origin. Whichever
  // is actually present in this deployment is used — neither is assumed.
  const detectedIso =
    request.headers.get('x-vercel-ip-country') ??
    request.headers.get('cf-ipcountry')
  if (!detectedIso) return

  const entry = getSourceCountryByIso(detectedIso)
  if (!entry) return

  response.cookies.set(SUGGESTED_COUNTRY_COOKIE, entry.name, {
    maxAge:   SUGGESTED_COUNTRY_MAX_AGE,
    path:     '/',
    sameSite: 'lax',
  })
}

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

  applySuggestedCountry(request, supabaseResponse)

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
