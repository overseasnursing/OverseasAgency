'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Loader2, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { startExamSession } from '@/app/actions/exam-sessions'

type Props = {
  testId: string
  locationSlug: string
  categorySlug: string
  testSlug: string
}

export function TestStartButton({ testId, locationSlug, categorySlug, testSlug }: Props) {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const returnPath = `/mock-tests/${locationSlug}/${categorySlug}/${testSlug}`
  const studyHref  = `/mock-tests/${locationSlug}/${categorySlug}/${testSlug}/study`

  function handleStart() {
    setError(null)

    if (!user) {
      router.push(`/auth/login?next=${encodeURIComponent(returnPath)}`)
      return
    }

    startTransition(async () => {
      const res = await startExamSession(testId)
      if (res.error) {
        setError(res.error)
        return
      }
      router.push(`/mock-tests/${locationSlug}/${categorySlug}/${testSlug}/attempt/${res.attemptId}`)
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p className="text-[12.5px] text-[#B91C1C] bg-[#FEE2E2] px-3 py-2.5 rounded-xl">{error}</p>
      )}

      <button
        onClick={handleStart}
        disabled={isPending}
        className="w-full h-12 flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-hover disabled:opacity-70 text-white text-[15px] font-bold rounded-2xl transition-colors shadow-sm"
      >
        {isPending
          ? <><Loader2 size={16} className="animate-spin" /> Setting up your exam…</>
          : <><Play size={16} /> Start Mock Test</>}
      </button>

      <a
        href={studyHref}
        className="w-full h-11 flex items-center justify-center gap-2 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[13.5px] font-semibold rounded-xl transition-colors"
      >
        <BookOpen size={14} /> Study Mode — Questions with Explanations
      </a>

      {!user && !isPending && (
        <p className="text-[11.5px] text-slate-400 text-center">
          You&apos;ll be asked to sign in before the exam starts. It&apos;s free.
        </p>
      )}
    </div>
  )
}
