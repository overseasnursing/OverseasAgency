'use client'

import { useState, useTransition, useRef } from 'react'
import { Search, CheckCircle2, Building2, ChevronRight, ArrowLeft, Loader2, ShieldCheck, Clock, Star } from 'lucide-react'
import {
  searchAgenciesForClaim,
  submitClaimRequest,
  verifyClaimOtp,
  resendClaimOtp,
  type AgencySearchResult,
} from '@/app/actions/claimListing'

// ── Step types ────────────────────────────────────────────────────────────────

type Step = 'search' | 'form' | 'otp' | 'success'

// ── Sub-components ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { key: 'search', label: 'Find Agency' },
    { key: 'form',   label: 'Your Details' },
    { key: 'otp',    label: 'Verify Email' },
  ]
  const idx = steps.findIndex(s => s.key === current)
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-0 flex-1">
          <div className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors ${
              i < idx  ? 'bg-primary text-white' :
              i === idx ? 'bg-primary text-white ring-4 ring-primary/20' :
              'bg-slate-100 text-slate-400'
            }`}>
              {i < idx ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span className={`text-[11px] mt-1 font-medium ${i <= idx ? 'text-primary' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-[2px] flex-1 mx-1 mb-5 rounded transition-colors ${i < idx ? 'bg-primary' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Step 1: Search ────────────────────────────────────────────────────────────

function SearchStep({ onSelect }: { onSelect: (a: AgencySearchResult) => void }) {
  const [query, setQuery]   = useState('')
  const [results, setResults] = useState<AgencySearchResult[]>([])
  const [searched, setSearched] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError]   = useState('')

  function handleSearch(q: string) {
    setQuery(q)
    if (q.trim().length < 2) { setResults([]); setSearched(false); return }
    startTransition(async () => {
      const res = await searchAgenciesForClaim(q)
      if (res.error) { setError(res.error); return }
      setResults(res.results ?? [])
      setSearched(true)
      setError('')
    })
  }

  return (
    <div>
      <h2 className="text-[20px] font-bold text-slate-900 mb-1">Find your agency</h2>
      <p className="text-[13.5px] text-slate-500 mb-6">Search for your agency name to get started.</p>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Type your agency name..."
          className="w-full h-12 pl-10 pr-4 text-[14px] bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          autoFocus
        />
        {isPending && <Loader2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />}
      </div>

      {error && <p className="text-[13px] text-red-600 mb-3">{error}</p>}

      {searched && results.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Building2 size={28} className="mx-auto mb-2 opacity-40" />
          <p className="text-[13.5px]">No agencies found for &ldquo;{query}&rdquo;</p>
          <p className="text-[12px] mt-1">Try a shorter or different name.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-2">
          {results.map(agency => (
            <button
              key={agency.id}
              type="button"
              onClick={() => !agency.isClaimed && onSelect(agency)}
              disabled={agency.isClaimed}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                agency.isClaimed
                  ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                  : 'bg-white border-slate-200 hover:border-primary hover:bg-primary/4 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Building2 size={16} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-slate-800">{agency.name}</p>
                  {(agency.city || agency.state) && (
                    <p className="text-[12px] text-slate-400">{[agency.city, agency.state].filter(Boolean).join(', ')}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {agency.isClaimed ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={11} /> Claimed
                  </span>
                ) : (
                  <ChevronRight size={16} className="text-slate-300" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Step 2: Claim Form ────────────────────────────────────────────────────────

const DESIGNATIONS = ['Owner', 'Director', 'CEO', 'Manager', 'HR Manager', 'Other']

function ClaimForm({
  agency,
  onBack,
  onSubmit,
}: {
  agency: AgencySearchResult
  onBack: () => void
  onSubmit: (claimId: string) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await submitClaimRequest({
        agencyId:    agency.id,
        agencyName:  agency.name,
        contactName: fd.get('contactName') as string,
        designation: fd.get('designation') as string,
        email:       fd.get('email') as string,
        phone:       fd.get('phone') as string,
        message:     fd.get('message') as string,
      })
      if (res.error) { setError(res.error); return }
      onSubmit(res.claimId!)
    })
  }

  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-slate-600 mb-5 transition-colors">
        <ArrowLeft size={14} /> Back to search
      </button>

      <div className="flex items-center gap-3 p-3.5 bg-primary/5 border border-primary/15 rounded-xl mb-6">
        <Building2 size={16} className="text-primary flex-shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-slate-800">{agency.name}</p>
          {(agency.city || agency.state) && (
            <p className="text-[11.5px] text-slate-500">{[agency.city, agency.state].filter(Boolean).join(', ')}</p>
          )}
        </div>
      </div>

      <h2 className="text-[20px] font-bold text-slate-900 mb-1">Your contact details</h2>
      <p className="text-[13.5px] text-slate-500 mb-6">We&apos;ll verify your email before submitting to our team for review.</p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-[13px] text-red-700">{error}</p>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
            <input
              name="contactName"
              required
              placeholder="Your full name"
              className="h-10 px-3 text-[13.5px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-slate-700">Designation <span className="text-red-500">*</span></label>
            <select
              name="designation"
              required
              defaultValue=""
              className="h-10 px-3 text-[13.5px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            >
              <option value="" disabled>Select role</option>
              {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-slate-700">Business Email <span className="text-red-500">*</span></label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@agencyname.com"
              className="h-10 px-3 text-[13.5px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <p className="text-[11.5px] text-slate-400">An OTP will be sent to this address.</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-slate-700">Phone Number</label>
            <input
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              className="h-10 px-3 text-[13.5px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Message <span className="text-[12px] font-normal text-slate-400">(optional)</span></label>
          <textarea
            name="message"
            rows={3}
            placeholder="Briefly describe your role at this agency..."
            className="px-3 py-2.5 text-[13.5px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 h-11 w-full bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isPending ? <><Loader2 size={16} className="animate-spin" /> Sending OTP...</> : 'Send Verification Code'}
        </button>
      </form>
    </div>
  )
}

// ── Step 3: OTP ───────────────────────────────────────────────────────────────

function OtpStep({
  claimId,
  email,
  onBack,
  onVerified,
}: {
  claimId: string
  email: string
  onBack: () => void
  onVerified: () => void
}) {
  const [otp, setOtp]         = useState('')
  const [error, setError]     = useState('')
  const [resent, setResent]   = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isResending, startResend]   = useTransition()

  function handleVerify() {
    if (otp.trim().length !== 6) { setError('Please enter the 6-digit code.'); return }
    startTransition(async () => {
      const res = await verifyClaimOtp(claimId, otp.trim())
      if (res.error) { setError(res.error); return }
      onVerified()
    })
  }

  function handleResend() {
    setResent(false)
    startResend(async () => {
      const res = await resendClaimOtp(claimId)
      if (res.error) { setError(res.error); return }
      setResent(true)
      setOtp('')
      setError('')
    })
  }

  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-slate-600 mb-5 transition-colors">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={26} className="text-primary" />
        </div>
        <h2 className="text-[20px] font-bold text-slate-900 mb-1">Check your email</h2>
        <p className="text-[13.5px] text-slate-500">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-[13px] text-red-700">{error}</p>
        </div>
      )}

      {resent && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <p className="text-[13px] text-emerald-700">New code sent! Check your inbox.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={otp}
          onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError('') }}
          placeholder="000000"
          className="w-full h-14 text-center text-[28px] font-bold tracking-[12px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          autoFocus
        />

        <button
          type="button"
          onClick={handleVerify}
          disabled={isPending || otp.length !== 6}
          className="h-11 w-full bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isPending ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : 'Verify & Submit Claim'}
        </button>

        <div className="flex items-center justify-center gap-1.5">
          <Clock size={13} className="text-slate-400" />
          <p className="text-[12.5px] text-slate-400">Code expires in 10 minutes.</p>
        </div>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="text-[13px] text-primary hover:underline disabled:opacity-60 mx-auto"
        >
          {isResending ? 'Resending...' : "Didn't receive it? Resend code"}
        </button>
      </div>
    </div>
  )
}

// ── Step 4: Success ───────────────────────────────────────────────────────────

function SuccessStep({ agencyName }: { agencyName: string }) {
  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 size={30} className="text-emerald-600" />
      </div>
      <h2 className="text-[22px] font-bold text-slate-900 mb-2">Claim submitted!</h2>
      <p className="text-[14px] text-slate-500 mb-6 max-w-sm mx-auto">
        Your claim request for <strong>{agencyName}</strong> has been submitted. Our team will review it
        within <strong>2–3 business days</strong>.
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-6 max-w-sm mx-auto">
        <p className="text-[12.5px] font-semibold text-slate-700 mb-2">What happens next?</p>
        <ol className="flex flex-col gap-2">
          {[
            'Our team reviews your claim and verifies ownership.',
            "You'll receive an email with login details once approved.",
            'You can then manage your complete agency listing.',
          ].map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-[12.5px] text-slate-500">
              <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
      </div>

      <a
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-[13.5px] font-semibold rounded-xl hover:bg-primary-hover transition-colors"
      >
        Back to Home
      </a>
    </div>
  )
}

// ── Main orchestrator ─────────────────────────────────────────────────────────

export function ClaimListingClient() {
  const [step, setStep]       = useState<Step>('search')
  const [agency, setAgency]   = useState<AgencySearchResult | null>(null)
  const [claimId, setClaimId] = useState('')
  const [email, setEmail]     = useState('')

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={20} className="text-primary" />
            <span className="text-[13px] font-semibold text-primary uppercase tracking-wide">Agency Owners</span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-bold text-slate-900 leading-tight mb-3">
            Claim Your Agency Listing
          </h1>
          <p className="text-[15px] text-slate-500 max-w-lg">
            Take control of your profile on OverseasNursing.com. Manage your pricing, respond to reviews, update your details, and build trust with nurses.
          </p>

          {/* Benefits bar */}
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { icon: Star,         label: 'Manage reviews' },
              { icon: Building2,    label: 'Update your listing' },
              { icon: ShieldCheck,  label: 'Verified badge' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-[12.5px] font-medium text-slate-600">
                <Icon size={14} className="text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
          {step !== 'success' && <StepIndicator current={step} />}

          {step === 'search' && (
            <SearchStep
              onSelect={a => { setAgency(a); setStep('form') }}
            />
          )}

          {step === 'form' && agency && (
            <ClaimForm
              agency={agency}
              onBack={() => setStep('search')}
              onSubmit={(id) => {
                setClaimId(id)
                // Extract email from the form (stored in state via form submit)
                const form = document.querySelector('form')
                const fd = form ? new FormData(form) : null
                setEmail((fd?.get('email') as string) ?? '')
                setStep('otp')
              }}
            />
          )}

          {step === 'otp' && (
            <OtpStep
              claimId={claimId}
              email={email}
              onBack={() => setStep('form')}
              onVerified={() => setStep('success')}
            />
          )}

          {step === 'success' && agency && (
            <SuccessStep agencyName={agency.name} />
          )}
        </div>
      </div>
    </div>
  )
}
