import crypto from 'crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'admin_session'
const SESSION_TTL  = 60 * 60 * 24 * 7 // 7 days in seconds

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET
  if (!s) throw new Error('ADMIN_SESSION_SECRET is not set')
  return s
}

/* ── Password verification ───────────────────────────────────────── */

export function verifyPassword(candidate: string, stored: string): boolean {
  try {
    const [salt, storedHex] = stored.split(':')
    const storedBuf = Buffer.from(storedHex, 'hex')
    const candidateBuf = crypto.scryptSync(candidate, salt, 64)
    // buffers must be same length for timingSafeEqual
    if (candidateBuf.length !== storedBuf.length) return false
    return crypto.timingSafeEqual(candidateBuf, storedBuf)
  } catch {
    return false
  }
}

/* ── Session token (HMAC-signed, base64-encoded) ─────────────────── */

export function createSessionToken(email: string): string {
  const issued = Date.now().toString()
  const payload = `${email}|${issued}`
  const sig = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
  return Buffer.from(`${payload}|${sig}`).toString('base64url')
}

export function verifySessionToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const parts = decoded.split('|')
    if (parts.length !== 3) return null
    const [email, issued, sig] = parts
    const payload = `${email}|${issued}`
    const expectedSig = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
    const sigBuf      = Buffer.from(sig,         'hex')
    const expectedBuf = Buffer.from(expectedSig, 'hex')
    if (sigBuf.length !== expectedBuf.length) return null
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null
    // Check TTL
    const age = (Date.now() - Number(issued)) / 1000
    if (age > SESSION_TTL) return null
    return email
  } catch {
    return null
  }
}

/* ── Server-action / server-component guard ──────────────────────
   Call at the top of every admin server action.
   Returns the verified admin email, or throws to abort the action.
───────────────────────────────────────────────────────────────── */
export async function requireAdmin(): Promise<string> {
  const jar   = await cookies()
  const token = jar.get(COOKIE_NAME)?.value
  const email = token ? verifySessionToken(token) : null
  if (!email) throw new Error('Unauthorized')
  return email
}

export { COOKIE_NAME, SESSION_TTL }
