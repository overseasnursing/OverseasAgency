import { User, ShieldCheck, Calendar, BookOpen, Info } from 'lucide-react'

interface AttributionPerson {
  name: string
  slug: string
}

export interface AttributionSource {
  label: string
  url?: string
}

interface ContentAttributionProps {
  author?: AttributionPerson
  reviewer?: AttributionPerson
  lastReviewed?: string
  sources?: AttributionSource[]
  sourceNote: string
}

export function ContentAttribution({
  author,
  reviewer,
  lastReviewed,
  sources,
  sourceNote,
}: ContentAttributionProps) {
  const hasSources = sources && sources.length > 0

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-4">
        Source &amp; Attribution
      </p>

      <div className="flex flex-col gap-3">
        {author && (
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
              <User size={12} className="text-slate-400 flex-shrink-0" />
              Written by
            </span>
            <a
              href={`/authors/${author.slug}`}
              className="text-[12.5px] font-semibold text-primary hover:underline"
            >
              {author.name}
            </a>
          </div>
        )}

        {reviewer && (
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
              <ShieldCheck size={12} className="text-slate-400 flex-shrink-0" />
              Reviewed by
            </span>
            <a
              href={`/reviewers/${reviewer.slug}`}
              className="text-[12.5px] font-semibold text-slate-700 hover:text-primary hover:underline transition-colors"
            >
              {reviewer.name}
            </a>
          </div>
        )}

        {lastReviewed && (
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
              <Calendar size={12} className="text-slate-400 flex-shrink-0" />
              Last reviewed
            </span>
            <span className="text-[12.5px] text-slate-600">{lastReviewed}</span>
          </div>
        )}

        {hasSources && (
          <div className="pt-3 mt-1 border-t border-slate-100">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2.5">
              <BookOpen size={11} className="text-slate-300 flex-shrink-0" />
              Sources
            </p>
            <ul className="flex flex-col gap-1.5">
              {sources.map((source, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-slate-300 flex-shrink-0 text-[11px] leading-[1.6]">•</span>
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-primary hover:underline leading-relaxed"
                    >
                      {source.label}
                    </a>
                  ) : (
                    <span className="text-[12px] text-slate-500 leading-relaxed">{source.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={`flex items-start gap-2 ${hasSources ? 'pt-3 mt-1 border-t border-slate-100' : 'pt-3 mt-1 border-t border-slate-100'}`}>
          <Info size={12} className="text-slate-300 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-slate-400 leading-relaxed">{sourceNote}</p>
        </div>
      </div>
    </div>
  )
}
