'use client'

import Script from 'next/script'
import { useCookieConsent } from '@/components/cookies/CookieConsentContext'

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID

export function AnalyticsProvider() {
  const { analyticsAllowed } = useCookieConsent()

  return (
    <>
      {/* Microsoft Clarity — only loads once the visitor has granted analytics consent */}
      {CLARITY_ID && analyticsAllowed && (
        <Script id="clarity-init" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}
        </Script>
      )}
    </>
  )
}
