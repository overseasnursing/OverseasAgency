'use client'

import { useState, useTransition } from 'react'
import {
  Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2,
  Building2, MapPin, Globe, Phone, MessageCircle, Users, ChevronDown,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { submitAgency, type AgencySubmissionInput } from '@/app/actions/agencySubmissions'
import { COUNTRY_FILTER_OPTIONS } from '@/lib/data/countryList'

/* ─── Shared styles ─────────────────────────────────────────────────────────── */

const inputCls = 'w-full h-10 px-3 border border-slate-200 rounded-xl text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all'
const textareaCls = 'w-full px-3 py-2.5 border border-slate-200 rounded-xl text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none'

const COMMON_SERVICES = [
  'OET Coaching', 'IELTS Coaching', 'NCLEX Coaching', 'DHA Coaching',
  'Visa Processing', 'Document Attestation', 'Job Placement',
  'Pre-departure Briefing', 'Language Training', 'Interview Preparation',
]

const DESIGNATION_OPTIONS = ['Owner', 'Director', 'Manager', 'HR Representative', 'Other']

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-slate-600">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  )
}

function ChipSelect({ options, selected, onChange }: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void
}) {
  function toggle(opt: string) {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className={`px-3 h-7 rounded-full text-[12px] font-medium border transition-all ${
              active ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40'
            }`}>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

/* ─── Login Tab ─────────────────────────────────────────────────────────────── */

function LoginTab() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const supabase = createClient()
      await supabase.auth.signOut({ scope: 'local' })
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) { setError(signInError.message); return }

      // Redirect agency admins to their panel, others to homepage
      const role = data.user?.user_metadata?.role
      window.location.href = role === 'agency_admin' ? '/agency-admin' : '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignIn} className="flex flex-col gap-4">
      <Field label="Email address">
        <div className="relative">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@agency.com" required autoComplete="email"
            className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-xl text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </Field>

      <Field label="Password">
        <div className="relative">
          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" required autoComplete="current-password"
            className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-xl text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </Field>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-red-700 leading-snug">{error}</p>
        </div>
      )}

      <button
        type="submit" disabled={loading}
        className="flex items-center justify-center gap-2 h-10 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-[13.5px] font-semibold rounded-xl transition-colors mt-1"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <><ArrowRight size={14} /> Sign in to Agency Panel</>}
      </button>

      <p className="text-center text-[12px] text-slate-400">
        Don&apos;t have an account yet?{' '}
        <a href="/claim-listing" className="text-primary font-semibold hover:underline">Claim your existing listing</a>
        {' '}or use the Submit tab above.
      </p>
    </form>
  )
}

/* ─── Submit Tab ────────────────────────────────────────────────────────────── */

function SubmitTab() {
  const [isPending, start] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    agency_name: '', city: '', state: '', website: '', email: '', phone: '', whatsapp: '',
    description: '', established_year: '',
    contact_name: '', contact_email: '', contact_phone: '', designation: 'Owner',
    countries_served: [] as string[],
    services: [] as string[],
  })

  function set(key: string, value: unknown) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.agency_name.trim()) { setError('Agency name is required'); return }
    if (!form.city.trim())        { setError('City is required'); return }
    if (!form.state.trim())       { setError('State is required'); return }
    if (!form.email.trim())       { setError('Agency email is required'); return }
    if (!form.contact_name.trim()){ setError('Your name is required'); return }
    if (!form.contact_email.trim()){ setError('Your email is required'); return }

    start(async () => {
      const input: AgencySubmissionInput = {
        agency_name:      form.agency_name,
        city:             form.city,
        state:            form.state,
        website:          form.website || undefined,
        email:            form.email,
        phone:            form.phone || undefined,
        whatsapp:         form.whatsapp || undefined,
        description:      form.description || undefined,
        countries_served: form.countries_served,
        services:         form.services,
        established_year: form.established_year ? parseInt(form.established_year) : undefined,
        contact_name:     form.contact_name,
        contact_email:    form.contact_email,
        contact_phone:    form.contact_phone || undefined,
        designation:      form.designation,
      }
      const result = await submitAgency(input)
      if (result.error) { setError(result.error); return }
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <CheckCircle2 size={26} className="text-emerald-500" />
        </div>
        <div>
          <p className="text-[17px] font-bold text-slate-900 mb-1">Submission received!</p>
          <p className="text-[13.5px] text-slate-500 max-w-sm leading-relaxed">
            We&apos;ll review your agency and contact you at <strong>{form.contact_email}</strong> within 2–3 business days. Once approved, you&apos;ll receive login credentials.
          </p>
        </div>
        <div className="mt-2 flex flex-col gap-2 w-full max-w-xs text-left bg-slate-50 rounded-xl p-4">
          {[
            'Our team reviews your submission',
            'We may contact you for verification',
            'Once approved, you\'ll receive login credentials by email',
            'You can then manage your listing from the Agency Admin panel',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
              <p className="text-[12.5px] text-slate-600">{step}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Agency Info */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Building2 size={14} className="text-primary" />
          <p className="text-[13px] font-bold text-slate-700">Agency Details</p>
        </div>
        <div className="flex flex-col gap-3">
          <Field label="Agency Name *">
            <input value={form.agency_name} onChange={e => set('agency_name', e.target.value)} className={inputCls} placeholder="e.g. Global Nursing Solutions" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City *">
              <input value={form.city} onChange={e => set('city', e.target.value)} className={inputCls} placeholder="e.g. Kochi" />
            </Field>
            <Field label="State *">
              <input value={form.state} onChange={e => set('state', e.target.value)} className={inputCls} placeholder="e.g. Kerala" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Agency Email *">
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} placeholder="info@agency.com" />
            </Field>
            <Field label="Year Established">
              <input type="number" value={form.established_year} onChange={e => set('established_year', e.target.value)} className={inputCls} placeholder="e.g. 2015" min="1980" max={new Date().getFullYear()} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone">
              <input value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls} placeholder="+91 98..." />
            </Field>
            <Field label="WhatsApp">
              <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} className={inputCls} placeholder="+91 98..." />
            </Field>
          </div>
          <Field label="Website">
            <input type="url" value={form.website} onChange={e => set('website', e.target.value)} className={inputCls} placeholder="https://www.youragency.com" />
          </Field>
          <Field label="Description" hint="Tell nurses what makes your agency trustworthy">
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={textareaCls} placeholder="Briefly describe your agency, experience, and key services..." />
          </Field>
        </div>
      </div>

      {/* Countries & Services */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Globe size={14} className="text-primary" />
          <p className="text-[13px] font-bold text-slate-700">Destinations & Services</p>
        </div>
        <div className="flex flex-col gap-3">
          <Field label="Destination Countries">
            <ChipSelect options={COUNTRY_FILTER_OPTIONS} selected={form.countries_served} onChange={v => set('countries_served', v)} />
          </Field>
          <Field label="Services Offered">
            <ChipSelect options={COMMON_SERVICES} selected={form.services} onChange={v => set('services', v)} />
          </Field>
        </div>
      </div>

      {/* Contact Person */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} className="text-primary" />
          <p className="text-[13px] font-bold text-slate-700">Your Contact Details</p>
        </div>
        <p className="text-[12px] text-slate-400 mb-3">These details are used to create your agency admin account on approval.</p>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Your Name *">
              <input value={form.contact_name} onChange={e => set('contact_name', e.target.value)} className={inputCls} placeholder="Full name" />
            </Field>
            <Field label="Your Designation *">
              <div className="relative">
                <select value={form.designation} onChange={e => set('designation', e.target.value)}
                  className={`${inputCls} appearance-none pr-8 bg-white`}>
                  {DESIGNATION_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Your Email *" hint="Used for login credentials">
              <input type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} className={inputCls} placeholder="you@agency.com" />
            </Field>
            <Field label="Your Phone">
              <input value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} className={inputCls} placeholder="+91 98..." />
            </Field>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit" disabled={isPending}
        className="flex items-center justify-center gap-2 h-10 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-[13.5px] font-semibold rounded-xl transition-colors"
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : <><Building2 size={14} /> Submit Agency for Review</>}
      </button>

      <p className="text-center text-[12px] text-slate-400 leading-relaxed">
        By submitting, you confirm that all information is accurate and you are authorised to represent this agency.
        We review all submissions before publishing.
      </p>
    </form>
  )
}

/* ─── Main ──────────────────────────────────────────────────────────────────── */

export function AgencyLoginClient({ defaultTab }: { defaultTab: 'login' | 'submit' }) {
  const [tab, setTab] = useState<'login' | 'submit'>(defaultTab)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-start justify-center px-5 py-12">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="text-[15px] font-bold text-primary hover:underline">OverseasNursing.com</a>
          <h1 className="text-[26px] font-bold text-slate-900 mt-3 mb-2">
            {tab === 'login' ? 'Agency Login' : 'Submit Your Agency'}
          </h1>
          <p className="text-[14px] text-slate-500">
            {tab === 'login'
              ? 'Sign in to manage your agency listing'
              : 'Get your agency listed and reach thousands of Indian nurses'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            {([['login', 'Agency Login'], ['submit', 'Submit Agency']] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`flex-1 py-3.5 text-[13.5px] font-semibold transition-colors ${
                  tab === key
                    ? 'text-primary border-b-2 border-primary bg-primary/4'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {tab === 'login' ? <LoginTab /> : <SubmitTab />}
          </div>
        </div>

        {/* Bottom note for login tab */}
        {tab === 'login' && (
          <p className="text-center text-[12px] text-slate-400 mt-5">
            Already listed but haven&apos;t claimed your agency?{' '}
            <a href="/claim-listing" className="text-primary font-medium hover:underline">Claim it here →</a>
          </p>
        )}
      </div>
    </div>
  )
}
