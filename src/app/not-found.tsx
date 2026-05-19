import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { ShieldAlert, ArrowRight, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <Container>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
          <ShieldAlert size={28} className="text-slate-400" />
        </div>
        <h1 className="text-[32px] font-bold text-slate-800 mb-3">Page not found</h1>
        <p className="text-[16px] text-slate-500 leading-relaxed max-w-[420px] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Try searching for agencies or browse by country.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors"
          >
            <Home size={15} />
            Back to home
          </a>
          <a
            href="/agencies"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[14px] font-semibold rounded-xl transition-colors"
          >
            Browse agencies
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </Container>
  )
}
