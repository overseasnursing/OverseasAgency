/**
 * Strips protocol, www, path, and trailing slash to get the bare domain.
 * Used as the uniqueness key for agencies — prevents duplicate entries
 * for http/https/www variants of the same site.
 *
 * Examples:
 *   https://www.abc-nursing.com/about → abc-nursing.com
 *   http://abc-nursing.com            → abc-nursing.com
 *   www.abc-nursing.com               → abc-nursing.com
 *   abc-nursing.com                   → abc-nursing.com
 */
export function normalizeWebsiteUrl(raw: string): string {
  const trimmed = raw.trim().toLowerCase()
  if (!trimmed) return ''
  const withProto = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
  try {
    const u = new URL(withProto)
    let host = u.hostname
    if (host.startsWith('www.')) host = host.slice(4)
    return host
  } catch {
    // Fallback for unparseable strings
    return trimmed.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]
  }
}
