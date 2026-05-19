/**
 * Edge-runtime-safe session verification.
 * Uses Web Crypto API (globalThis.crypto.subtle) — no Node.js modules.
 * Imported by middleware.ts (Edge Runtime).
 *
 * Token format (created by admin-auth.ts — must stay in sync):
 *   base64url( "email|issuedMs|hmacSHA256Hex" )
 */

export const COOKIE_NAME = 'admin_session'
export const SESSION_TTL  = 60 * 60 * 24 * 7 // 7 days in seconds

function base64urlDecode(token: string): string {
  // base64url → base64
  const b64 = token.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64.length % 4
  return atob(pad ? b64 + '='.repeat(4 - pad) : b64)
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const buf = new ArrayBuffer(hex.length >> 1)
  const out = new Uint8Array(buf)
  for (let i = 0; i < hex.length; i += 2) {
    out[i >> 1] = parseInt(hex.slice(i, i + 2), 16)
  }
  return out
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET
    if (!secret) return null

    const decoded = base64urlDecode(token)
    const parts   = decoded.split('|')
    if (parts.length !== 3) return null

    const [email, issued, sigHex] = parts
    if (!email || !issued || !sigHex) return null

    const payload = `${email}|${issued}`
    const enc     = new TextEncoder()

    const key = await globalThis.crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )

    const valid = await globalThis.crypto.subtle.verify(
      'HMAC',
      key,
      hexToBytes(sigHex),
      enc.encode(payload),
    )
    if (!valid) return null

    const ageSeconds = (Date.now() - Number(issued)) / 1000
    if (isNaN(ageSeconds) || ageSeconds > SESSION_TTL) return null

    return email
  } catch {
    return null
  }
}
