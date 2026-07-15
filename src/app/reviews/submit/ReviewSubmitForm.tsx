'use client'

import React, { useState } from 'react'
import { CheckCircle, ChevronRight, Loader2, AlertCircle, Building2 } from 'lucide-react'
import { submitReview, updateReview } from '@/app/actions/submitReview'
import { COUNTRY_FORM_OPTIONS } from '@/lib/data/countryList'
import { useSourceCountry } from '@/lib/country/context'

type Step = 'agency' | 'financial' | 'ratings' | 'written' | 'verify'

const STEPS: { key: Step; label: string }[] = [
  { key: 'agency', label: 'Agency & Destination' },
  { key: 'financial', label: 'Financial Details' },
  { key: 'ratings', label: 'Ratings' },
  { key: 'written', label: 'Your Experience' },
  { key: 'verify', label: 'Verify & Submit' },
]

const COUNTRIES = COUNTRY_FORM_OPTIONS

const initialForm = {
  agencyName: '',
  destinationCountry: '',
  visaReceived: '',
  timelineMonths: '',
  actualCostPaid: '',
  hiddenCharges: '',
  hiddenChargesAmount: '',
  communicationRating: 0,
  transparencyRating: 0,
  speedRating: 0,
  overallRating: 0,
  title: '',
  body: '',
  wouldRecommend: '',
  recommendCondition: '',
  authorName: '',
  authorFrom: '',
  verifyConsent: false,
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
                  ? 'bg-primary text-white'
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

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="text-[28px] leading-none transition-colors"
        >
          <span className={(hovered || value) >= n ? 'text-[#F59E0B]' : 'text-slate-200'}>★</span>
        </button>
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
      className={`w-full h-10 px-3 text-[14px] text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 placeholder:text-slate-400 ${className}`}
      {...props}
    />
  )
}

function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full px-3 py-2.5 text-[14px] text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 placeholder:text-slate-400 resize-none ${className}`}
      {...props}
    />
  )
}

function Select({ className = '', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full h-10 px-3 text-[14px] text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

interface ReviewSubmitFormProps {
  lockedAgencySlug?: string
  lockedAgencyName?: string
  /** Present when editing an existing review instead of submitting a new one. */
  editReviewId?: string
  initialData?: Partial<typeof initialForm>
}

export function ReviewSubmitForm({ lockedAgencySlug, lockedAgencyName, editReviewId, initialData }: ReviewSubmitFormProps) {
  const { country, available } = useSourceCountry()
  const [step, setStep] = useState<Step>('agency')
  const [form, setForm] = useState({ ...initialForm, agencyName: lockedAgencyName ?? '', ...initialData })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [existingReviewId, setExistingReviewId] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const set = (key: keyof typeof initialForm, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // Mirrors each step's required (*) fields — without this, e.g. leaving
  // Destination Country empty silently stored "Unknown" as the placement
  // country instead of blocking progress.
  const canProceed = (): boolean => {
    switch (step) {
      case 'agency':
        return !!(lockedAgencyName || form.agencyName) && !!form.destinationCountry && !!form.visaReceived
      case 'financial':
        return Number(form.actualCostPaid) > 0 && Number(form.timelineMonths) > 0 && !!form.hiddenCharges
      case 'written':
        return !!form.title && !!form.body && !!form.wouldRecommend
          && (form.wouldRecommend !== 'With conditions' || !!form.recommendCondition)
      default:
        return true
    }
  }

  const next = () => {
    if (!canProceed()) return
    const order: Step[] = ['agency', 'financial', 'ratings', 'written', 'verify']
    const i = order.indexOf(step)
    if (i < order.length - 1) setStep(order[i + 1])
  }

  const back = () => {
    const order: Step[] = ['agency', 'financial', 'ratings', 'written', 'verify']
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

    const payload = {
      agencySlug,
      agencyName: form.agencyName,
      authorName: form.authorName,
      authorFrom: form.authorFrom || country.name,
      countryPlaced: form.destinationCountry || 'Unknown',
      timelineMonths: form.timelineMonths ? Number(form.timelineMonths) : undefined,
      actualCostPaid: form.actualCostPaid ? `₹${(Number(form.actualCostPaid) / 100000).toFixed(1)}L` : undefined,
      overallRating: form.overallRating,
      communicationRating: form.communicationRating || undefined,
      transparencyRating: form.transparencyRating || undefined,
      speedRating: form.speedRating || undefined,
      reviewText: form.body,
      hiddenCharges: form.hiddenCharges === 'Yes',
      hiddenChargesAmount: form.hiddenChargesAmount ? Number(form.hiddenChargesAmount) : undefined,
      placed: form.visaReceived === 'Yes',
      recommends: form.wouldRecommend !== 'No',
      recommendCondition: form.wouldRecommend === 'With conditions' ? form.recommendCondition : undefined,
    }

    const result = editReviewId
      ? await updateReview(editReviewId, payload)
      : await submitReview(payload)

    setSubmitting(false)
    if (result.success) {
      setSuccessMessage(result.message)
      setSubmitted(true)
    } else {
      setSubmitError(result.error)
      setExistingReviewId(result.existingReviewId ?? '')
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-[#166534]" />
        </div>
        <h2 className="text-[22px] font-bold text-slate-800 mb-2">{editReviewId ? 'Review Updated' : 'Review Submitted'}</h2>
        <p className="text-[14px] text-slate-500 max-w-md leading-relaxed mb-6">
          {successMessage || 'Thank you for sharing your experience. Our team will review it within 24–48 hours. Once verified, it will appear on the platform.'}
        </p>
        <div className="flex items-center gap-4">
          {editReviewId ? (
            <a href="/dashboard/reviews" className="text-[14px] font-semibold text-primary hover:underline">
              ← Back to my reviews
            </a>
          ) : lockedAgencySlug && (
            <a href={`/agency/${lockedAgencySlug}`} className="text-[14px] font-semibold text-primary hover:underline">
              ← Back to agency
            </a>
          )}
          <a href="/reviews" className="text-[14px] font-semibold text-slate-500 hover:underline">
            All reviews →
          </a>
        </div>
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
            <h2 className="text-[18px] font-bold text-slate-800">Which agency and destination?</h2>
            <div>
              <FieldLabel required>Agency Name</FieldLabel>
              {lockedAgencyName ? (
                <div className="flex items-center gap-2 h-10 px-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
                  <CheckCircle size={14} className="text-[#166534] flex-shrink-0" />
                  <span className="text-[14px] font-semibold text-[#166534]">{lockedAgencyName}</span>
                </div>
              ) : (
                <Input
                  placeholder="e.g. Global Nursing Solutions"
                  value={form.agencyName}
                  onChange={(e) => set('agencyName', e.target.value)}
                />
              )}
            </div>
            <div>
              <FieldLabel required>Destination Country</FieldLabel>
              <Select value={form.destinationCountry} onChange={(e) => set('destinationCountry', e.target.value)}>
                <option value="">Select country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <FieldLabel required>Did you receive your visa?</FieldLabel>
              <div className="flex gap-3">
                {['Yes', 'No', 'In progress'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set('visaReceived', opt)}
                    className={`flex-1 h-10 rounded-xl text-[13.5px] font-semibold border transition-colors ${
                      form.visaReceived === opt
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'financial' && (
          <div className="flex flex-col gap-5">
            <h2 className="text-[18px] font-bold text-slate-800">Financial details</h2>
            <p className="text-[13.5px] text-slate-500">
              These details help future nurses understand actual costs. We never show your name alongside financial data.
            </p>
            <div>
              <FieldLabel required>Total amount paid to agency (₹)</FieldLabel>
              <Input
                type="number"
                placeholder="e.g. 650000"
                value={form.actualCostPaid}
                onChange={(e) => set('actualCostPaid', e.target.value)}
              />
              <p className="text-[12px] text-slate-400 mt-1">Enter the full amount including all fees</p>
            </div>
            <div>
              <FieldLabel required>Total migration timeline (months)</FieldLabel>
              <Input
                type="number"
                placeholder="e.g. 14"
                value={form.timelineMonths}
                onChange={(e) => set('timelineMonths', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel required>Did you experience any hidden charges?</FieldLabel>
              <div className="flex gap-3">
                {['Yes', 'No'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set('hiddenCharges', opt)}
                    className={`flex-1 h-10 rounded-xl text-[13.5px] font-semibold border transition-colors ${
                      form.hiddenCharges === opt
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            {form.hiddenCharges === 'Yes' && (
              <div>
                <FieldLabel>Total hidden charges amount (₹)</FieldLabel>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  value={form.hiddenChargesAmount}
                  onChange={(e) => set('hiddenChargesAmount', e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {step === 'ratings' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-[18px] font-bold text-slate-800">Rate your experience</h2>
            {[
              { key: 'overallRating' as const, label: 'Overall Rating', description: 'Your overall experience with this agency' },
              { key: 'communicationRating' as const, label: 'Communication', description: 'How responsive and clear was the agency' },
              { key: 'transparencyRating' as const, label: 'Transparency', description: 'Were fees and timelines disclosed clearly' },
              { key: 'speedRating' as const, label: 'Speed', description: 'How efficient was the process' },
            ].map(({ key, label, description }) => (
              <div key={key}>
                <p className="text-[14px] font-semibold text-slate-800 mb-0.5">{label}</p>
                <p className="text-[12.5px] text-slate-400 mb-2">{description}</p>
                <StarSelector value={form[key] as number} onChange={(v) => set(key, v)} />
              </div>
            ))}
          </div>
        )}

        {step === 'written' && (
          <div className="flex flex-col gap-5">
            <h2 className="text-[18px] font-bold text-slate-800">Tell your story</h2>
            <div>
              <FieldLabel required>Review title</FieldLabel>
              <Input
                placeholder="e.g. Transparent fees and placed in Munich in 14 months"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel required>Your experience</FieldLabel>
              <Textarea
                rows={7}
                placeholder="Describe your experience in detail. What worked well? What didn't? Were fees as quoted? How was communication? What was the placement process like?"
                value={form.body}
                onChange={(e) => set('body', e.target.value)}
              />
              <p className="text-[12px] text-slate-400 mt-1">{form.body.split(' ').filter(Boolean).length} words</p>
            </div>
            <div>
              <FieldLabel required>Would you recommend this agency?</FieldLabel>
              <div className="flex gap-3">
                {['Yes', 'No', 'With conditions'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set('wouldRecommend', opt)}
                    className={`flex-1 h-10 rounded-xl text-[13px] font-semibold border transition-colors ${
                      form.wouldRecommend === opt
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            {form.wouldRecommend === 'With conditions' && (
              <div>
                <FieldLabel required>What conditions?</FieldLabel>
                <Textarea
                  rows={3}
                  placeholder="e.g. Only if you negotiate the fee upfront, or only for UK placements"
                  value={form.recommendCondition}
                  onChange={(e) => set('recommendCondition', e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {step === 'verify' && (
          <div className="flex flex-col gap-5">
            <h2 className="text-[18px] font-bold text-slate-800">Verify and submit</h2>
            <div>
              <FieldLabel required>Your name (as it will appear)</FieldLabel>
              <Input
                placeholder="e.g. Anitha K."
                value={form.authorName}
                onChange={(e) => set('authorName', e.target.value)}
              />
              <p className="text-[12px] text-slate-400 mt-1">You can use initials for your last name</p>
            </div>
            <div>
              <FieldLabel required>Your home country</FieldLabel>
              <Select
                value={form.authorFrom || country.name}
                onChange={(e) => set('authorFrom', e.target.value)}
              >
                {available.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </Select>
            </div>

            {/* Review summary */}
            <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-2 text-[13px]">
              <p className="font-semibold text-slate-700 mb-1">Review summary</p>
              {form.agencyName && <div className="flex justify-between"><span className="text-slate-500">Agency</span><span className="font-medium text-slate-700">{form.agencyName}</span></div>}
              {form.destinationCountry && <div className="flex justify-between"><span className="text-slate-500">Destination</span><span className="font-medium text-slate-700">{form.destinationCountry}</span></div>}
              {form.actualCostPaid && <div className="flex justify-between"><span className="text-slate-500">Amount paid</span><span className="font-medium text-slate-700">₹{(Number(form.actualCostPaid) / 100000).toFixed(1)}L</span></div>}
              {form.overallRating > 0 && <div className="flex justify-between"><span className="text-slate-500">Overall rating</span><span className="font-medium text-slate-700">{'★'.repeat(form.overallRating)} ({form.overallRating}/5)</span></div>}
            </div>

            {/* Consent */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.verifyConsent}
                onChange={(e) => set('verifyConsent', e.target.checked)}
                className="mt-0.5 rounded"
              />
              <span className="text-[13px] text-slate-600 leading-relaxed">
                I confirm this review is based on my genuine personal experience. I understand that submitting false information may result in removal and legal action. I agree to the platform terms of service.
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

          {step !== 'verify' ? (
            <button
              type="button"
              onClick={next}
              disabled={!canProceed()}
              className="flex items-center gap-1.5 h-10 px-5 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !form.verifyConsent || !form.authorName || !form.body}
              className="flex items-center gap-2 h-10 px-5 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {editReviewId ? 'Save Changes' : 'Submit Review'}
            </button>
          )}
        </div>

        {submitError && (
          <div className="mt-4 flex items-center gap-2 text-[13px] text-red-600 bg-[#FFF5F5] border border-[#FECACA] rounded-xl px-4 py-3">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>
              {submitError}
              {existingReviewId && (
                <>
                  {' '}
                  <a href={`/dashboard/reviews/${existingReviewId}/edit`} className="font-semibold underline">
                    Edit it here →
                  </a>
                </>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
