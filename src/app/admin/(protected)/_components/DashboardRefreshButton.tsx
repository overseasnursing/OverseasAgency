'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'

export default function DashboardRefreshButton() {
  const router = useRouter()
  const [pending, start] = useTransition()

  return (
    <button
      onClick={() => start(() => { router.refresh() })}
      disabled={pending}
      className="flex items-center gap-1.5 h-8 px-3 text-[12.5px] font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-50"
    >
      <RefreshCw size={12} className={pending ? 'animate-spin' : ''} />
      {pending ? 'Refreshing…' : 'Refresh'}
    </button>
  )
}
