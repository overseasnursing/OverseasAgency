/**
 * Design token reference — mirrors tailwind.config.ts and globals.css.
 * Import these into TypeScript logic (e.g. chart colours, inline styles).
 * In JSX, use Tailwind utilities directly.
 */

export const COLORS = {
  // Brand
  primary:      '#0F4C81',
  primaryHover: '#0C3A63',
  primaryLight: '#E0EDFB',

  // Accents
  accentBlue:  '#2563EB',
  accentGreen: '#22C55E',
  accentRed:   '#EF4444',
  accentWarm:  '#F59E0B',

  // Trust badges
  verified: { bg: '#DCFCE7', text: '#166534', border: '#BBF7D0' },
  trusted:  { bg: '#DBEAFE', text: '#1D4ED8', border: '#BFDBFE' },
  pricing:  { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
  scam:     { bg: '#FEE2E2', text: '#B91C1C', border: '#FECACA' },

  // Surfaces
  surfacePage:    '#F8FAFC',
  surfaceCard:    '#FFFFFF',
  surfaceSection: '#F1F5F9',
  surfaceWarm:    '#FFF8F1',

  // Text
  textPrimary:   '#0F172A',
  textSecondary: '#64748B',
  textMuted:     '#94A3B8',

  // Borders
  border:      '#E2E8F0',
  borderLight: '#F1F5F9',
} as const

export const TYPOGRAPHY = {
  fontFamily: "'Manrope', system-ui, sans-serif",
  scale: {
    display:    { size: '44px', lineHeight: 1.18, weight: 700, letterSpacing: '-0.5px' },
    displaySm:  { size: '30px', lineHeight: 1.2,  weight: 700, letterSpacing: '-0.3px' },
    title:      { size: '34px', lineHeight: 1.2,  weight: 700, letterSpacing: '-0.3px' },
    titleSm:    { size: '26px', lineHeight: 1.25, weight: 700 },
    subtitle:   { size: '26px', lineHeight: 1.25, weight: 600 },
    subtitleSm: { size: '22px', lineHeight: 1.3,  weight: 600 },
    cardTitle:  { size: '20px', lineHeight: 1.3,  weight: 600 },
    bodyLg:     { size: '17px', lineHeight: 1.75, weight: 400 },
    body:       { size: '16px', lineHeight: 1.72, weight: 400 },
    small:      { size: '14px', lineHeight: 1.55, weight: 400 },
    label:      { size: '13px', lineHeight: 1.45, weight: 500 },
    eyebrow:    { size: '12px', lineHeight: 1,    weight: 600, letterSpacing: '0.06em' },
  },
} as const

export const SHADOWS = {
  card:   '0 1px 4px 0 rgba(0,0,0,0.06)',
  cardMd: '0 4px 16px 0 rgba(0,0,0,0.08)',
  cardLg: '0 8px 24px 0 rgba(15,76,129,0.10)',
  nav:    '0 1px 12px 0 rgba(15,76,129,0.08)',
} as const

export const BORDER_RADIUS = {
  card:  '18px',
  badge: '999px',
  // Standard Tailwind values used in components:
  // rounded-lg  = 8px
  // rounded-xl  = 12px
  // rounded-2xl = 16px
} as const

export const LAYOUT = {
  navbarHeight:    68,
  mobileNavHeight: 72,
  maxReadable:     '68ch',
  maxContent:      '1200px',
  maxWide:         '1400px',
} as const

export const BREAKPOINTS = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  '2xl': 1536,
} as const
