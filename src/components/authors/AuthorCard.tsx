import { User } from 'lucide-react'
import type { Author } from '@/lib/authors/types'

interface Props {
  author: Author
}

export function AuthorCard({ author }: Props) {
  return (
    <a
      href={`/authors/${author.slug}`}
      className="group block bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-card-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <User size={20} className="text-slate-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14px] font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
              {author.displayName}
            </p>
            {author.isDemoProfile && (
              <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] flex-shrink-0">
                Sample
              </span>
            )}
          </div>
          <p className="text-[12.5px] text-slate-500 mt-0.5">{author.roleTitle}</p>
          {author.yearsExperience && (
            <p className="text-[11.5px] text-slate-400 mt-0.5">
              {author.yearsExperience} years experience
            </p>
          )}
        </div>
      </div>

      <p className="text-[13px] text-slate-500 leading-relaxed mt-3 line-clamp-2">
        {author.shortBio}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {author.expertiseAreas.slice(0, 3).map((area) => (
          <span
            key={area}
            className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#DBEAFE] text-[#1D4ED8]"
          >
            {area}
          </span>
        ))}
        {author.expertiseAreas.length > 3 && (
          <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
            +{author.expertiseAreas.length - 3} more
          </span>
        )}
      </div>

      <p className="text-[12px] font-semibold text-primary mt-3 group-hover:underline">
        View profile →
      </p>
    </a>
  )
}
