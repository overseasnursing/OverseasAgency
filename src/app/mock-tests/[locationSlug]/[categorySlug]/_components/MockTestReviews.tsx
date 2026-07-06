import { Star, MessageSquare, MapPin, ScrollText } from 'lucide-react'

type Review = {
  id:               string
  reviewer_name:    string
  reviewer_country: string | null
  rating:           number
  difficulty:       'easy' | 'medium' | 'hard'
  review_title:     string | null
  review_text:      string | null
  created_at:       string
  mock_tests:       { name: string } | null
}

const DIFF_CONFIG: Record<string, { label: string; pill: string; bar: string }> = {
  easy:   { label: 'Easy',   pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200', bar: 'bg-emerald-500' },
  medium: { label: 'Medium', pill: 'bg-amber-50 text-amber-700 border border-amber-200',       bar: 'bg-amber-400'   },
  hard:   { label: 'Hard',   pill: 'bg-red-50 text-red-700 border border-red-200',             bar: 'bg-red-500'     },
}

function StarRow({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          fill={i <= rating ? '#F59E0B' : '#E2E8F0'}
          className={i <= rating ? 'text-amber-400' : 'text-slate-200'}
        />
      ))}
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

export function MockTestReviews({
  examName,
  totalCount,
  totalAvg,
  reviews,
}: {
  examName:    string
  /** True total count from all approved reviews — passed from parent to avoid a second full-scan */
  totalCount?: number
  /** True average from all approved reviews */
  totalAvg?:   number
  /** Pre-fetched by the parent page (same rows used for the JSON-LD review schema) */
  reviews:     Review[]
}) {
  if (reviews.length === 0) return null

  // Prefer the true aggregate passed from the parent (computed from ALL reviews, no limit).
  // Fall back to computing from the fetched 20 if the parent didn't pass it.
  const localAvg = Math.round(
    (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10,
  ) / 10
  const avg        = totalAvg   ?? localAvg
  const displayCount = totalCount ?? reviews.length

  // Difficulty distribution
  const diffCounts = { easy: 0, medium: 0, hard: 0 }
  reviews.forEach(r => { diffCounts[r.difficulty] = (diffCounts[r.difficulty] ?? 0) + 1 })
  const diffPct = (d: keyof typeof diffCounts) =>
    reviews.length > 0 ? Math.round((diffCounts[d] / reviews.length) * 100) : 0

  return (
    <section id="candidate-reviews" className="mt-12 scroll-mt-24">

      {/* ── Section label ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare size={14} className="text-primary" />
        <p className="text-[11px] font-bold text-primary uppercase tracking-widest">Candidate Reviews</p>
      </div>

      {/* ── Section heading + aggregate rating ─────────────────────── */}
      <h2 className="text-[22px] font-bold text-slate-800 mb-3">
        {examName} — What Nurses Say
      </h2>

      {/* Aggregate strip */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <StarRow rating={Math.round(avg)} size={18} />
        <span className="text-[17px] font-bold text-slate-800">{avg.toFixed(1)}</span>
        <span className="text-[14px] text-slate-500">
          / 5 &nbsp;·&nbsp; {displayCount} review{displayCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Two-column layout: distribution + cards ─────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Difficulty distribution panel */}
        <div className="lg:w-[240px] flex-shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-4">
              Difficulty Feedback
            </p>
            <div className="flex flex-col gap-3.5">
              {(['easy', 'medium', 'hard'] as const).map(d => {
                const pct = diffPct(d)
                const cfg = DIFF_CONFIG[d]
                return (
                  <div key={d}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full ${cfg.pill}`}>
                        {cfg.label}
                      </span>
                      <span className="text-[12.5px] font-bold text-slate-700">{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cfg.bar}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {diffCounts[d]} of {reviews.length} candidates
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
          {reviews.map(review => {
            const cfg     = DIFF_CONFIG[review.difficulty] ?? DIFF_CONFIG.medium
            const initials = review.reviewer_name
              .split(' ')
              .slice(0, 2)
              .map(w => w[0] ?? '')
              .join('')
              .toUpperCase()

            return (
              <article
                key={review.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-card transition-shadow"
              >
                {/* Header: avatar + name + country + date */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[12px] font-bold text-primary">{initials}</span>
                    </div>
                    <div>
                      <p className="text-[13.5px] font-semibold text-slate-800 leading-tight">
                        {review.reviewer_name}
                      </p>
                      {review.reviewer_country ? (
                        <p className="flex items-center gap-1 text-[11.5px] text-slate-400 mt-0.5">
                          <MapPin size={10} />
                          {review.reviewer_country}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {/* Difficulty badge */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold rounded-full flex-shrink-0 ${cfg.pill}`}>
                    {cfg.label}
                  </span>
                </div>

                {/* Stars + rating value */}
                <div className="flex items-center gap-1.5">
                  <StarRow rating={review.rating} />
                  <span className="text-[12.5px] font-bold text-slate-700">{review.rating}.0</span>
                </div>

                {/* Title — bolded, if provided */}
                {review.review_title && (
                  <p className="text-[13.5px] font-semibold text-slate-800 leading-snug">
                    &ldquo;{review.review_title}&rdquo;
                  </p>
                )}

                {/* Review body */}
                {review.review_text && (
                  <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-5">
                    {review.review_text}
                  </p>
                )}

                {/* Test name + date footer */}
                <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  {review.mock_tests?.name && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5 truncate max-w-[180px]">
                      <ScrollText size={9} className="flex-shrink-0" />
                      {review.mock_tests.name}
                    </span>
                  )}
                  <p className="text-[11.5px] text-slate-400 ml-auto">
                    {formatDate(review.created_at)}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
