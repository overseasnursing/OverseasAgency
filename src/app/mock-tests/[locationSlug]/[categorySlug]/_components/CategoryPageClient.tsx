'use client'

import React, { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  X, Clock, HelpCircle, Target, Play, Info,
  Lock, Mail, Eye, EyeOff, ChevronRight, Chrome, Loader2,
  BookOpen,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { startExamSession } from '@/app/actions/exam-sessions'
import type { PublicTest } from '@/lib/data/getMockTestData'

type LocationInfo = { id: string; name: string; slug: string }
type CategoryInfo = { id: string; name: string; slug: string; description: string }

/* ── Difficulty helper ──────────────────────────────────────────────── */
function getDiff(pp: number): { label: string; cls: string } {
  if (pp >= 70) return { label: 'Hard',   cls: 'bg-[#FEE2E2] text-[#B91C1C] border-red-100' }
  if (pp >= 55) return { label: 'Medium', cls: 'bg-[#FEF3C7] text-[#92400E] border-amber-100' }
  return           { label: 'Easy',   cls: 'bg-[#DCFCE7] text-[#166534] border-green-100' }
}

/* ── Test Details Modal ─────────────────────────────────────────────── */
function TestDetailsModal({
  test, onClose, onStart,
}: { test: PublicTest; onClose: () => void; onStart: () => void }) {
  const passMarks = Math.ceil(test.total_questions * test.passing_percentage / 100)
  const diff = getDiff(test.passing_percentage)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(15,23,42,0.55)' }}>
      <div className="bg-white rounded-2xl shadow-card-lg w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-[16px] font-bold text-slate-800 pr-4">{test.name}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 flex-shrink-0 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
          {[
            { value: test.duration_minutes, unit: 'Minutes' },
            { value: test.total_questions, unit: 'Questions' },
            { value: passMarks, unit: 'Pass Mark' },
          ].map(s => (
            <div key={s.unit} className="py-4 text-center">
              <p className="text-[24px] font-bold text-slate-800">{s.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{s.unit}</p>
            </div>
          ))}
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Exam details */}
          <div>
            <h3 className="text-[12.5px] font-semibold text-slate-500 uppercase tracking-wide mb-3">Exam Details</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Question Format', value: 'Multiple Choice (A, B, C, D)' },
                { label: 'Pass Requirement', value: `${test.passing_percentage}%  (${passMarks} / ${test.total_questions} correct)` },
                { label: 'Negative Marking', value: 'None' },
                { label: 'Results', value: 'Instant — shown after submission' },
              ].map(r => (
                <div key={r.label} className="flex items-start justify-between text-[13px] gap-4">
                  <span className="text-slate-400 flex-shrink-0">{r.label}</span>
                  <span className="text-slate-700 font-medium text-right">{r.value}</span>
                </div>
              ))}
              <div className="flex items-start justify-between text-[13px] gap-4">
                <span className="text-slate-400 flex-shrink-0">Difficulty</span>
                <span className={`text-[11.5px] font-semibold px-2.5 py-0.5 rounded-badge border ${diff.cls}`}>{diff.label}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          {test.instructions && (
            <div>
              <h3 className="text-[12.5px] font-semibold text-slate-500 uppercase tracking-wide mb-3">Instructions</h3>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-[12.5px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                {test.instructions}
              </div>
            </div>
          )}

          {/* Result Rules */}
          <div>
            <h3 className="text-[12.5px] font-semibold text-slate-500 uppercase tracking-wide mb-3">Result Rules</h3>
            <div className="flex flex-col gap-2">
              {[
                { emoji: '🏆', range: '90% and above', label: 'Excellent',    bg: 'bg-amber-50',  border: 'border-amber-100',  text: 'text-amber-800' },
                { emoji: '🥈', range: '75% – 89%',    label: 'Very Good',    bg: 'bg-slate-50',  border: 'border-slate-200',  text: 'text-slate-700' },
                { emoji: '👍', range: '45% – 74%',    label: 'Pass',         bg: 'bg-green-50',  border: 'border-green-100',  text: 'text-green-800' },
                { emoji: '❌', range: 'Below 45%',    label: 'Needs Review', bg: 'bg-red-50',    border: 'border-red-100',    text: 'text-red-700' },
              ].map(r => (
                <div key={r.label} className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${r.bg} ${r.border}`}>
                  <span className="text-[13px] text-slate-700">{r.emoji} {r.range}</span>
                  <span className={`text-[12px] font-semibold ${r.text}`}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose}
            className="flex-1 h-10 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl hover:border-slate-300 transition-colors">
            Close
          </button>
          <button onClick={onStart}
            className="flex-1 h-10 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
            <Play size={14} /> Start Mock Test
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Auth Modal ─────────────────────────────────────────────────────── */
function AuthModal({
  onSuccess, onClose, returnPath,
}: { onSuccess: () => void; onClose: () => void; returnPath: string }) {
  const [tab, setTab]       = useState<'login' | 'signup'>('login')
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [name, setName]     = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [info, setInfo]     = useState<string | null>(null)
  const [pending, startT]   = useTransition()

  function switchTab(t: 'login' | 'signup') { setTab(t); setError(null); setInfo(null) }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnPath)}` },
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setInfo(null)
    startT(async () => {
      const supabase = createClient()
      if (tab === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
        if (error) { setError(error.message); return }
        onSuccess()
      } else {
        const { data, error } = await supabase.auth.signUp({
          email, password: pass,
          options: { data: { full_name: name } },
        })
        if (error) { setError(error.message); return }
        if (data.session) { onSuccess(); return }
        setInfo('Check your email to confirm your account, then come back to start the test.')
      }
    })
  }

  const inputCls = 'w-full px-3 py-2.5 border border-slate-200 rounded-xl text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(15,23,42,0.65)' }}>
      <div className="bg-white rounded-2xl shadow-card-lg w-full max-w-sm p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-primary" />
            <h2 className="text-[15px] font-bold text-slate-800">Sign in to continue</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={16} /></button>
        </div>
        <p className="text-[12.5px] text-slate-500 mb-4">Create a free account to take mock tests and track your progress.</p>

        {/* Google */}
        <button onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2.5 h-10 border border-slate-200 hover:border-slate-300 rounded-xl text-[13px] font-medium text-slate-700 transition-colors mb-3">
          <Chrome size={15} /> Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[11.5px] text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="flex bg-slate-100 rounded-xl p-1 mb-4">
          {(['login', 'signup'] as const).map(t => (
            <button key={t} onClick={() => switchTab(t)}
              className={`flex-1 h-8 text-[12.5px] font-semibold rounded-lg transition-all ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {t === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        {info ? (
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-[12.5px] text-blue-700 leading-relaxed">
            <Mail size={16} className="flex-shrink-0 mt-0.5" /> {info}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {tab === 'signup' && (
              <input className={inputCls} value={name} onChange={e => setName(e.target.value)}
                placeholder="Full name" />
            )}
            <input className={inputCls} type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email address" required />
            <div className="relative">
              <input className={inputCls} type={showPw ? 'text' : 'password'} value={pass}
                onChange={e => setPass(e.target.value)} placeholder="Password" required minLength={6} />
              <button type="button" onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {error && (
              <p className="text-[12px] text-[#B91C1C] bg-[#FEE2E2] px-3 py-2 rounded-lg">{error}</p>
            )}
            <button type="submit" disabled={pending}
              className="h-10 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl disabled:opacity-60 transition-colors">
              {pending ? 'Please wait…' : tab === 'login' ? 'Login' : 'Create Free Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

/* ── Test Card ──────────────────────────────────────────────────────── */
function TestCard({
  test, index, isStarting, locationSlug, categorySlug, onDetails, onStart,
}: {
  test:         PublicTest
  index:        number
  isStarting:   boolean
  locationSlug: string
  categorySlug: string
  onDetails:    () => void
  onStart:      () => void
}) {
  const diff      = getDiff(test.passing_percentage)
  const passMarks = Math.ceil(test.total_questions * test.passing_percentage / 100)
  const studyHref = `/mock-tests/${locationSlug}/${categorySlug}/${test.slug}/study`

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-card hover:shadow-card-md hover:border-slate-300 transition-all overflow-hidden">
      {/* Number strip */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-slate-100">
        <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-[12px] font-bold flex items-center justify-center flex-shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        <Link
          href={`/mock-tests/${locationSlug}/${categorySlug}/${test.slug}`}
          className="text-[15px] font-bold text-slate-800 flex-1 leading-tight hover:text-primary transition-colors"
        >
          {test.name}
        </Link>
      </div>

      <div className="px-5 pb-5 pt-3 flex flex-col gap-3">
        {/* Stats chips */}
        <div className="flex flex-wrap gap-2">
          {[
            { icon: <Clock size={11} className="text-slate-400" />, label: `${test.duration_minutes} min` },
            { icon: <HelpCircle size={11} className="text-slate-400" />, label: `${test.total_questions} Questions` },
            { icon: <Target size={11} className="text-slate-400" />, label: `Pass: ${passMarks}/${test.total_questions}` },
          ].map(c => (
            <span key={c.label} className="flex items-center gap-1.5 text-[12px] text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
              {c.icon} {c.label}
            </span>
          ))}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-badge border ${diff.cls}`}>{diff.label}</span>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-badge bg-violet-50 text-violet-700 border border-violet-100">⚡ Instant Results</span>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-badge bg-green-50 text-green-700 border border-green-100">🆓 Free</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1 border-t border-slate-100">
          <button onClick={onDetails} disabled={isStarting}
            className="flex items-center gap-1.5 h-9 px-3 border border-slate-200 hover:border-slate-300 text-slate-600 text-[12.5px] font-medium rounded-xl transition-colors disabled:opacity-50">
            <Info size={12} /> Details
          </button>
          <Link href={studyHref}
            className="flex items-center gap-1.5 h-9 px-3 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[12.5px] font-semibold rounded-xl transition-colors">
            <BookOpen size={12} /> Study
          </Link>
          <button onClick={onStart} disabled={isStarting}
            className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-primary hover:bg-primary-hover text-white text-[12.5px] font-semibold rounded-xl transition-colors disabled:opacity-70">
            {isStarting
              ? <><Loader2 size={13} className="animate-spin" /> Setting up…</>
              : <><Play size={12} /> Start Exam <ChevronRight size={13} /></>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Passing Criteria ───────────────────────────────────────────────── */
function PassingCriteria() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-7">
      <h2 className="text-[14px] font-bold text-slate-800 mb-1">Result Grading Scale</h2>
      <p className="text-[12.5px] text-slate-400 mb-4">How your score will be evaluated after each mock test</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { emoji: '🏆', range: '90% +',      label: 'Excellent',     bg: 'bg-amber-50',  border: 'border-amber-100',  text: 'text-amber-800' },
          { emoji: '🥈', range: '75 – 89%',   label: 'Very Good',     bg: 'bg-blue-50',   border: 'border-blue-100',   text: 'text-blue-800' },
          { emoji: '👍', range: '45 – 74%',   label: 'Pass',          bg: 'bg-green-50',  border: 'border-green-100',  text: 'text-green-800' },
          { emoji: '❌', range: 'Below 45%',  label: 'Needs Review',  bg: 'bg-red-50',    border: 'border-red-100',    text: 'text-red-700' },
        ].map(c => (
          <div key={c.label} className={`flex flex-col items-center text-center p-3.5 rounded-xl border ${c.bg} ${c.border}`}>
            <span className="text-[22px] mb-1">{c.emoji}</span>
            <p className={`text-[13px] font-bold ${c.text}`}>{c.range}</p>
            <p className={`text-[11px] font-medium mt-0.5 opacity-80 ${c.text}`}>{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main Component ─────────────────────────────────────────────────── */
export function CategoryPageClient({
  location, category, tests, locationSlug, categorySlug,
}: {
  location: LocationInfo
  category: CategoryInfo
  tests: PublicTest[]
  locationSlug: string
  categorySlug: string
}) {
  const router = useRouter()
  const [detailsTest, setDetailsTest]         = useState<PublicTest | null>(null)
  const [showAuthModal, setShowAuthModal]     = useState(false)
  const [pendingTest, setPendingTest]         = useState<PublicTest | null>(null)
  const [startError, setStartError]           = useState<string | null>(null)
  const [startingId, setStartingId]           = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser]                       = useState<any>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  async function launchSession(test: PublicTest) {
    setStartError(null)
    const res = await startExamSession(test.id)
    if (res.error) {
      setStartError(res.error)
      setStartingId(null)
      return
    }
    router.push(`/mock-tests/${locationSlug}/${categorySlug}/${test.slug}/attempt/${res.attemptId}`)
    // Keep spinner showing during page transition — new page unmounts this component
  }

  function handleStart(test: PublicTest) {
    if (user) {
      setStartingId(test.id)   // immediate — shows spinner on click
      launchSession(test)
    } else {
      setPendingTest(test)
      setShowAuthModal(true)
    }
  }

  function onAuthSuccess() {
    setShowAuthModal(false)
    if (pendingTest) {
      const t = pendingTest
      setPendingTest(null)
      setStartingId(t.id)      // immediate — shows spinner on click
      launchSession(t)
    }
  }

  const currentPath = `/mock-tests/${locationSlug}/${categorySlug}`

  return (
    <>
      {detailsTest && (
        <TestDetailsModal
          test={detailsTest}
          onClose={() => setDetailsTest(null)}
          onStart={() => { setDetailsTest(null); handleStart(detailsTest) }}
        />
      )}
      {showAuthModal && (
        <AuthModal
          onSuccess={onAuthSuccess}
          returnPath={currentPath}
          onClose={() => { setShowAuthModal(false); setPendingTest(null) }}
        />
      )}
      {/* Session start error */}
      {startError && (
        <div className="mb-5 flex items-center gap-2 p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-[13px] text-[#B91C1C]">
          <span>⚠</span> {startError}
          <button onClick={() => setStartError(null)} className="ml-auto text-[#B91C1C] hover:opacity-70"><X size={14} /></button>
        </div>
      )}

      {/* Test header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-slate-800">
          {tests.length} Mock Test{tests.length !== 1 ? 's' : ''} Available
        </h2>
        {tests.length > 0 && (
          <span className="text-[12px] text-slate-400">Free · No sign-up to browse</span>
        )}
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
          <HelpCircle size={36} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-[15px] font-semibold text-slate-600 mb-2">No mock tests yet</h3>
          <p className="text-[13px] text-slate-400">Tests are being added regularly — check back soon.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {tests.map((test, i) => (
            <TestCard
              key={test.id}
              test={test}
              index={i}
              isStarting={startingId === test.id}
              locationSlug={locationSlug}
              categorySlug={categorySlug}
              onDetails={() => setDetailsTest(test)}
              onStart={() => handleStart(test)}
            />
          ))}
        </div>
      )}

      {/* Trust note */}
      <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-2xl text-center">
        <p className="text-[12.5px] text-slate-600">
          <span className="font-semibold text-primary">All mock tests are free.</span>{' '}
          Create a free account to save your progress, track scores and access detailed explanations.
        </p>
      </div>
    </>
  )
}
