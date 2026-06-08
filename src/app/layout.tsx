import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import { Navbar } from '@/components/navbar/Navbar'
import { MobileNav } from '@/components/navbar/MobileNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

/* ── Font ─────────────────────────────────────────────────────────
   next/font handles subsetting, preloading, and self-hosting.
   This eliminates the external request that @import causes.
───────────────────────────────────────────────────────────────── */
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'optional', // eliminates FOUT/CLS: uses system font if not cached, switches next load
  preload: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F4C81',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://overseasnursing.com'),
  title: {
    default:  'OverseasNursing — Find Trusted Nursing Migration Agencies',
    template: '%s | OverseasNursing',
  },
  description:
    'Compare real nurse reviews, transparent migration costs, exam guidance and scam reports. Find trusted overseas nursing agencies for Germany, UK, Australia, Canada & Dubai.',
  keywords: [
    'overseas nursing agencies',
    'nursing migration India',
    'Germany nurse visa',
    'UK nursing abroad',
    'NCLEX India',
    'OET exam',
    'nursing agency reviews',
    'overseas nursing scams',
  ],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://overseasnursing.com',
    languages: {
      'en-IN': 'https://overseasnursing.com',
      'en':    'https://overseasnursing.com',
    },
  },
  openGraph: {
    type:      'website',
    locale:    'en_IN',
    url:       'https://overseasnursing.com',
    siteName:  'OverseasNursing',
    description:
      'The trusted search platform for overseas nursing migration — real reviews, transparent pricing, scam alerts.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card:    'summary_large_image',
    creator: '@overseasnursing',
    images:  ['/opengraph-image'],
  },
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={manrope.variable}>
      <head>
        {/* Preconnect to analytics + CDN origins so scripts load faster */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="preconnect" href="https://cdn.supabase.co" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className="font-sans bg-[#F8FAFC] text-slate-900 antialiased">

        {/* Skip to content — keyboard / screen reader */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>

        <Navbar />

        <main id="main-content">
          {children}
        </main>

        <SiteFooter />

        <MobileNav />
        <AnalyticsProvider />
        <SpeedInsights />

      </body>
    </html>
  )
}
