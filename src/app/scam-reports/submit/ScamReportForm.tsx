'use client'

import React, { useState } from 'react'
import { CheckCircle, ChevronRight, Loader2, AlertTriangle, AlertCircle } from 'lucide-react'
import { submitScamReport, updateScamReport } from '@/app/actions/submitScamReport'
import { COUNTRY_FORM_OPTIONS, getSourceCountryByName } from '@/lib/data/countryList'
import { LocationCascade } from '@/components/ui/LocationCascade'
import { INDIA_ISO } from '@/lib/data/locationPicker'
import { useSourceCountry } from '@/lib/country/context'

type Step = 'agency' | 'incident' | 'details' | 'submit'

const STEPS: { key: Step; label: string }[] = [
  { key: 'agency', label: 'Agency Details' },
  { key: 'incident', label: 'What Happened' },
  { key: 'details', label: 'Warning Signs' },
  { key: 'submit', label: 'Submit' },
]

const CATEGORIES = [
  { value: 'fee-fraud', label: 'Fee Fraud', description: 'Charged undisclosed or fabricated fees' },
  { value: 'fake-job', label: 'Fake Job Offer', description: 'Presented a job that did not exist' },
  { value: 'document-fraud', label: 'Document Fraud', description: 'Provided forged or fabricated documents' },
  { value: 'visa-fraud', label: 'Visa Fraud', description: 'Fake visa processing or visa never filed' },
  { value: 'abandonment', label: 'Abandonment', description: 'Took payment and became unreachable' },
  { value: 'other', label: 'Other', description: 'Another type of fraud' },
]

const COUNTRIES = COUNTRY_FORM_OPTIONS

const initialForm = {
  agencyName: '',
  countryPromised: '',
  amountPaid: '',
  reporterState: '',
  reporterCity: '',
  amountLost: '',
  category: '',
  title: '',
  summary: '',
  fullIncident: '',
  warningSignsMissed: '',
  lessonsLearned: '',
  emotionalExperience: '',
  reporterName: '',
  reporterFrom: '',
  evidenceConsent: false,
  legalConsent: false,
}

function StepIndicator({ current }: { current: Step }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current)
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.key}>
          <div className="flex items-center gap-1.5">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                i < currentIndex
                  ? 'bg-[#166534] text-white'
                  : i === currentIndex
                  ? 'bg-[#DC2626] text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {i < currentIndex ? '✓' : i + 1}
            </div>
            <span
              className={`text-[12px] font-medium hidden sm:block ${
                i === currentIndex ? 'text-slate-800' : 'text-slate-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-2 ${i < currentIndex ? 'bg-[#166534]' : 'bg-slate-200'}`} style={{ minWidth: 12 }} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[13.5px] font-semibold text-slate-700 mb-1.5">
      {children}
      {required && <span className="text-[#DC2626] ml-0.5">*</span>}
    </label>
  )
}

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full h-10 px-3 text-[14px] text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/20 placeholder:text-slate-400 ${className}`}
      {...props}
    />
  )
}

function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full px-3 py-2.5 text-[14px] text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/20 placeholder:text-slate-400 resize-none ${className}`}
      {...props}
    />
  )
}

function Select({ className = '', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full h-10 px-3 text-[14px] text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#DC2626] ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

interface ScamReportFormProps {
  lockedAgencySlug?: string
  lockedAgencyName?: string
  /** Present when editing an existing report instead of submitting a new one. */
  editReportId?: string
  initialData?: Partial<typeof initialForm>
}

export function ScamReportForm({ lockedAgencySlug, lockedAgencyName, editReportId, initialData }: ScamReportFormProps) {
  const { country } = useSourceCountry()
  const reporterCountryIso = getSourceCountryByName(country.name)?.isoCode ?? INDIA_ISO
  const [step, setStep] = useState<Step>('agency')
  const [form, setForm] = useState({ ...initialForm, agencyName: lockedAgencyName ?? '', ...initialData })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const set = (key: keyof typeof initialForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const next = () => {
    const order: Step[] = ['agency', 'incident', 'details', 'submit']
    const i = order.indexOf(step)
    if (i < order.length - 1) setStep(order[i + 1])
  }

  const back = () => {
    const order: Step[] = ['agency', 'incident', 'details', 'submit']
    const i = order.indexOf(step)
    if (i > 0) setStep(order[i - 1])
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')

    const agencySlug = lockedAgencySlug ?? form.agencyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const warningLines = form.warningSignsMissed
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    const lessonLines = form.lessonsLearned
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

    const payload = {
      agencySlug,
      agencyName: form.agencyName,
      reporterName: form.reporterName,
      reporterFrom: form.reporterFrom,
      category: form.category as 'fee-fraud' | 'fake-job' | 'document-fraud' | 'visa-fraud' | 'abandonment' | 'other',
      severity: (Number(form.amountLost) >= 200000 ? 'critical' : Number(form.amountLost) >= 50000 ? 'high' : 'moderate') as 'critical' | 'high' | 'moderate',
      countryPromised: form.countryPromised,
      amountLost: form.amountLost ? Number(form.amountLost) : undefined,
      amountPaid: form.amountPaid ? Number(form.amountPaid) : undefined,
      incidentText: form.fullIncident,
      warningSignsMissed: warningLines.length > 0 ? warningLines : undefined,
      lessonsLearned: lessonLines.length > 0 ? lessonLines : undefined,
      emotionalExperience: form.emotionalExperience || undefined,
    }

    const result = editReportId
      ? await updateScamReport(editReportId, payload)
      : await submitScamReport(payload)

    setSubmitting(false)
    if (result.success) {
      setSuccessMessage(result.message)
      setSubmitted(true)
    } else {
      setSubmitError(result.error)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-[#166534]" />
        </div>
        <h2 className="text-[22px] font-bold text-slate-800 mb-2">{editReportId ? 'Report Updated' : 'Report Submitted'}</h2>
        <p className="text-[14px] text-slate-500 max-w-md leading-relaxed mb-2">
          {successMessage || 'Thank you for coming forward. Your report will be reviewed within 24–72 hours. We may contact you if we need additional details.'}
        </p>
        <p className="text-[13.5px] text-slate-400 max-w-md leading-relaxed mb-6">
          Once published, your report will be visible to thousands of nurses and may prevent others from experiencing the same loss.
        </p>
        {editReportId ? (
          <a href="/dashboard/scam-reports" className="text-[14px] font-semibold text-[#DC2626] hover:underline">
            ← Back to my reports
          </a>
        ) : (
          <a href="/scam-reports" className="text-[14px] font-semibold text-[#DC2626] hover:underline">
            Back to scam reports →
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <StepIndicator current={step} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        {step === 'agency' && (
          <div className="flex flex-col gap-5">
            <h2 className="text-[18px] font-bold text-slate-800">Which agency?</h2>
            <div>
              <FieldLabel required>Agency name</FieldLabel>
              {lockedAgencyName ? (
                <div className="flex items-center gap-2 h-10 px-3 bg-[#FFF5F5] border border-[#FECACA] rounded-xl">
                  <CheckCircle size={14} className="text-[#DC2626] flex-shrink-0" />
                  <span className="text-[14px] font-semibold text-[#DC2626]">{lockedAgencyName}</span>
                </div>
              ) : (
                <Input
                  placeholder="e.g. Heritage Medical Consultants"
                  value={form.agencyName}
                  onChange={(e) => set('agencyName', e.target.value)}
                />
              )}
            </div>
            <div>
              <FieldLabel required>Country they promised to place you in</FieldLabel>
              <Select value={form.countryPromised} onChange={(e) => set('countryPromised', e.target.value)}>
                <option value="">Select country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <FieldLabel required>Total amount paid (₹)</FieldLabel>
              <Input
                type="number"
                placeholder="e.g. 380000"
                value={form.amountPaid}
                onChange={(e) => set('amountPaid', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel required>Total amount lost (not recovered) (₹)</FieldLabel>
              <Input
                type="number"
                placeholder="e.g. 380000"
                value={form.amountLost}
                onChange={(e) => set('amountLost', e.target.value)}
              />
              <p className="text-[12px] text-slate-400 mt-1">Enter the same amount if nothing was recovered</p>
            </div>
            <div>
              <FieldLabel required>Type of fraud</FieldLabel>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => set('category', cat.value)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${
                      form.category === cat.value
                        ? 'border-[#DC2626] bg-[#FFF5F5]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-[13.5px] font-semibold text-slate-800">{cat.label}</p>
                      <p className="text-[12px] text-slate-500">{cat.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'incident' && (
          <div className="flex flex-col gap-5">
            <h2 className="text-[18px] font-bold text-slate-800">What happened?</h2>
            <div>
              <FieldLabel required>Report title</FieldLabel>
              <Input
                placeholder="e.g. Agency took ₹3.8L and disappeared after 9 months"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel required>Brief summary (1–2 sentences)</FieldLabel>
              <Textarea
                rows={3}
                placeholder="A short summary of what happened, for the report card preview."
                value={form.summary}
                onChange={(e) => set('summary', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel required>Full incident description</FieldLabel>
              <Textarea
                rows={10}
                placeholder="Tell the full story in detail. When did you first contact them? What were you promised? What happened over time? When did things go wrong? The more specific you are, the more useful this is to others."
                value={form.fullIncident}
                onChange={(e) => set('fullIncident', e.target.value)}
              />
              <p className="text-[12px] text-slate-400 mt-1">{form.fullIncident.split(' ').filter(Boolean).length} words — aim for 150+ words</p>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="flex flex-col gap-5">
            <h2 className="text-[18px] font-bold text-slate-800">Warning signs and lessons</h2>
            <div>
              <FieldLabel required>Warning signs you missed (one per line)</FieldLabel>
              <Textarea
                rows={5}
                placeholder="e.g. Hospital offer letters were never verified directly&#10;Additional charges appeared outside the original agreement&#10;No measurable progress after 3 months"
                value={form.warningSignsMissed}
                onChange={(e) => set('warningSignsMissed', e.target.value)}
              />
              <p className="text-[12px] text-slate-400 mt-1">These help future nurses recognize the same patterns</p>
            </div>
            <div>
              <FieldLabel required>Lessons learned (one per line)</FieldLabel>
              <Textarea
                rows={5}
                placeholder="e.g. Always verify hospital partnerships directly by calling the hospital&#10;Never pay charges that are not in the signed agreement&#10;Join a nurses community before signing anything"
                value={form.lessonsLearned}
                onChange={(e) => set('lessonsLearned', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>How did this affect you emotionally? (optional)</FieldLabel>
              <Textarea
                rows={4}
                placeholder="Sharing this can help others understand the real human cost of fraud, and help other victims feel less alone."
                value={form.emotionalExperience}
                onChange={(e) => set('emotionalExperience', e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 'submit' && (
          <div className="flex flex-col gap-5">
            <h2 className="text-[18px] font-bold text-slate-800">Final details and consent</h2>
            <div>
              <FieldLabel required>Your name (as it will appear)</FieldLabel>
              <Input
                placeholder="e.g. Rinu A."
                value={form.reporterName}
                onChange={(e) => set('reporterName', e.target.value)}
              />
              <p className="text-[12px] text-slate-400 mt-1">You can use initials for privacy</p>
            </div>
            <div>
              <FieldLabel required>Your home location</FieldLabel>
              <LocationCascade
                mode="state-city"
                country={country.name}
                countryIsoOverride={reporterCountryIso}
                state={form.reporterState}
                city={form.reporterCity}
                onStateChange={(v) => {
                  set('reporterState', v ?? '')
                  set('reporterCity', '')
                  set('reporterFrom', v ?? '')
                }}
                onCityChange={(v) => {
                  set('reporterCity', v ?? '')
                  set('reporterFrom', v && form.reporterState ? `${v}, ${form.reporterState}` : (form.reporterState || v || ''))
                }}
                className="flex flex-col gap-3"
              />
            </div>

            {/* Important disclaimer */}
            <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle size={15} className="text-[#92400E] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-[#92400E] mb-1">Important before submitting</p>
                  <p className="text-[12.5px] text-[#92400E]/80 leading-relaxed">
                    All reports are reviewed by our team. Providing false information about an agency is a serious offence and may expose you to legal action. Only submit reports based on genuine personal experience.
                  </p>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.evidenceConsent}
                onChange={(e) => set('evidenceConsent', e.target.checked)}
                className="mt-0.5 rounded"
              />
              <span className="text-[13px] text-slate-600 leading-relaxed">
                I am willing to provide documentary evidence (screenshots, contracts, receipts) if requested by the moderation team to verify this report.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.legalConsent}
                onChange={(e) => set('legalConsent', e.target.checked)}
                className="mt-0.5 rounded"
              />
              <span className="text-[13px] text-slate-600 leading-relaxed">
                I confirm this report is based on my genuine personal experience. I understand that false submissions are a legal matter. I agree to the platform terms of service.
              </span>
            </label>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={back}
            disabled={step === 'agency'}
            className="text-[13.5px] font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-0 transition-colors"
          >
            ← Back
          </button>

          {step !== 'submit' ? (
            <button
              type="button"
              onClick={next}
              className="flex items-center gap-1.5 h-10 px-5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[14px] font-semibold rounded-xl transition-colors"
            >
              Continue
              <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !form.legalConsent || !form.evidenceConsent || !form.reporterName || !form.fullIncident}
              className="flex items-center gap-2 h-10 px-5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[14px] font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {editReportId ? 'Save Changes' : 'Submit Report'}
            </button>
          )}
        </div>

        {submitError && (
          <div className="mt-4 flex items-center gap-2 text-[13px] text-red-600 bg-[#FFF5F5] border border-[#FECACA] rounded-xl px-4 py-3">
            <AlertCircle size={14} className="flex-shrink-0" />
            {submitError}
          </div>
        )}
      </div>
    </div>
  )
}
