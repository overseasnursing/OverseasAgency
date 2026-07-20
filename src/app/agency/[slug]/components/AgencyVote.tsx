'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import { submitVote, removeVote, getMyVote } from '@/app/actions/agency-votes'

interface Props {
  agencyId: string
  agencySlug: string
  initialThumbsUp: number
  initialThumbsDown: number
  initialUserVote: boolean | null
  isLoggedIn: boolean
}

export function AgencyVote({
  agencyId,
  agencySlug,
  initialThumbsUp,
  initialThumbsDown,
  initialUserVote,
  isLoggedIn: initialIsLoggedIn,
}: Props) {
  const [thumbsUp,     setThumbsUp]     = useState(initialThumbsUp)
  const [thumbsDown,   setThumbsDown]   = useState(initialThumbsDown)
  const [userVote,     setUserVote]     = useState<boolean | null>(initialUserVote)
  const [isLoggedIn,   setIsLoggedIn]   = useState(initialIsLoggedIn)
  const [loginWarning, setLoginWarning] = useState(false)
  const [error,        setError]        = useState('')
  const [isPending,    startTransition] = useTransition()

  // The page renders statically (ISR) with no auth info, so the signed-in
  // user's own vote is hydrated here after mount instead.
  useEffect(() => {
    let cancelled = false
    getMyVote(agencyId).then(({ userVote, isLoggedIn }) => {
      if (cancelled) return
      setUserVote(userVote)
      setIsLoggedIn(isLoggedIn)
    })
    return () => { cancelled = true }
  }, [agencyId])

  const total   = thumbsUp + thumbsDown
  const percent = total === 0 ? 100 : Math.round((thumbsUp / total) * 100)
  const loginUrl = `/auth/login?next=/agency/${agencySlug}`

  function handleVote(vote: boolean) {
    setError('')
    // Always call the server — it is the source of truth for auth.
    // If user is not logged in the action returns login_required and we show the warning.
    startTransition(async () => {
      if (userVote === vote) {
        const res = await removeVote(agencyId, agencySlug)
        if (!res.success) {
          if (res.error === 'login_required') setLoginWarning(true)
          else setError(res.error)
          return
        }
        setThumbsUp(res.thumbsUp)
        setThumbsDown(res.thumbsDown)
        setUserVote(null)
        setLoginWarning(false)
      } else {
        const res = await submitVote(agencyId, agencySlug, vote)
        if (!res.success) {
          if (res.error === 'login_required') setLoginWarning(true)
          else setError(res.error)
          return
        }
        setThumbsUp(res.thumbsUp)
        setThumbsDown(res.thumbsDown)
        setUserVote(vote)
        setLoginWarning(false)
      }
    })
  }

  return (
    <div className="flex flex-col gap-2.5">

      {/* Percentage */}
      <div className="flex items-center justify-between">
        <span className="text-slate-500 text-[13.5px]">Would recommend</span>
        <span className={`font-bold text-[13.5px] ${
          percent >= 70 ? 'text-[#166534]' :
          percent >= 40 ? 'text-[#92400E]' : 'text-[#B91C1C]'
        }`}>
          {percent}%
        </span>
      </div>

      {/* Vote bar */}
      <div className="h-1.5 bg-[#FEE2E2] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#22C55E] rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

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
          {isPending ? (
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
          {isPending ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <ThumbsDown size={13} fill={userVote === false ? 'currentColor' : 'none'} />
          )}
          {thumbsDown}
        </button>
      </div>

      {/* Hint */}
      {!error && userVote !== null && !loginWarning && (
        <p className="text-[11.5px] text-slate-400 text-center">Tap again to remove your vote</p>
      )}
      {!error && !loginWarning && userVote === null && !isLoggedIn && (
        <p className="text-[11.5px] text-slate-400 text-center">Sign in to vote</p>
      )}
      {loginWarning && (
        <a
          href={loginUrl}
          className="text-[11.5px] font-semibold text-[#B91C1C] text-center hover:underline"
        >
          * Sign in to vote
        </a>
      )}
      {error && (
        <p className="text-[11.5px] text-[#B91C1C] text-center">{error}</p>
      )}
    </div>
  )
}
