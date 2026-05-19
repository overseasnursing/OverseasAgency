import React from 'react'
import { ShieldCheck, AlertTriangle, XCircle, ThumbsUp, Plane } from 'lucide-react'

export function VerifiedPlacementBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
      <ShieldCheck size={11} />
      Verified Placement
    </span>
  )
}

export function VerifiedReviewBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D4ED8] bg-[#DBEAFE] px-2 py-0.5 rounded-full">
      <ShieldCheck size={11} />
      Verified
    </span>
  )
}

export function HiddenChargesBadge({ amount }: { amount?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
      <AlertTriangle size={11} />
      {amount ? `Hidden charges: ₹${(amount / 1000).toFixed(0)}K` : 'Hidden charges reported'}
    </span>
  )
}

export function ScamReportedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#991B1B] bg-[#FEE2E2] px-2 py-0.5 rounded-full">
      <XCircle size={11} />
      Scam Reported
    </span>
  )
}

export function HighlyRecommendedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
      <ThumbsUp size={11} />
      Highly Recommended
    </span>
  )
}

export function VisaSuccessBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7E22CE] bg-[#F3E8FF] px-2 py-0.5 rounded-full">
      <Plane size={11} />
      Visa Received
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: 'critical' | 'high' | 'moderate' }) {
  const styles = {
    critical: 'text-[#991B1B] bg-[#FEE2E2]',
    high: 'text-[#92400E] bg-[#FEF3C7]',
    moderate: 'text-[#1D4ED8] bg-[#DBEAFE]',
  }
  const labels = {
    critical: 'Critical',
    high: 'High Severity',
    moderate: 'Moderate',
  }
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${styles[severity]}`}>
      <AlertTriangle size={11} />
      {labels[severity]}
    </span>
  )
}

export function CategoryBadge({ category }: { category: string }) {
  const labels: Record<string, string> = {
    'fee-fraud': 'Fee Fraud',
    'fake-job': 'Fake Job Offer',
    'document-fraud': 'Document Fraud',
    'visa-fraud': 'Visa Fraud',
    'abandonment': 'Abandonment',
    'other': 'Other',
  }
  return (
    <span className="inline-flex items-center text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
      {labels[category] ?? category}
    </span>
  )
}
