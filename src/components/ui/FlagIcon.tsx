/** SVG-based flag icon — works on all platforms including Windows.
 *  Accepts slug, name, or emoji — resolves to the correct ISO 3166-1 alpha-2 code. */

const SLUG_TO_ISO: Record<string, string> = {
  germany:   'de',
  uk:        'gb',
  canada:    'ca',
  australia: 'au',
  dubai:     'ae',
}

const NAME_TO_ISO: Record<string, string> = {
  'Germany':         'de',
  'United Kingdom':  'gb',
  'UK':              'gb',
  'Canada':          'ca',
  'Australia':       'au',
  'Dubai':           'ae',
  'Dubai / UAE':     'ae',
  'UAE':             'ae',
}

const EMOJI_TO_ISO: Record<string, string> = {
  '🇩🇪': 'de',
  '🇬🇧': 'gb',
  '🇨🇦': 'ca',
  '🇦🇺': 'au',
  '🇦🇪': 'ae',
}

interface FlagIconProps {
  /** URL slug from the route (germany, uk, canada, australia, dubai) */
  slug?: string
  /** Display name (Germany, UK, United Kingdom, Canada, Australia, Dubai, UAE) */
  name?: string
  /** Emoji flag stored in data files (🇩🇪, 🇬🇧, 🇨🇦, 🇦🇺, 🇦🇪) */
  emoji?: string
  /** Raw ISO 3166-1 alpha-2 code (de, gb, ca, au, ae) — bypasses lookup */
  iso?: string
  /** Width/height in pixels — defaults to 20 */
  size?: number
  className?: string
}

export function FlagIcon({ slug, name, emoji, iso, size = 20, className = '' }: FlagIconProps) {
  const code =
    iso ??
    (slug  && SLUG_TO_ISO[slug])  ??
    (name  && NAME_TO_ISO[name])  ??
    (emoji && EMOJI_TO_ISO[emoji]) ??
    'xx'

  const label = name ?? slug ?? emoji ?? ''

  return (
    <span
      className={`fi fi-${code} flex-shrink-0 ${className}`}
      style={{ width: size, height: size * 0.75, display: 'inline-block', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 2 }}
      role="img"
      aria-label={label}
    />
  )
}

/** Convenience: get the ISO code without rendering — useful for data lookups */
export function getIsoCode(slug?: string, name?: string, emoji?: string): string {
  return (
    (slug  && SLUG_TO_ISO[slug])  ||
    (name  && NAME_TO_ISO[name])  ||
    (emoji && EMOJI_TO_ISO[emoji]) ||
    'xx'
  )
}
