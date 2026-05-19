import { CheckCircle, Star, Shield, TrendingUp, Banknote } from 'lucide-react'
import { FlagIcon } from '@/components/ui/FlagIcon'

/* Subtle dot grid as a CSS background — no SVG ID conflicts */
function DotBg({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        opacity: 0.45,
      }}
    />
  )
}

/* Soft colour blob */
function Blob({ className }: { className: string }) {
  return <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
}

export function HeroVisual() {
  return (
    <div className="relative select-none" aria-hidden="true">
      {/* Background layer */}
      <div className="absolute -inset-6 overflow-hidden rounded-3xl">
        <DotBg />
        <Blob className="top-0 right-0 w-72 h-72 bg-primary/6" />
        <Blob className="bottom-8 left-0 w-56 h-56 bg-[#22C55E]/6" />
      </div>

      {/* Cards stack */}
      <div className="relative flex flex-col gap-4 pt-2">

        {/* ── Main testimonial card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_32px_rgba(15,76,129,0.11)] p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[13px] font-bold text-[#1D4ED8] flex-shrink-0 ring-2 ring-white">
                AK
              </div>
              <div>
                <p className="text-[14px] font-semibold text-slate-800 leading-tight">Anitha Krishnan</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <FlagIcon slug="germany" size={13} className="rounded-sm" />
                  <p className="text-[12px] text-slate-400">Kerala → Frankfurt</p>
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#DCFCE7] text-[#166534] text-[10.5px] font-bold rounded-full flex-shrink-0 mt-0.5">
              <CheckCircle size={9} strokeWidth={3} />
              Placed
            </span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={13} fill="#F59E0B" className="text-[#F59E0B]" />
            ))}
            <span className="ml-1.5 text-[12px] font-semibold text-slate-600">5.0</span>
          </div>

          {/* Quote */}
          <p className="text-[13.5px] text-slate-600 italic leading-relaxed mb-4">
            &ldquo;Everything they promised happened exactly as stated. No surprise charges at any step. I had my Blaue Karte in exactly 10 months.&rdquo;
          </p>

          {/* Stats footer */}
          <div className="flex items-center gap-0 pt-3 border-t border-slate-100">
            <div className="flex-1">
              <p className="text-[10.5px] text-slate-400 mb-0.5">Total paid</p>
              <p className="text-[13.5px] font-bold text-slate-800">₹4.2L</p>
            </div>
            <div className="w-px h-8 bg-slate-100 mx-3" />
            <div className="flex-1">
              <p className="text-[10.5px] text-slate-400 mb-0.5">Timeline</p>
              <p className="text-[13.5px] font-bold text-slate-800">10 months</p>
            </div>
            <div className="w-px h-8 bg-slate-100 mx-3" />
            <div className="flex-1">
              <p className="text-[10.5px] text-slate-400 mb-0.5">Via agency</p>
              <p className="text-[13px] font-semibold text-primary truncate">Global Nursing Solutions</p>
            </div>
          </div>
        </div>

        {/* ── Two mini stat cards ── */}
        <div className="grid grid-cols-2 gap-3">

          {/* Salary card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(15,76,129,0.08)] p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <FlagIcon slug="germany" size={18} className="rounded-sm" />
              <p className="text-[12.5px] font-bold text-slate-800">Germany</p>
            </div>
            <div className="flex items-center gap-1 mb-1">
              <Banknote size={10} className="text-slate-400" />
              <p className="text-[10.5px] text-slate-400 font-medium uppercase tracking-wide">Monthly salary</p>
            </div>
            <p className="text-[17px] font-bold text-slate-800 mb-2.5 leading-none">€2,800–3,800</p>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#22C55E] rounded-full" style={{ width: '92%' }} />
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <TrendingUp size={9} className="text-[#166534]" />
              <p className="text-[10.5px] text-[#166534] font-semibold">Very High Demand</p>
            </div>
          </div>

          {/* Trust card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(15,76,129,0.08)] p-4 flex flex-col">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center mb-2.5 flex-shrink-0">
              <Shield size={17} className="text-[#166534]" />
            </div>
            <p className="text-[12.5px] font-bold text-slate-800 leading-tight mb-1">Verified Agency</p>
            <p className="text-[10.5px] text-slate-400 mb-2">No hidden fees disclosed</p>
            <div className="mt-auto">
              <div className="flex items-baseline gap-1">
                <span className="text-[20px] font-bold text-[#166534] leading-none">91</span>
                <span className="text-[11px] text-slate-400">/100 trust score</span>
              </div>
              <p className="text-[10.5px] text-slate-400 mt-0.5">312 nurse reviews</p>
            </div>
          </div>
        </div>

        {/* ── Destination pills strip ── */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { slug: 'uk',        salary: '£28K–35K/yr' },
            { slug: 'canada',    salary: 'CAD 60K+/yr' },
            { slug: 'australia', salary: 'AUD 65K+/yr' },
            { slug: 'dubai',     salary: 'AED 7K–12K/mo' },
          ].map(({ slug, salary }) => (
            <div key={slug} className="bg-white/90 rounded-xl border border-slate-100 shadow-sm px-3 py-1.5 flex items-center gap-1.5">
              <FlagIcon slug={slug} size={14} className="rounded-sm" />
              <span className="text-[11.5px] font-semibold text-slate-700 capitalize">{slug === 'dubai' ? 'Dubai' : slug === 'uk' ? 'UK' : slug.charAt(0).toUpperCase() + slug.slice(1)}</span>
              <span className="text-[10.5px] text-slate-400 hidden xl:inline">{salary}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
