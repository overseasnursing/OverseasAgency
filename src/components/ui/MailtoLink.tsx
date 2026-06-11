'use client'

import { useEffect, useState } from 'react'
import { Eye, Mail } from 'lucide-react'

/**
 * Renders a mailto link only on the client so Cloudflare's Email Obfuscation
 * never sees it in the server HTML and doesn't replace it with /cdn-cgi/...
 *
 * Pass `reveal` to hide the email behind a button click (spam protection).
 */
export function MailtoLink({
  email,
  subject,
  className,
  children,
  reveal = false,
}: {
  email: string
  subject?: string
  className?: string
  children?: React.ReactNode
  reveal?: boolean
}) {
  const [mounted, setMounted]   = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => setMounted(true), [])

  const href = subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`

  // SSR — show nothing sensitive
  if (!mounted) {
    if (reveal) {
      return (
        <button className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary opacity-0">
          <Eye size={14} /> View email address
        </button>
      )
    }
    return <span className={className}>{children ?? email}</span>
  }

  // Reveal mode — show button until clicked
  if (reveal && !revealed) {
    return (
      <button
        onClick={() => setRevealed(true)}
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary hover:text-primary-hover transition-colors group"
      >
        <span className="w-6 h-6 rounded-lg bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center flex-shrink-0 transition-colors">
          <Eye size={13} className="text-primary" />
        </span>
        View email address
      </button>
    )
  }

  return (
    <a
      href={href}
      className={className ?? 'inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline'}
    >
      {reveal && <Mail size={13} />}
      {children ?? email}
    </a>
  )
}
