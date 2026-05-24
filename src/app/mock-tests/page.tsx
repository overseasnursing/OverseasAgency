import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, BookOpen, Clock, MapPin } from 'lucide-react'
import { getMockTestLocations } from '@/lib/data/getMockTestData'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Free Nursing Mock Tests — Practice Licensing Exams Online | OverseasNursing',
  description:
    'Prepare for DHA, HAAD, MOH, PROMETRIC, NCLEX & more with free nursing mock tests. Timed, scored, instant results. Trusted by thousands of nurses.',
  alternates: { canonical: 'https://overseasnursing.com/mock-tests' },
  openGraph: {
    title: 'Free Nursing Mock Tests — OverseasNursing',
    description: 'Practice licensing exams with free mock tests. DHA, HAAD, MOH, NCLEX and more.',
    url: 'https://overseasnursing.com/mock-tests',
  },
}

const REGION_COLORS = [
  { bg: 'bg-blue-50', border: 'border-blue-100', icon: 'bg-blue-100 text-blue-700', bar: 'bg-blue-500' },
  { bg: 'bg-violet-50', border: 'border-violet-100', icon: 'bg-violet-100 text-violet-700', bar: 'bg-violet-500' },
  { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500' },
  { bg: 'bg-amber-50', border: 'border-amber-100', icon: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500' },
  { bg: 'bg-rose-50', border: 'border-rose-100', icon: 'bg-rose-100 text-rose-700', bar: 'bg-rose-500' },
  { bg: 'bg-cyan-50', border: 'border-cyan-100', icon: 'bg-cyan-100 text-cyan-700', bar: 'bg-cyan-500' },
]

export default async function MockTestsPage() {
  const locations = await getMockTestLocations()

  const totalTests = locations.reduce((s, l) => s + l.test_count, 0)
  const totalCats  = locations.reduce((s, l) => s + l.category_count, 0)

  return (
    <div className="bg-surface-page min-h-screen">

      {/* Hero */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-4">
            <BookOpen size={13} />
            <span className="font-semibold text-primary uppercase tracking-wide text-[11px]">Free Mock Tests</span>
          </div>
          <h1 className="text-title-sm sm:text-title font-bold text-slate-900 mb-3">
            Nursing Licensing Mock Tests
          </h1>
          <p className="text-[15px] text-slate-500 max-w-[600px] leading-relaxed mb-6">
            Prepare with confidence for your overseas nursing licensing exams. Timed, scored and reviewed — completely free.
          </p>
          {totalTests > 0 && (
            <div className="flex flex-wrap gap-5">
              {[
                { label: 'Exam Categories', value: locations.length },
                { label: 'Practice Sets', value: totalCats },
                { label: 'Mock Tests', value: totalTests },
              ].map(s => (
                <div key={s.label} className="flex items-baseline gap-2">
                  <span className="text-[22px] font-bold text-primary">{s.value}</span>
                  <span className="text-[13px] text-slate-400">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">

        {locations.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={40} className="text-slate-300 mx-auto mb-4" />
            <h2 className="text-[18px] font-semibold text-slate-600 mb-2">Mock tests coming soon</h2>
            <p className="text-[14px] text-slate-400">We&apos;re building the question bank. Check back shortly.</p>
          </div>
        ) : (
          <>
            <h2 className="text-[16px] font-bold text-slate-800 mb-5">Select Your Exam Region</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {locations.map((loc, i) => {
                const palette = REGION_COLORS[i % REGION_COLORS.length]
                const initials = loc.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
                return (
                  <div
                    key={loc.id}
                    className={`bg-white border ${palette.border} rounded-card shadow-card hover:shadow-card-md transition-all flex flex-col overflow-hidden group`}
                  >
                    {/* Top accent bar */}
                    <div className={`h-1 ${palette.bar}`} />

                    <div className="p-5 flex flex-col flex-1 gap-4">
                      {/* Header */}
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold flex-shrink-0 ${palette.icon}`}>
                          {initials}
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-slate-800 leading-tight">{loc.name}</h3>
                          {loc.description && (
                            <p className="text-[12.5px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{loc.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-3">
                        <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                          <MapPin size={11} className="text-slate-400" />
                          <span><span className="font-semibold text-slate-700">{loc.category_count}</span> Categories</span>
                        </div>
                        <div className="w-px bg-slate-200" />
                        <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                          <Clock size={11} className="text-slate-400" />
                          <span><span className="font-semibold text-slate-700">{loc.test_count}</span> Mock Tests</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-auto pt-2 border-t border-slate-100">
                        <Link
                          href={`/mock-tests/${loc.slug}`}
                          className="flex items-center justify-between w-full h-9 px-4 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors group-hover:bg-primary-hover"
                        >
                          <span>Explore Tests</span>
                          <ChevronRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Info strip */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '🎯', label: 'Timed Exams', desc: 'Real exam conditions' },
            { icon: '⚡', label: 'Instant Results', desc: 'See your score immediately' },
            { icon: '💡', label: 'Explanations', desc: 'Learn from every answer' },
            { icon: '🆓', label: 'Completely Free', desc: 'No sign-up required to browse' },
          ].map(f => (
            <div key={f.label} className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
              <span className="text-[24px]">{f.icon}</span>
              <p className="text-[13px] font-semibold text-slate-800 mt-2">{f.label}</p>
              <p className="text-[11.5px] text-slate-400 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
