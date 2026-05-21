'use client'

import React, { useState, useTransition } from 'react'
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import { submitVote, removeVote } from '@/app/actions/agency-votes'

interface Props {
  agencyId: string
  agencySlug: string
  initialThumbsUp: number
  initialThumbsDown: number
  initialUserVote: boolean | null
}

export function AgencyVote({ agencyId, agencySlug, initialThumbsUp, initialThumbsDown, initialUserVote }: Props) {
  const [thumbsUp,   setThumbsUp]   = useState(initialThumbsUp)
  const [thumbsDown, setThumbsDown] = useState(initialThumbsDown)
  const [userVote,   setUserVote]   = useState<boolean | null>(initialUserVote)
  const [error,      setError]      = useState('')
  const [isPending,  startTransition] = useTransition()

  const total = thumbsUp + thumbsDown
  const percent = total === 0 ? null : Math.round((thumbsUp / total) * 100)

  function handleVote(vote: boolean) {
    setError('')
    startTransition(async () => {
      // Toggling same vote = remove it
      if (userVote === vote) {
        const res = await removeVote(agencyId, agencySlug)
        if (!res.success) {
          if (res.error === 'login_required') {
            window.location.href = `/auth/login?next=/agency/${agencySlug}`
          } else {
            setError(res.error)
          }
          return
        }
        setThumbsUp(res.thumbsUp)
        setThumbsDown(res.thumbsDown)
        setUserVote(null)
      } else {
        const res = await submitVote(agencyId, agencySlug, vote)
        if (!res.success) {
          if (res.error === 'login_required') {
            window.location.href = `/auth/login?next=/agency/${agencySlug}`
          } else {
            setError(res.error)
          }
          return
        }
        setThumbsUp(res.thumbsUp)
        setThumbsDown(res.thumbsDown)
        setUserVote(vote)
      }
    })
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Percentage */}
      <div className="flex items-center justify-between">
        <span className="text-slate-500 text-[13.5px]">Would recommend</span>
        <span className={`font-bold text-[13.5px] ${
          percent === null ? 'text-slate-400' :
          percent >= 70    ? 'text-[#166534]' :
          percent >= 40    ? 'text-[#92400E]' : 'text-[#B91C1C]'
        }`}>
          {percent === null ? '—' : `${percent}%`}
        </span>
      </div>

      {/* Vote bar */}
      {total > 0 && (
        <div className="h-1.5 bg-[#FEE2E2] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#22C55E] rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => handleVote(true)}
          disabled={isPending}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12.5px] font-semibold border transition-all flex-1 justify-center ${
            userVote === true
              ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#166534]'
              : 'bg-white border-slate-200 text-slate-500 hover:border-[#86EFAC] hover:text-[#166534] hover:bg-[#F0FDF4]'
          }`}
        >
          {isPending && userVote !== true ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <ThumbsUp size={13} fill={userVote === true ? 'currentColor' : 'none'} />
          )}
          {thumbsUp}
        </button>

        <button
          onClick={() => handleVote(false)}
          disabled={isPending}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12.5px] font-semibold border transition-all flex-1 justify-center ${
            userVote === false
              ? 'bg-[#FEE2E2] border-[#FCA5A5] text-[#B91C1C]'
              : 'bg-white border-slate-200 text-slate-500 hover:border-[#FCA5A5] hover:text-[#B91C1C] hover:bg-[#FEF2F2]'
          }`}
        >
          {isPending && userVote !== false ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <ThumbsDown size={13} fill={userVote === false ? 'currentColor' : 'none'} />
          )}
          {thumbsDown}
        </button>
      </div>

      {/* Login hint */}
      {!error && (
        <p className="text-[11.5px] text-slate-400 text-center">
          {userVote !== null ? 'Tap again to remove your vote' : 'Sign in to vote'}
        </p>
      )}
      {error && (
        <p className="text-[11.5px] text-[#B91C1C] text-center">{error}</p>
      )}
    </div>
  )
}
