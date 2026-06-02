import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import { Navbar } from '@/components/navbar/Navbar'
import { MobileNav } from '@/components/navbar/MobileNav'
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
  openGraph: {
    type:      'website',
    locale:    'en_US',
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

const FOOTER_LINKS = {
  Navigate: [
    ['Home',              '/'],
    ['Agencies',          '/agencies'],
    ['Mock Test',         '/mock-tests'],
    ['Check Eligibility', '/eligibility'],
    ['Scam Reports',      '/scam-reports'],
    ['Countries',         '/countries'],
    ['Exams',             '/exam'],
  ],
  Discover: [
    ['Salary Guides',  '/salary'],
    ['Compare',        '/compare'],
    ['Reviews',        '/reviews'],
    ['Guides',         '/guides'],
    ['Exam Guides',    '/exam'],
    ['Pricing',        '/pricing'],
  ],
  'Countries': [
    ['Germany',   '/country/germany'],
    ['UK',        '/country/uk'],
    ['Australia', '/country/australia'],
    ['Canada',    '/country/canada'],
    ['Dubai',     '/country/dubai'],
  ],
} as const

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
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

        {/* ── Footer ── */}
        <footer className="bg-[#F1F5F9] border-t border-slate-100 pb-[72px] md:pb-0" aria-label="Site footer">
          <div className="max-w-content mx-auto px-6 lg:px-8 pt-14 pb-10">

            <div className="grid grid-cols-12 gap-8 mb-12">
              {/* Brand */}
              <div className="col-span-12 lg:col-span-3">
                <a
                  href="/"
                  className="text-[16px] font-bold text-slate-800 hover:text-primary transition-colors"
                >
                  OverseasNursing
                </a>
                <p className="mt-3 text-[14px] text-slate-500 leading-relaxed max-w-[220px]">
                  Helping nurses safely navigate overseas migration — reviews, pricing, and scam protection.
                </p>
              </div>

              {/* Link columns */}
              {(Object.entries(FOOTER_LINKS) as [string, readonly (readonly string[])[]][]).map(
                ([group, links]) => (
                  <div key={group} className="col-span-6 sm:col-span-4 lg:col-span-3">
                    <h6 className="mb-4">{group}</h6>
                    <ul className="space-y-3">
                      {links.map(([label, href]) => (
                        <li key={href}>
                          <a
                            href={href}
                            className="text-[14px] text-slate-500 hover:text-primary transition-colors"
                          >
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-slate-200">
              <p className="text-[13px] text-slate-400">
                © {new Date().getFullYear()} OverseasNursing. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {[['About', '/about'], ['Editorial Policy', '/editorial-policy'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact']].map(
                  ([label, href]) => (
                    <a
                      key={href}
                      href={href}
                      className="text-[13px] text-slate-400 hover:text-primary transition-colors"
                    >
                      {label}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </footer>

        <MobileNav />
        <AnalyticsProvider />
        <SpeedInsights />

      </body>
    </html>
  )
}
