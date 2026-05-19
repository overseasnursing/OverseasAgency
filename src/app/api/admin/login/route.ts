import { NextResponse } from 'next/server'
import { verifyPassword, createSessionToken, COOKIE_NAME, SESSION_TTL } from '@/lib/admin-auth'

// ── In-process rate limiter ───────────────────────────────────────────────
// Tracks failed attempts per IP. Sufficient for a single-admin panel —
// not a replacement for Cloudflare/Vercel firewall rules in production.
const WINDOW_MS      = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS   = 10
const attempts       = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const rec = attempts.get(ip)
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  rec.count++
  return rec.count > MAX_ATTEMPTS
}

function clearAttempts(ip: string): void {
  attempts.delete(ip)
}

// ── CSRF: validate Origin / Referer header ────────────────────────────────
function isValidOrigin(req: Request): boolean {
  const siteUrl    = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const allowedOrigin = new URL(siteUrl).origin
  const origin     = req.headers.get('origin')
  const referer    = req.headers.get('referer')

  if (origin) return origin === allowedOrigin
  if (referer) return referer.startsWith(allowedOrigin + '/')
  // No origin/referer: block in production, allow in dev
  return process.env.NODE_ENV !== 'production'
}

export async function POST(req: Request) {
  try {
    // CSRF check
    if (!isValidOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }

    // Rate limit by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
               ?? req.headers.get('x-real-ip')
               ?? 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait 15 minutes.' },
        { status: 429 },
      )
    }

    const body = await req.json().catch(() => ({})) as { email?: string; password?: string }
    const { email, password } = body

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    // Normalise for comparison
    const emailNorm = email.toLowerCase().trim().slice(0, 254)

    const adminEmail        = process.env.ADMIN_EMAIL
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

    if (!adminEmail || !adminPasswordHash) {
      return NextResponse.json({ error: 'Admin account not configured.' }, { status: 500 })
    }

    // Always run password check to prevent timing oracle (even on email mismatch)
    const passwordMatch = verifyPassword(password, adminPasswordHash)
    const emailMatch    = emailNorm === adminEmail.toLowerCase()

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    // Successful login — clear rate limit record
    clearAttempts(ip)

    const token    = createSessionToken(adminEmail)
    const response = NextResponse.json({ ok: true })

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',   // stronger than 'lax': blocks all cross-site sends
      maxAge:   SESSION_TTL,
      path:     '/admin',   // cookie only sent to /admin routes
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
