'use client'

import { useEffect, useState } from 'react'

/**
 * Renders a mailto link only on the client so Cloudflare's Email Obfuscation
 * never sees it in the server HTML and doesn't replace it with /cdn-cgi/...
 */
export function MailtoLink({
  email,
  subject,
  className,
  children,
}: {
  email: string
  subject?: string
  className?: string
  children?: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const href = subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`

  if (!mounted) {
    return (
      <span className={className}>
        {children ?? email}
      </span>
    )
  }

  return (
    <a href={href} className={className}>
      {children ?? email}
    </a>
  )
}
