'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-slate-900 antialiased font-sans">
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="w-16 h-16 rounded-2xl bg-[#FEE2E2] flex items-center justify-center mb-6 mx-auto">
            <span className="text-[28px]" aria-hidden="true">⚠</span>
          </div>
          <h1 className="text-[28px] font-bold text-slate-800 mb-3">
            Critical error
          </h1>
          <p className="text-[16px] text-slate-500 max-w-[380px] mb-8">
            OverseasNursing encountered a critical error. Please reload to try again.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F4C81] hover:bg-[#0D3F6E] text-white text-[14px] font-semibold rounded-xl transition-colors"
          >
            <RefreshCw size={15} />
            Reload page
          </button>
        </div>
      </body>
    </html>
  )
}
