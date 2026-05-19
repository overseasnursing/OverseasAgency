'use client'

import { useEffect } from 'react'
import { Container } from '@/components/layout/Container'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-[#FEE2E2] flex items-center justify-center mb-6">
          <AlertTriangle size={28} className="text-[#B91C1C]" />
        </div>
        <h2 className="text-[28px] font-bold text-slate-800 mb-3">Something went wrong</h2>
        <p className="text-[16px] text-slate-500 leading-relaxed max-w-[400px] mb-8">
          An unexpected error occurred. Please try again — if the problem persists,
          the team has been notified.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors"
          >
            <RefreshCw size={15} />
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[14px] font-semibold rounded-xl transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </Container>
  )
}
