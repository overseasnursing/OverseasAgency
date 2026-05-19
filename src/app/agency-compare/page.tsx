import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import {
  CheckCircle, ShieldAlert, Star, MapPin, Users, Clock,
  Banknote, ThumbsUp, Plane, Shield, ArrowLeftRight,
} from 'lucide-react'
import { getAgencyDetail } from '@/lib/data/getAgencyDetail'
import { getAgencies } from '@/lib/data/getAgencies'
import { AgencySearchPicker } from './AgencySearchPicker'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Compare Nursing Agencies — OverseasNursing.com',
    description: 'Compare overseas nursing agencies side-by-side. See ratings, fees, visa success rates, and transparency scores before choosing.',
  }
}

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>
}

/* ── helpers ── */

function win(valA: number, valB: number, lowerIsBetter = false): 'a' | 'b' | 'tie' {
  if (valA === valB) return 'tie'
  if (lowerIsBetter) return valA < valB ? 'a' : 'b'
  return valA > valB ? 'a' : 'b'
}

function WinBadge({ side, winner }: { side: 'a' | 'b'; winner: 'a' | 'b' | 'tie' }) {
  if (winner === 'tie') return null
  if (winner !== side) return null
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#DCFCE7] text-[#166534] text-[10px] font-bold rounded-full ml-1.5">
      BETTER
    </span>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} fill={i <= Math.round(rating) ? '#F59E0B' : '#E2E8F0'} className={i <= Math.round(rating) ? 'text-[#F59E0B]' : 'text-slate-200'} />
      ))}
    </div>
  )
}

function TrustPill({ level }: { level: string }) {
  const map: Record<string, { label: string; className: string }> = {
    verified:        { label: 'Verified',       className: 'bg-[#DCFCE7] text-[#166534]' },
    trusted:         { label: 'Trusted',         className: 'bg-[#DBEAFE] text-[#1D4ED8]' },
    'scam-reported': { label: 'Scam Reported',   className: 'bg-[#FEE2E2] text-[#B91C1C]' },
    unverified:      { label: 'Not Verified',    className: 'bg-slate-100 text-slate-500' },
  }
  const { label, className } = map[level] ?? map.unverified
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full ${className}`}>{label}</span>
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-[#22C55E]' : score >= 60 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
  const text  = score >= 80 ? 'text-[#166534]' : score >= 60 ? 'text-[#92400E]' : 'text-[#B91C1C]'
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-[12px] font-bold ${text}`}>{score}/100</span>
    </div>
  )
}

/* ── Agency header card ── */

function AgencyCard({ agency, side }: { agency: Awaited<ReturnType<typeof getAgencyDetail>>; side: 'A' | 'B' }) {
  if (!agency) return null
  const initials = agency.name.split(' ').slice(0, 2).map((w: string) => w[0]).join('')
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex-1">
      {/* Featured image or colour band */}
      {agency.featuredImage ? (
        <div className="relative h-28 w-full">
          <Image src={agency.featuredImage} alt={agency.name} fill sizes="50vw" className="object-cover" />
        </div>
      ) : (
        <div className={`h-2 w-full ${side === 'A' ? 'bg-primary' : 'bg-[#F59E0B]'}`} />
      )}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {agency.logo ? (
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
              <Image src={agency.logo} alt={agency.name} width={44} height={44} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[14px] font-bold text-primary">{initials}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-slate-800 leading-tight">{agency.name}</p>
            <div className="flex items-center gap-1 text-[12px] text-slate-400 mt-0.5">
              <MapPin size={11} /> {agency.location}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Stars rating={agency.rating} />
          <span className="text-[13px] font-bold text-slate-800">{agency.rating.toFixed(1)}</span>
          <span className="text-[12px] text-slate-400">({agency.reviewCount} reviews)</span>
        </div>
        <div className="mt-2">
          <TrustPill level={agency.trustLevel} />
        </div>
      </div>
    </div>
  )
}

/* ── Comparison row ── */

function Row({
  label,
  icon,
  cellA,
  cellB,
  note,
}: {
  label: string
  icon: React.ReactNode
  cellA: React.ReactNode
  cellB: React.ReactNode
  note?: string
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 px-4 py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-start gap-2">
        <span className="text-slate-400 mt-0.5 flex-shrink-0">{icon}</span>
        <div>
          <p className="text-[13px] font-semibold text-slate-700">{label}</p>
          {note && <p className="text-[11px] text-slate-400 mt-0.5">{note}</p>}
        </div>
      </div>
      <div className="text-[13px] text-slate-700">{cellA}</div>
      <div className="text-[13px] text-slate-700">{cellB}</div>
    </div>
  )
}

/* ── Page ── */

export default async function AgencyComparePage({ searchParams }: PageProps) {
  const { a: slugA, b: slugB } = await searchParams

  if (!slugA) {
    return (
      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ArrowLeftRight size={28} className="text-primary" />
        </div>
        <h1 className="text-[24px] font-bold text-slate-800 mb-3">Compare Agencies</h1>
        <p className="text-[15px] text-slate-500 mb-8">
          Go to the <a href="/agencies" className="text-primary font-semibold hover:underline">agency directory</a> and click <strong>Compare</strong> on any agency to start.
        </p>
      </div>
    )
  }

  const [agencyA, allAgencies] = await Promise.all([
    getAgencyDetail(slugA),
    getAgencies(),
  ])

  if (!agencyA) notFound()

  const agencyB = slugB ? await getAgencyDetail(slugB) : null

  const hasComparison = !!(agencyA && agencyB)

  /* ── build comparison rows ── */
  const ratingWinner   = hasComparison ? win(agencyA.rating, agencyB!.rating) : 'tie'
  const reviewWinner   = hasComparison ? win(agencyA.reviewCount, agencyB!.reviewCount) : 'tie'
  const scoreWinner    = hasComparison ? win(agencyA.transparencyScore, agencyB!.transparencyScore) : 'tie'
  const feeWinner      = hasComparison ? win(agencyA.pricing.minCost, agencyB!.pricing.minCost, true) : 'tie'
  const visaWinner     = hasComparison ? win(agencyA.visaSuccessRate, agencyB!.visaSuccessRate) : 'tie'
  const recWinner      = hasComparison ? win(agencyA.recommendationPercent, agencyB!.recommendationPercent) : 'tie'
  const placedWinner   = hasComparison ? win(agencyA.placementCount, agencyB!.placementCount) : 'tie'
  const chargesWinner  = hasComparison ? win(agencyA.hiddenChargesReported, agencyB!.hiddenChargesReported, true) : 'tie'

  return (
    <>
      {/* Header */}
      <div className="bg-[#F8FAFC] border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-[13px] text-slate-400 mb-5">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <a href="/agencies" className="hover:text-primary transition-colors">Agencies</a>
            <span>/</span>
            <span className="text-slate-600 font-medium">Compare</span>
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <ArrowLeftRight size={18} className="text-primary" />
            </div>
            <h1 className="text-[22px] font-bold text-slate-800">
              {hasComparison
                ? `${agencyA.name} vs ${agencyB!.name}`
                : `Compare: ${agencyA.name}`}
            </h1>
          </div>
          <p className="text-[14px] text-slate-500 ml-12">
            {hasComparison
              ? 'Side-by-side comparison of fees, ratings, visa success, and trust scores.'
              : 'Select a second agency below to start comparing.'}
          </p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8">

        {/* Two-column: Agency A | Agency B header cards */}
        <div className="flex gap-4 mb-8 items-stretch">
          <AgencyCard agency={agencyA} side="A" />
          <div className="flex items-center justify-center flex-shrink-0">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-[11px] font-bold text-slate-400">VS</span>
            </div>
          </div>
          {agencyB ? (
            <AgencyCard agency={agencyB} side="B" />
          ) : (
            /* Placeholder: pick agency B */
            <div className="flex-1 bg-white border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col justify-center">
              <p className="text-[13px] font-semibold text-slate-500 mb-3 text-center">Search for an agency to compare</p>
              <AgencySearchPicker agencies={allAgencies} lockedSlug={slugA} currentBSlug={slugB} />
            </div>
          )}
        </div>

        {/* If B is selected — show search picker + comparison table */}
        {hasComparison && (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left: comparison table */}
            <div className="flex-1 min-w-0">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-t-2xl text-[11.5px] font-semibold text-slate-500 uppercase tracking-wide">
                <span>Metric</span>
                <span>{agencyA.name.split(' ')[0]}</span>
                <span>{agencyB!.name.split(' ')[0]}</span>
              </div>

              <div className="border border-t-0 border-slate-200 rounded-b-2xl overflow-hidden bg-white">

                <Row
                  label="Rating"
                  icon={<Star size={15} />}
                  cellA={
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Stars rating={agencyA.rating} />
                      <span className="font-bold">{agencyA.rating.toFixed(1)}</span>
                      <WinBadge side="a" winner={ratingWinner} />
                    </div>
                  }
                  cellB={
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Stars rating={agencyB!.rating} />
                      <span className="font-bold">{agencyB!.rating.toFixed(1)}</span>
                      <WinBadge side="b" winner={ratingWinner} />
                    </div>
                  }
                />

                <Row
                  label="Reviews"
                  icon={<Users size={15} />}
                  note="More reviews = more reliable"
                  cellA={<span className="font-semibold">{agencyA.reviewCount}<WinBadge side="a" winner={reviewWinner} /></span>}
                  cellB={<span className="font-semibold">{agencyB!.reviewCount}<WinBadge side="b" winner={reviewWinner} /></span>}
                />

                <Row
                  label="Trust Level"
                  icon={<Shield size={15} />}
                  cellA={<TrustPill level={agencyA.trustLevel} />}
                  cellB={<TrustPill level={agencyB!.trustLevel} />}
                />

                <Row
                  label="Transparency Score"
                  icon={<CheckCircle size={15} />}
                  note="Higher = more transparent"
                  cellA={
                    <div className="min-w-[100px]">
                      <span className="font-semibold">{agencyA.transparencyScore}/100</span>
                      <WinBadge side="a" winner={scoreWinner} />
                      <ScoreBar score={agencyA.transparencyScore} />
                    </div>
                  }
                  cellB={
                    <div className="min-w-[100px]">
                      <span className="font-semibold">{agencyB!.transparencyScore}/100</span>
                      <WinBadge side="b" winner={scoreWinner} />
                      <ScoreBar score={agencyB!.transparencyScore} />
                    </div>
                  }
                />

                <Row
                  label="Fee Range"
                  icon={<Banknote size={15} />}
                  note="Lower minimum fee"
                  cellA={
                    <span className="font-semibold">
                      ₹{(agencyA.pricing.minCost/100000).toFixed(1)}–{(agencyA.pricing.maxCost/100000).toFixed(1)}L
                      <WinBadge side="a" winner={feeWinner} />
                    </span>
                  }
                  cellB={
                    <span className="font-semibold">
                      ₹{(agencyB!.pricing.minCost/100000).toFixed(1)}–{(agencyB!.pricing.maxCost/100000).toFixed(1)}L
                      <WinBadge side="b" winner={feeWinner} />
                    </span>
                  }
                />

                <Row
                  label="Avg. Timeline"
                  icon={<Clock size={15} />}
                  cellA={<span className="font-semibold">{agencyA.averageTimelineMonths} months</span>}
                  cellB={<span className="font-semibold">{agencyB!.averageTimelineMonths} months</span>}
                />

                <Row
                  label="Visa Success Rate"
                  icon={<Plane size={15} />}
                  cellA={
                    <span className="font-semibold">
                      {agencyA.visaSuccessRate}%<WinBadge side="a" winner={visaWinner} />
                    </span>
                  }
                  cellB={
                    <span className="font-semibold">
                      {agencyB!.visaSuccessRate}%<WinBadge side="b" winner={visaWinner} />
                    </span>
                  }
                />

                <Row
                  label="Would Recommend"
                  icon={<ThumbsUp size={15} />}
                  cellA={
                    <span className="font-semibold">
                      {agencyA.recommendationPercent}%<WinBadge side="a" winner={recWinner} />
                    </span>
                  }
                  cellB={
                    <span className="font-semibold">
                      {agencyB!.recommendationPercent}%<WinBadge side="b" winner={recWinner} />
                    </span>
                  }
                />

                <Row
                  label="Nurses Placed"
                  icon={<Users size={15} />}
                  cellA={
                    <span className="font-semibold">
                      {agencyA.placementCount.toLocaleString()}+<WinBadge side="a" winner={placedWinner} />
                    </span>
                  }
                  cellB={
                    <span className="font-semibold">
                      {agencyB!.placementCount.toLocaleString()}+<WinBadge side="b" winner={placedWinner} />
                    </span>
                  }
                />

                <Row
                  label="Hidden Charges"
                  icon={<ShieldAlert size={15} />}
                  note="Reported by nurses"
                  cellA={
                    <span className={`font-semibold ${agencyA.hiddenChargesReported === 0 ? 'text-[#166534]' : 'text-[#B91C1C]'}`}>
                      {agencyA.hiddenChargesReported === 0 ? 'None' : agencyA.hiddenChargesReported}
                      <WinBadge side="a" winner={chargesWinner} />
                    </span>
                  }
                  cellB={
                    <span className={`font-semibold ${agencyB!.hiddenChargesReported === 0 ? 'text-[#166534]' : 'text-[#B91C1C]'}`}>
                      {agencyB!.hiddenChargesReported === 0 ? 'None' : agencyB!.hiddenChargesReported}
                      <WinBadge side="b" winner={chargesWinner} />
                    </span>
                  }
                />

                <Row
                  label="Countries Served"
                  icon={<MapPin size={15} />}
                  cellA={
                    <div className="flex flex-wrap gap-1">
                      {agencyA.countries.slice(0, 4).map(c => (
                        <span key={c} className="px-2 py-0.5 bg-[#EFF6FF] text-[#1D4ED8] text-[11px] font-medium rounded-full">{c}</span>
                      ))}
                      {agencyA.countries.length > 4 && <span className="text-[11px] text-slate-400">+{agencyA.countries.length - 4} more</span>}
                    </div>
                  }
                  cellB={
                    <div className="flex flex-wrap gap-1">
                      {agencyB!.countries.slice(0, 4).map(c => (
                        <span key={c} className="px-2 py-0.5 bg-[#EFF6FF] text-[#1D4ED8] text-[11px] font-medium rounded-full">{c}</span>
                      ))}
                      {agencyB!.countries.length > 4 && <span className="text-[11px] text-slate-400">+{agencyB!.countries.length - 4} more</span>}
                    </div>
                  }
                />

                <Row
                  label="Established"
                  icon={<Clock size={15} />}
                  cellA={<span className="font-semibold">{agencyA.established}</span>}
                  cellB={<span className="font-semibold">{agencyB!.established}</span>}
                />

                <Row
                  label="Visa Sponsorship"
                  icon={<CheckCircle size={15} />}
                  cellA={agencyA.visaSponsorship
                    ? <span className="text-[#166534] font-semibold">Yes</span>
                    : <span className="text-slate-400">No</span>}
                  cellB={agencyB!.visaSponsorship
                    ? <span className="text-[#166634] font-semibold">Yes</span>
                    : <span className="text-slate-400">No</span>}
                />

              </div>

              {/* CTA buttons */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <a
                  href={`/agency/${agencyA.slug}`}
                  className="flex items-center justify-center h-11 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors"
                >
                  View {agencyA.name.split(' ')[0]} Profile →
                </a>
                <a
                  href={`/agency/${agencyB!.slug}`}
                  className="flex items-center justify-center h-11 border-2 border-primary text-primary hover:bg-primary/5 text-[14px] font-semibold rounded-xl transition-colors"
                >
                  View {agencyB!.name.split(' ')[0]} Profile →
                </a>
              </div>
            </div>

            {/* Right: change agency B */}
            <div className="w-full lg:w-[300px] flex-shrink-0">
              <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide mb-4">
                  Change Agency B
                </p>
                <AgencySearchPicker agencies={allAgencies} lockedSlug={slugA} currentBSlug={slugB} />
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  )
}
