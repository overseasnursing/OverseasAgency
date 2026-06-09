'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2, XCircle, Clock, Building2, Mail, Phone, User, MessageSquare, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { approveClaimRequest, rejectClaimRequest } from '@/app/actions/adminClaimActions'
import { useRouter } from 'next/navigation'
import type { ClaimRow } from '../page'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusBadge({ status }: { status: ClaimRow['status'] }) {
  if (status === 'pending_approval')
    return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full"><Clock size={10} /> Pending</span>
  if (status === 'approved')
    return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full"><CheckCircle2 size={10} /> Approved</span>
  return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full"><XCircle size={10} /> Rejected</span>
}

// ── Pending Claim Card ────────────────────────────────────────────────────────

function PendingCard({ claim }: { claim: ClaimRow }) {
  const [expanded, setExpanded]     = useState(false)
  const [rejecting, setRejecting]   = useState(false)
  const [reason, setReason]         = useState('')
  const [error, setError]           = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleApprove() {
    startTransition(async () => {
      const res = await approveClaimRequest(claim.id)
      if (res.error) { setError(res.error); return }
      router.refresh()
    })
  }

  function handleReject() {
    if (!rejecting) { setRejecting(true); return }
    startTransition(async () => {
      const res = await rejectClaimRequest(claim.id, reason)
      if (res.error) { setError(res.error); return }
      router.refresh()
    })
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={claim.status} />
              <span className="text-[11px] text-slate-400">{formatDate(claim.created_at)}</span>
            </div>
            <p className="text-[15px] font-bold text-slate-900">
              {claim.agencies?.name ?? 'Unknown Agency'}
            </p>
            {(claim.agencies?.city || claim.agencies?.state) && (
              <p className="text-[12px] text-slate-500">{[claim.agencies.city, claim.agencies.state].filter(Boolean).join(', ')}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Claimant summary */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <User size={13} className="text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[12px] text-slate-400">Name</p>
              <p className="text-[13px] font-medium text-slate-700">{claim.contact_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 size={13} className="text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[12px] text-slate-400">Role</p>
              <p className="text-[13px] font-medium text-slate-700">{claim.designation}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={13} className="text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[12px] text-slate-400">Email</p>
              <p className="text-[13px] font-medium text-slate-700 truncate">{claim.contact_email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50 flex flex-col gap-3">
          {claim.contact_phone && (
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-slate-400" />
              <p className="text-[13px] text-slate-600">{claim.contact_phone}</p>
            </div>
          )}
          {claim.message && (
            <div className="flex items-start gap-2">
              <MessageSquare size={13} className="text-slate-400 mt-0.5" />
              <p className="text-[13px] text-slate-600 italic">&ldquo;{claim.message}&rdquo;</p>
            </div>
          )}
          {claim.otp_verified_at && (
            <p className="text-[12px] text-emerald-600 font-medium">✓ Email verified {formatDate(claim.otp_verified_at)}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-slate-100 px-5 py-4">
        {error && <p className="text-[12.5px] text-red-600 mb-3">{error}</p>}

        {rejecting ? (
          <div className="flex flex-col gap-3">
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={2}
              placeholder="Reason for rejection (optional — will be included in email to claimant)"
              className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 resize-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReject}
                disabled={isPending}
                className="flex-1 h-9 bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                Confirm Reject
              </button>
              <button
                type="button"
                onClick={() => { setRejecting(false); setReason('') }}
                className="px-4 h-9 border border-slate-200 text-[13px] font-medium text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleApprove}
              disabled={isPending}
              className="flex-1 h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Approve
            </button>
            <button
              type="button"
              onClick={() => setRejecting(true)}
              disabled={isPending}
              className="flex-1 h-9 border border-red-200 text-red-600 text-[13px] font-semibold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <XCircle size={14} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Resolved row ──────────────────────────────────────────────────────────────

function ResolvedRow({ claim }: { claim: ClaimRow }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Building2 size={14} className="text-slate-400" />
        </div>
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold text-slate-800 truncate">{claim.agencies?.name}</p>
          <p className="text-[12px] text-slate-400 truncate">{claim.contact_name} · {claim.contact_email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <StatusBadge status={claim.status} />
        <span className="text-[11px] text-slate-400 hidden sm:block">
          {claim.reviewed_at ? formatDate(claim.reviewed_at) : formatDate(claim.created_at)}
        </span>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function ClaimListingsClient({
  pending,
  resolved,
}: {
  pending: ClaimRow[]
  resolved: ClaimRow[]
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[24px] font-bold text-slate-900">Claim Listings</h1>
          <p className="text-[13.5px] text-slate-500 mt-1">
            Review and approve agency ownership claims submitted by agency representatives.
          </p>
        </div>

        {/* ── Pending ── */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[17px] font-bold text-slate-800">Pending Requests</h2>
            {pending.length > 0 && (
              <span className="h-6 min-w-6 px-2 rounded-full bg-amber-500 text-white text-[12px] font-bold flex items-center justify-center">
                {pending.length}
              </span>
            )}
          </div>

          {pending.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <CheckCircle2 size={28} className="text-slate-300 mx-auto mb-2" />
              <p className="text-[14px] text-slate-400">No pending claim requests</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {pending.map(c => <PendingCard key={c.id} claim={c} />)}
            </div>
          )}
        </section>

        {/* ── Resolved ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[17px] font-bold text-slate-800">All Approved &amp; Rejected</h2>
            <span className="text-[12px] text-slate-400">{resolved.length} total</span>
          </div>

          {resolved.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <p className="text-[14px] text-slate-400">No resolved claims yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {resolved.map(c => <ResolvedRow key={c.id} claim={c} />)}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
