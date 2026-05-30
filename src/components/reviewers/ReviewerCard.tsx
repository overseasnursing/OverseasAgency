import { ShieldCheck, User } from 'lucide-react'
import type { Reviewer } from '@/lib/reviewers/types'

interface Props {
  reviewer: Reviewer
}

export function ReviewerCard({ reviewer }: Props) {
  const isVerified = reviewer.verificationStatus === 'verified' && !reviewer.isDemoProfile

  return (
    <a
      href={`/reviewers/${reviewer.slug}`}
      className="group block bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-card-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <User size={20} className="text-slate-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14px] font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
              {reviewer.displayName}
            </p>
            {isVerified && (
              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] flex-shrink-0">
                <ShieldCheck size={10} />
                Verified
              </span>
            )}
            {reviewer.isDemoProfile && (
              <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] flex-shrink-0">
                Sample
              </span>
            )}
          </div>
          <p className="text-[12.5px] text-slate-500 mt-0.5">{reviewer.reviewerTitle}</p>
        </div>
      </div>

      <div className="mt-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-3 py-2">
        <p className="text-[12.5px] text-[#166534] leading-snug">{reviewer.credentialSummary}</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {reviewer.jurisdiction.map((j) => (
          <span
            key={j}
            className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500"
          >
            {j}
          </span>
        ))}
      </div>

      <p className="text-[12px] font-semibold text-primary mt-3 group-hover:underline">
        View profile →
      </p>
    </a>
  )
}
