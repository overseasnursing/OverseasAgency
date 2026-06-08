import type { JSX } from 'react'
import { getSiteSocialLinks } from '@/lib/db/admin-profile'

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
  Countries: [
    ['Germany',   '/country/germany'],
    ['UK',        '/country/uk'],
    ['Australia', '/country/australia'],
    ['Canada',    '/country/canada'],
    ['Dubai',     '/country/dubai'],
  ],
} as const

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function TwitterXIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.47a2.78 2.78 0 0 0 1.94-1.95 29 29 0 0 0 .46-5.29 29 29 0 0 0-.46-5.43z" />
      <polygon points="9.75,15.02 15.5,11.75 9.75,8.48 9.75,15.02" fill="white" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

const ICON_MAP = {
  facebook:  { Icon: FacebookIcon,  label: 'Facebook' },
  instagram: { Icon: InstagramIcon, label: 'Instagram' },
  twitter:   { Icon: TwitterXIcon,  label: 'Twitter / X' },
  linkedin:  { Icon: LinkedInIcon,  label: 'LinkedIn' },
  youtube:   { Icon: YouTubeIcon,   label: 'YouTube' },
  whatsapp:  { Icon: WhatsAppIcon,  label: 'WhatsApp' },
} as const

export async function SiteFooter() {
  const social = await getSiteSocialLinks()

  type IconEntry = { Icon: () => JSX.Element; label: string }
  const socialLinks = (Object.entries(ICON_MAP) as [keyof typeof ICON_MAP, IconEntry][])
    .map(([key, meta]) => ({ url: social[key], ...meta }))
    .filter((s): s is { url: string; Icon: () => JSX.Element; label: string } => Boolean(s.url))

  return (
    <footer className="bg-[#F1F5F9] border-t border-slate-100 pb-[72px] md:pb-0" aria-label="Site footer">
      <div className="max-w-content mx-auto px-6 lg:px-8 pt-14 pb-10">

        <div className="grid grid-cols-12 gap-8 mb-12">
          {/* Brand + social icons */}
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

            {/* Social icons — only rendered when at least one link is saved */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2 mt-5 flex-wrap">
                {socialLinks.map(({ url, Icon, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
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
  )
}
