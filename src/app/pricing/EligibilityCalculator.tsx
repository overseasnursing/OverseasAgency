'use client'

import React, { useState } from 'react'
import { ArrowRight, ArrowLeft, CheckCircle, Clock, Banknote, Globe, TrendingUp, RotateCcw } from 'lucide-react'
import { FlagIcon } from '@/components/ui/FlagIcon'
import { AgencyCard } from '@/components/agencies/AgencyCard'
import type { Agency } from '@/types/agency'
import { useSourceCountry } from '@/lib/country/context'
import { getSourceCountryByName } from '@/lib/data/countryList'

/* ── Types ────────────────────────────────────────────────────────── */

type CountrySlug = 'germany' | 'uk' | 'canada' | 'australia' | 'dubai'

interface Option {
  id: string
  label: string
  description: string
  scores: Record<CountrySlug, number>
}

interface Question {
  id: string
  question: string
  subtitle: string
  options: Option[]
}

/* ── Scoring data ─────────────────────────────────────────────────── */

const QUESTIONS: Question[] = [
  {
    id: 'qualification',
    question: 'What is your nursing qualification?',
    subtitle: 'Your degree determines eligibility thresholds for registration abroad.',
    options: [
      { id: 'bsc',       label: 'BSc Nursing',        description: '4-year degree programme',        scores: { germany: 15, uk: 20, canada: 20, australia: 22, dubai: 15 } },
      { id: 'gnm',       label: 'GNM',                description: 'General Nursing & Midwifery',    scores: { germany: 10, uk: 10, canada:  5, australia:  8, dubai: 15 } },
      { id: 'postbasic', label: 'Post Basic BSc',      description: '2-year programme after GNM',     scores: { germany: 15, uk: 18, canada: 15, australia: 18, dubai: 15 } },
      { id: 'msc',       label: 'MSc / Specialist',   description: 'Masters or specialty degree',    scores: { germany: 20, uk: 20, canada: 25, australia: 25, dubai: 12 } },
    ],
  },
  {
    id: 'experience',
    question: 'How many years of clinical experience do you have?',
    subtitle: 'Post-registration hospital experience, not internship.',
    options: [
      { id: 'lt1', label: 'Less than 1 year', description: 'Fresher or recently registered',   scores: { germany:  5, uk:  5, canada:  0, australia:  0, dubai: 18 } },
      { id: '1to3', label: '1 – 3 years',     description: 'Early career nurse',               scores: { germany: 10, uk: 15, canada: 10, australia: 12, dubai: 18 } },
      { id: '3to5', label: '3 – 5 years',     description: 'Mid-career with solid experience', scores: { germany: 15, uk: 18, canada: 18, australia: 20, dubai: 15 } },
      { id: 'gt5',  label: 'More than 5 years', description: 'Senior or specialist nurse',     scores: { germany: 20, uk: 20, canada: 25, australia: 22, dubai: 12 } },
    ],
  },
  {
    id: 'english',
    question: 'What is your current English proficiency?',
    subtitle: 'Be honest — this affects which exams you can pass and how quickly.',
    options: [
      { id: 'basic',     label: 'Basic',            description: 'Can understand but limited speaking',  scores: { germany: 18, uk:  0, canada:  0, australia:  0, dubai:  8 } },
      { id: 'mid',       label: 'Intermediate',     description: 'IELTS 5.5 – 6.0 level',                scores: { germany: 12, uk:  8, canada:  5, australia:  5, dubai: 12 } },
      { id: 'good',      label: 'Good',             description: 'IELTS 6.5 – 7.0 level',                scores: { germany:  8, uk: 18, canada: 15, australia: 18, dubai: 15 } },
      { id: 'excellent', label: 'Excellent',         description: 'IELTS 7.0+ or native-level',           scores: { germany:  5, uk: 22, canada: 22, australia: 22, dubai: 15 } },
    ],
  },
  {
    id: 'goal',
    question: 'What is your primary migration goal?',
    subtitle: 'Your goal shapes which country gives you the best long-term outcome.',
    options: [
      { id: 'pr',      label: 'Permanent Residency',           description: 'Settle abroad permanently with PR status',   scores: { germany: 22, uk: 12, canada: 25, australia: 18, dubai:  0 } },
      { id: 'earn',    label: 'Maximum Savings',               description: 'Earn as much as possible, send money home',   scores: { germany:  8, uk: 15, canada: 18, australia: 22, dubai: 25 } },
      { id: 'career',  label: 'Career Growth',                 description: 'International experience, skill building',    scores: { germany: 15, uk: 22, canada: 18, australia: 18, dubai: 10 } },
      { id: 'fast',    label: 'Fast Placement',                description: 'Working abroad within 3–6 months',            scores: { germany:  0, uk: 10, canada:  0, australia:  5, dubai: 25 } },
    ],
  },
  {
    id: 'budget',
    question: 'What is your total budget for migration?',
    subtitle: 'Includes agency fee, exam costs, visa, and relocation. Family support counts too.',
    options: [
      { id: 'lt2',   label: 'Less than ₹2 Lakhs', description: 'Very limited — needs a low-cost pathway',   scores: { germany:  0, uk:  0, canada:  0, australia:  0, dubai: 25 } },
      { id: '2to5',  label: '₹2L – ₹5L',          description: 'Budget-conscious migration',                 scores: { germany:  8, uk: 15, canada:  0, australia:  0, dubai: 20 } },
      { id: '5to9',  label: '₹5L – ₹9L',          description: 'Mid-range, most pathways accessible',        scores: { germany: 22, uk: 20, canada:  8, australia: 15, dubai: 12 } },
      { id: 'gt9',   label: 'More than ₹9L',       description: 'Full budget — all options open',             scores: { germany: 15, uk: 15, canada: 25, australia: 22, dubai:  5 } },
    ],
  },
  {
    id: 'language',
    question: 'Are you willing to learn German or another European language?',
    subtitle: 'Germany requires B2 German (~12–18 months prep). Other countries are English-only.',
    options: [
      { id: 'yes',   label: 'Yes, absolutely',       description: 'I will invest 12–18 months on language training',  scores: { germany: 30, uk:  5, canada:  5, australia:  5, dubai:  5 } },
      { id: 'maybe', label: 'Maybe, if worth it',    description: 'Open to it if the benefits are significant',       scores: { germany: 15, uk: 10, canada: 10, australia: 10, dubai: 10 } },
      { id: 'no',    label: 'No — English only',     description: 'I prefer an English-speaking country',             scores: { germany:  0, uk: 22, canada: 22, australia: 22, dubai: 22 } },
    ],
  },
  {
    id: 'specialty',
    question: 'What is your primary nursing specialty?',
    subtitle: 'Demand varies by specialty — some countries have critical shortages in specific areas.',
    options: [
      { id: 'icu',      label: 'ICU / Critical Care / Emergency', description: 'Highest demand globally',               scores: { germany: 15, uk: 22, canada: 18, australia: 25, dubai: 15 } },
      { id: 'general',  label: 'General Ward / OPD / Med-Surg',   description: 'Broad opportunities everywhere',        scores: { germany: 10, uk: 12, canada: 12, australia: 12, dubai: 15 } },
      { id: 'ot',       label: 'OT / Theatre / Anaesthesia',      description: 'Strong demand in UK and Australia',     scores: { germany: 12, uk: 20, canada: 15, australia: 15, dubai: 12 } },
      { id: 'paeds',    label: 'Paediatrics / NICU / Neonatology', description: 'High demand in UK and Canada',         scores: { germany: 15, uk: 18, canada: 18, australia: 20, dubai: 10 } },
      { id: 'other',    label: 'Other / Not specialised yet',      description: 'General nursing experience',            scores: { germany:  8, uk: 10, canada: 10, australia: 10, dubai: 12 } },
    ],
  },
  {
    id: 'family',
    question: 'What is your personal situation?',
    subtitle: 'This affects relocation cost, visa category, and how quickly you can start.',
    options: [
      { id: 'single',   label: 'Single — fully flexible',         description: 'Can relocate immediately, anywhere',    scores: { germany: 15, uk: 15, canada: 18, australia: 18, dubai: 22 } },
      { id: 'spouse',   label: 'Married — spouse will join me',   description: 'Dependent visa needed, higher cost',    scores: { germany: 12, uk: 12, canada: 15, australia: 15, dubai: 15 } },
      { id: 'remote',   label: 'Married — spouse stays in India', description: 'Lower upfront cost, remittance focus',  scores: { germany: 10, uk: 10, canada: 12, australia: 12, dubai: 12 } },
      { id: 'children', label: 'Have children / dependents',      description: 'School, housing, dependent visas needed', scores: { germany:  8, uk: 10, canada: 10, australia: 10, dubai:  8 } },
    ],
  },
]

/* Max possible score per country (best answer for each question) */
const MAX_SCORES: Record<CountrySlug, number> = {
  germany:   162,
  uk:        163,
  canada:    180,
  australia: 178,
  dubai:     157,
}

const COUNTRY_META: Record<CountrySlug, {
  name: string
  slug: string
  costRange: string
  salaryDisplay: string
  timeline: string
  prLabel: string
  taxFree: boolean
  highlights: string[]
  watch: string
}> = {
  germany: {
    name: 'Germany',
    slug: 'germany',
    costRange: '₹5L – ₹9L',
    salaryDisplay: '€2,800 – ₹3,800/mo',
    timeline: '12–24 months',
    prLabel: 'PR in 4 years',
    taxFree: false,
    highlights: ['EU Blue Card & permanent residency', 'Strongest worker rights in Europe', 'Publicly funded healthcare system', 'No NCLEX — German B2 required'],
    watch: 'Language training adds 12–18 months to timeline',
  },
  uk: {
    name: 'United Kingdom',
    slug: 'uk',
    costRange: '₹4L – ₹7L',
    salaryDisplay: '£28K – £35K/yr',
    timeline: '8–16 weeks',
    prLabel: 'PR in 5 years',
    taxFree: false,
    highlights: ['Fastest English-speaking pathway', 'NHS experience valued worldwide', 'CBT + OSCE for NMC registration', 'Strong Indian nurse community'],
    watch: 'OSCE retake fees often not disclosed upfront',
  },
  canada: {
    name: 'Canada',
    slug: 'canada',
    costRange: '₹8L – ₹14L',
    salaryDisplay: 'CAD 60K – 85K/yr',
    timeline: '12–20 months',
    prLabel: 'Express Entry PR',
    taxFree: false,
    highlights: ['Fastest Express Entry PR pathway', 'NCLEX-RN for all provinces', 'Top quality of life globally', 'Strong family sponsorship options'],
    watch: 'Most expensive — budget must be realistic',
  },
  australia: {
    name: 'Australia',
    slug: 'australia',
    costRange: '₹6L – ₹11L',
    salaryDisplay: 'AUD 65K – 90K/yr',
    timeline: '10–18 months',
    prLabel: 'Skilled migration PR',
    taxFree: false,
    highlights: ['Highest ICU & critical care demand', 'AHPRA registration globally respected', 'Strong PR through skilled migration', 'Excellent work-life balance'],
    watch: 'AHPRA skills assessment can surprise — plan ahead',
  },
  dubai: {
    name: 'Dubai / UAE',
    slug: 'dubai',
    costRange: '₹1.5L – ₹5L',
    salaryDisplay: 'AED 7K – 12K/mo',
    timeline: '2–6 weeks',
    prLabel: 'No PR pathway',
    taxFree: true,
    highlights: ['Zero income tax — highest take-home pay', 'Fastest placement globally (2–6 weeks)', 'Lowest upfront cost of all destinations', 'DHA / HAAD exam required'],
    watch: 'No permanent residency — contract-based employment',
  },
}

/* ── Score calculator ─────────────────────────────────────────────── */

function calculateScores(answers: Record<string, string>): { slug: CountrySlug; score: number; pct: number }[] {
  const raw: Record<CountrySlug, number> = { germany: 0, uk: 0, canada: 0, australia: 0, dubai: 0 }

  for (const question of QUESTIONS) {
    const answerId = answers[question.id]
    if (!answerId) continue
    const option = question.options.find((o) => o.id === answerId)
    if (!option) continue
    for (const country of Object.keys(raw) as CountrySlug[]) {
      raw[country] += option.scores[country]
    }
  }

  const results = (Object.keys(raw) as CountrySlug[]).map((slug) => ({
    slug,
    score: raw[slug],
    pct: Math.round((raw[slug] / MAX_SCORES[slug]) * 100),
  }))

  return results.sort((a, b) => b.pct - a.pct)
}

/* ── Progress bar ─────────────────────────────────────────────────── */

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[12px] text-slate-400 font-medium flex-shrink-0">
        {current} / {total}
      </span>
    </div>
  )
}

/* ── Match badge ──────────────────────────────────────────────────── */

function MatchBadge({ pct }: { pct: number }) {
  const color =
    pct >= 75 ? 'bg-[#DCFCE7] text-[#166534]' :
    pct >= 55 ? 'bg-[#DBEAFE] text-[#1D4ED8]' :
                'bg-slate-100 text-slate-500'
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold ${color}`}>
      {pct}% match
    </span>
  )
}

/* ── Top result card ──────────────────────────────────────────────── */

function TopResultCard({ slug, pct, rank }: { slug: CountrySlug; pct: number; rank: number }) {
  const meta = COUNTRY_META[slug]
  return (
    <div className={`bg-white rounded-2xl border-2 p-6 ${rank === 0 ? 'border-primary shadow-card-lg' : 'border-slate-200 shadow-card'}`}>
      {rank === 0 && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-white text-[11px] font-bold rounded-full mb-4 uppercase tracking-wide">
          Best Match
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <FlagIcon slug={slug} size={40} className="rounded-md" />
          <div>
            <h3 className="text-[18px] font-bold text-slate-800">{meta.name}</h3>
            <p className="text-[12.5px] text-slate-400">{meta.prLabel}</p>
          </div>
        </div>
        <MatchBadge pct={pct} />
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1"><Banknote size={9} />Salary</p>
          <p className="text-[12.5px] font-bold text-slate-800">{meta.salaryDisplay}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1"><Banknote size={9} />Total Cost</p>
          <p className="text-[12.5px] font-bold text-slate-800">{meta.costRange}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1"><Clock size={9} />Timeline</p>
          <p className="text-[12.5px] font-bold text-slate-800">{meta.timeline}</p>
        </div>
      </div>

      {/* Highlights */}
      <ul className="space-y-2 mb-5">
        {meta.highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px] text-slate-700">
            <CheckCircle size={13} className="text-[#166534] mt-0.5 flex-shrink-0" />
            {h}
          </li>
        ))}
      </ul>

      {/* Watch out */}
      <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl px-4 py-3 mb-5">
        <p className="text-[12px] text-[#92400E]">
          <span className="font-semibold">Watch: </span>{meta.watch}
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <a
          href={`/country/${meta.slug}`}
          className="flex-1 flex items-center justify-center gap-1.5 h-10 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
        >
          Full {meta.name} Guide <ArrowRight size={13} />
        </a>
        <a
          href={`/pricing/${meta.slug}`}
          className="flex-1 flex items-center justify-center gap-1.5 h-10 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13px] font-medium rounded-xl transition-colors"
        >
          See Migration Costs
        </a>
      </div>
    </div>
  )
}

/* ── Compact result row ───────────────────────────────────────────── */

function CompactResult({ slug, pct, rank }: { slug: CountrySlug; pct: number; rank: number }) {
  const meta = COUNTRY_META[slug]
  return (
    <a
      href={`/country/${meta.slug}`}
      className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 px-5 py-4 hover:border-primary/30 hover:shadow-card transition-all group"
    >
      <span className="text-[13px] font-bold text-slate-300 w-5 flex-shrink-0">#{rank + 1}</span>
      <FlagIcon slug={slug} size={28} className="rounded-sm flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-slate-800">{meta.name}</p>
        <p className="text-[12px] text-slate-400">{meta.salaryDisplay} · {meta.costRange}</p>
      </div>
      <MatchBadge pct={pct} />
      <ArrowRight size={14} className="text-slate-300 group-hover:text-primary transition-colors flex-shrink-0" />
    </a>
  )
}

/* ── Agency helpers ───────────────────────────────────────────────── */

const COUNTRY_DISPLAY_NAMES: Record<CountrySlug, string[]> = {
  germany:   ['Germany'],
  uk:        ['UK', 'United Kingdom'],
  canada:    ['Canada'],
  australia: ['Australia'],
  dubai:     ['UAE', 'Dubai'],
}

function getAgenciesForCountry(slug: CountrySlug, allAgencies: Agency[]): Agency[] {
  const names = COUNTRY_DISPLAY_NAMES[slug]
  return allAgencies
    .filter(a => a.countries.some(c => names.includes(c)) && a.trustLevel !== 'scam-reported')
    .sort((a, b) => b.transparencyScore - a.transparencyScore || b.rating - a.rating)
    .slice(0, 3)
}

/* ── Main component ───────────────────────────────────────────────── */

export function EligibilityCalculator({ agencies }: { agencies: Agency[] }) {
  // Source Country default — intro copy only; the quiz questions, scoring,
  // and country matching below are entirely unchanged (Phase 7 scope).
  const { country, ready } = useSourceCountry()
  const demonym = ready ? getSourceCountryByName(country.name)?.demonym : undefined

  const [step, setStep]       = useState<number>(0) // 0 = intro, 1–8 = questions, 9 = results
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)

  const totalSteps = QUESTIONS.length
  const isIntro    = step === 0
  const isResults  = step === totalSteps + 1
  const currentQ   = !isIntro && !isResults ? QUESTIONS[step - 1] : null

  function handleOptionClick(optionId: string) {
    setSelected(optionId)
  }

  function handleNext() {
    if (!currentQ || !selected) return
    const newAnswers = { ...answers, [currentQ.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)
    if (step === totalSteps) {
      setStep(totalSteps + 1) // go to results
    } else {
      setStep(step + 1)
    }
  }

  function handleBack() {
    setSelected(null)
    if (step > 1) {
      const prevQ = QUESTIONS[step - 2]
      setSelected(answers[prevQ.id] ?? null)
    }
    setStep(Math.max(0, step - 1))
  }

  function handleRestart() {
    setStep(0)
    setAnswers({})
    setSelected(null)
  }

  // Restore previously saved answer when going back
  React.useEffect(() => {
    if (currentQ && answers[currentQ.id]) {
      setSelected(answers[currentQ.id])
    } else {
      setSelected(null)
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  const results = isResults ? calculateScores(answers) : []
  const topTwo  = results.slice(0, 2)
  const rest    = results.slice(2)

  /* ── Intro screen ── */
  if (isIntro) {
    return (
      <div className="min-h-[60vh] flex items-center">
        <div className="w-full max-w-content mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#DBEAFE] text-[#1D4ED8] rounded-full text-[12.5px] font-semibold mb-6">
            <TrendingUp size={13} />
            Free · 8 questions · 3 minutes
          </div>

          <h1 className="text-[32px] sm:text-[40px] font-bold text-slate-800 leading-tight mb-4">
            Which country is right for you?
          </h1>
          <p className="text-[16px] text-slate-500 leading-relaxed mb-8">
            Answer 8 simple questions about your qualifications, goals and budget.
            We&rsquo;ll rank all 5 countries and show exactly what you need to do next{demonym ? ` as a ${demonym} nurse` : ''}.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {(['germany', 'uk', 'canada', 'australia', 'dubai'] as CountrySlug[]).map((slug) => (
              <div key={slug} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3.5 py-1.5">
                <FlagIcon slug={slug} size={18} className="rounded-sm" />
                <span className="text-[13px] font-medium text-slate-700">{COUNTRY_META[slug].name}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-2 h-14 px-10 bg-primary hover:bg-primary-hover text-white text-[15px] font-semibold rounded-2xl transition-colors"
          >
            Start Assessment <ArrowRight size={16} />
          </button>
          <p className="text-[12px] text-slate-400 mt-4">No sign-up required. 100% free.</p>
        </div>
      </div>
    )
  }

  /* ── Results screen ── */
  if (isResults) {
    return (
      <div className="w-full max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#DCFCE7] text-[#166534] rounded-full text-[12.5px] font-semibold mb-5">
            <CheckCircle size={13} />
            Assessment Complete
          </div>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-slate-800 mb-3">
            Your personalised country matches
          </h2>
          <p className="text-[15px] text-slate-500">
            Ranked by compatibility with your qualifications, goals and budget.
          </p>
        </div>

        {/* Top 2 as full cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {topTwo.map((r, i) => (
            <TopResultCard key={r.slug} slug={r.slug} pct={r.pct} rank={i} />
          ))}
        </div>

        {/* Agency rows for top 2 countries */}
        {topTwo.map((r) => {
          const countryAgencies = getAgenciesForCountry(r.slug, agencies)
          const meta = COUNTRY_META[r.slug]
          if (countryAgencies.length === 0) return null
          return (
            <div key={r.slug} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FlagIcon slug={r.slug} size={18} className="rounded-sm" />
                  <p className="text-[14px] font-semibold text-slate-800">Top agencies for {meta.name}</p>
                </div>
                <a
                  href={`/agencies`}
                  className="flex items-center gap-1 text-[12.5px] text-primary font-semibold hover:underline"
                >
                  View all <ArrowRight size={11} />
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {countryAgencies.map((agency) => (
                  <AgencyCard key={agency.slug} agency={agency} />
                ))}
              </div>
            </div>
          )
        })}

        {/* Remaining as compact rows */}
        {rest.length > 0 && (
          <div className="mb-8">
            <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Other Options</p>
            <div className="flex flex-col gap-2">
              {rest.map((r, i) => (
                <CompactResult key={r.slug} slug={r.slug} pct={r.pct} rank={i + 2} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTAs */}
        <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[14px] font-semibold text-slate-800 mb-0.5">Not sure which agency to use?</p>
            <p className="text-[13px] text-slate-500">Browse verified agencies ranked by nurse reviews and transparency score.</p>
          </div>
          <a
            href="/agencies"
            className="flex-shrink-0 inline-flex items-center gap-1.5 h-10 px-5 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
          >
            Browse Agencies <ArrowRight size={13} />
          </a>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RotateCcw size={13} />
            Retake assessment
          </button>
        </div>
      </div>
    )
  }

  /* ── Question screen ── */
  if (!currentQ) return null

  const cols = currentQ.options.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'

  return (
    <div className="w-full max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
      {/* Progress */}
      <div className="mb-8">
        <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Question {step} of {totalSteps}
        </p>
        <ProgressBar current={step} total={totalSteps} />
      </div>

      {/* Question */}
      <h2 className="text-[22px] sm:text-[26px] font-bold text-slate-800 mb-2 leading-tight">
        {currentQ.question}
      </h2>
      <p className="text-[14px] text-slate-500 mb-7">{currentQ.subtitle}</p>

      {/* Options */}
      <div className={`grid ${cols} gap-3 mb-8`}>
        {currentQ.options.map((opt) => {
          const isSelected = selected === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => handleOptionClick(opt.id)}
              className={`text-left rounded-2xl border-2 p-4 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-card'
                  : 'border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                  isSelected ? 'border-primary bg-primary' : 'border-slate-300'
                }`}>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <p className={`text-[14px] font-semibold leading-tight mb-1 ${isSelected ? 'text-primary' : 'text-slate-800'}`}>
                    {opt.label}
                  </p>
                  <p className="text-[12.5px] text-slate-400 leading-snug">{opt.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 h-11 px-5 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13.5px] font-medium rounded-xl transition-colors"
        >
          <ArrowLeft size={14} />
          {step === 1 ? 'Start over' : 'Back'}
        </button>

        <button
          onClick={handleNext}
          disabled={!selected}
          className="flex items-center gap-1.5 h-11 px-6 bg-primary hover:bg-primary-hover disabled:bg-slate-200 disabled:text-slate-400 text-white text-[13.5px] font-semibold rounded-xl transition-colors"
        >
          {step === totalSteps ? 'See My Results' : 'Next'}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
