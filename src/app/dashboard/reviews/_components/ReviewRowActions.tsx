'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Pencil, EyeOff, Eye, Loader2 } from 'lucide-react'
import { toggleMyReviewDisabled } from '@/app/actions/myReviews'

export function ReviewRowActions({ id, disabled }: { id: string; disabled: boolean }) {
  const [isDisabled, setIsDisabled] = useState(disabled)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function toggle() {
    setError('')
    startTransition(async () => {
      const result = await toggleMyReviewDisabled(id, !isDisabled)
      if (result.error) setError(result.error)
      else setIsDisabled((v) => !v)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/dashboard/reviews/${id}/edit`}
        className="flex items-center gap-1.5 h-8 px-3 text-[12.5px] font-medium text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors border border-slate-200"
      >
        <Pencil size={12} /> Edit
      </Link>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={`flex items-center gap-1.5 h-8 px-3 text-[12.5px] font-medium rounded-lg transition-colors border disabled:opacity-60 ${
          isDisabled
            ? 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
            : 'text-slate-500 border-slate-200 hover:bg-slate-50'
        }`}
      >
        {pending ? <Loader2 size={12} className="animate-spin" /> : isDisabled ? <Eye size={12} /> : <EyeOff size={12} />}
        {isDisabled ? 'Enable' : 'Disable'}
      </button>
      {error && <span className="text-[11.5px] text-red-600">{error}</span>}
    </div>
  )
}
