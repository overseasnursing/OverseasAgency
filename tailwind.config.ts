import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Brand Colors ────────────────────────────────────────
      colors: {
        primary: {
          DEFAULT: '#0F4C81',
          hover:   '#0C3A63',
          light:   '#E0EDFB',
        },
        accent: {
          blue: '#2563EB',
          green: '#22C55E',
          red:   '#EF4444',
          warm:  '#F59E0B',
        },
        // Trust badge system
        verified: { bg: '#DCFCE7', text: '#166534', border: '#BBF7D0' },
        trusted:  { bg: '#DBEAFE', text: '#1D4ED8', border: '#BFDBFE' },
        pricing:  { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
        scam:     { bg: '#FEE2E2', text: '#B91C1C', border: '#FECACA' },
        // Page surface hierarchy
        surface: {
          page:    '#F8FAFC',
          card:    '#FFFFFF',
          section: '#F1F5F9',
          warm:    '#FFF8F1',
        },
      },

      // ─── Typography ──────────────────────────────────────────
      fontFamily: {
        // var(--font-manrope) is injected by next/font in layout.tsx
        sans: ['var(--font-manrope)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      // These EXTEND — no Tailwind defaults are overridden.
      // Use as: text-display, text-title, text-subtitle, text-label
      fontSize: {
        // Heading sizes (for non-semantic use, e.g. hero spans, stats)
        'display':    ['44px', { lineHeight: '1.18', fontWeight: '700', letterSpacing: '-0.5px' }],
        'display-sm': ['30px', { lineHeight: '1.2',  fontWeight: '700', letterSpacing: '-0.3px' }],
        'title':      ['34px', { lineHeight: '1.2',  fontWeight: '700', letterSpacing: '-0.3px' }],
        'title-sm':   ['26px', { lineHeight: '1.25', fontWeight: '700' }],
        'subtitle':   ['26px', { lineHeight: '1.25', fontWeight: '600' }],
        'subtitle-sm':['22px', { lineHeight: '1.3',  fontWeight: '600' }],
        'card-title': ['20px', { lineHeight: '1.3',  fontWeight: '600' }],
        'body-lg':    ['17px', { lineHeight: '1.75', fontWeight: '400' }],
        'label':      ['13px', { lineHeight: '1.45', fontWeight: '500' }],
        'eyebrow':    ['12px', { lineHeight: '1',    fontWeight: '600', letterSpacing: '0.06em' }],
      },

      // ─── Max widths ──────────────────────────────────────────
      maxWidth: {
        'readable': '68ch',
        'content':  '1200px',
        'wide':     '1400px',
      },

      // ─── Border radius ───────────────────────────────────────
      borderRadius: {
        'card':  '18px',
        'badge': '999px',
      },

      // ─── Shadows — no glow, no heavy drop ────────────────────
      boxShadow: {
        'card':    '0 1px 4px 0 rgba(0,0,0,0.06)',
        'card-md': '0 4px 16px 0 rgba(0,0,0,0.08)',
        'card-lg': '0 8px 24px 0 rgba(15,76,129,0.10)',
        'nav':     '0 1px 12px 0 rgba(15,76,129,0.08)',
      },

      // ─── Minimal animations ──────────────────────────────────
      animation: {
        'fade-in':  'fadeIn 0.15s ease',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  safelist: [
    // Avatar palette classes returned dynamically from getAvatarColor()
    'bg-[#DBEAFE]', 'text-[#1D4ED8]',
    'bg-[#DCFCE7]', 'text-[#166534]',
    'bg-[#FEF3C7]', 'text-[#92400E]',
    'bg-[#F3E8FF]', 'text-[#7C3AED]',
    'bg-[#FCE7F3]', 'text-[#9D174D]',
    'bg-[#E0F2FE]', 'text-[#075985]',
  ],
  plugins: [require('@tailwindcss/forms')],
}

export default config
