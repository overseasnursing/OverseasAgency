'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2, XCircle, Clock, Building2, Mail, Phone,
  Globe, MapPin, ChevronDown, ChevronUp, Loader2, Users,
} from 'lucide-react'
import { approveAgencySubmission, rejectAgencySubmission } from '@/app/actions/agencySubmissions'
import type { SubmissionRow } from '../page'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusBadge({ status }: { status: SubmissionRow['status'] }) {
  if (status === 'pending')
    return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full"><Clock size={10} /> Pending</span>
  if (status === 'approved')
    return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full"><CheckCircle2 size={10} /> Approved</span>
  return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full"><XCircle size={10} /> Rejected</span>
}

function PendingCard({ sub }: { sub: SubmissionRow }) {
  const [expanded, setExpanded]     = useState(false)
  const [rejecting, setRejecting]   = useState(false)
  const [reason, setReason]         = useState('')
  const [error, setError]           = useState('')
  const [isPending, start]          = useTransition()
  const router = useRouter()

  function handleApprove() {
    start(async () => {
      const res = await approveAgencySubmission(sub.id)
      if (res.error) { setError(res.error); return }
      router.refresh()
    })
  }

  function handleReject() {
    if (!rejecting) { setRejecting(true); return }
    start(async () => {
      const res = await rejectAgencySubmission(sub.id, reason || undefined)
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
              <StatusBadge status={sub.status} />
              <span className="text-[11px] text-slate-400">{formatDate(sub.created_at)}</span>
            </div>
            <p className="text-[16px] font-bold text-slate-900">{sub.agency_name}</p>
            <p className="text-[12.5px] text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin size={11} /> {sub.city}, {sub.state}
            </p>
          </div>
          <button type="button" onClick={() => setExpanded(e => !e)}
            className="text-slate-400 hover:text-slate-600 transition-colors mt-1">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Summary row */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <Users size={13} className="text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[11.5px] text-slate-400">Contact</p>
              <p className="text-[12.5px] font-medium text-slate-700">{sub.contact_name} · {sub.designation}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={13} className="text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[11.5px] text-slate-400">Email</p>
              <p className="text-[12.5px] font-medium text-slate-700 truncate">{sub.contact_email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 size={13} className="text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[11.5px] text-slate-400">Agency email</p>
              <p className="text-[12.5px] font-medium text-slate-700 truncate">{sub.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50 flex flex-col gap-3">
          {sub.website && (
            <div className="flex items-center gap-2">
              <Globe size={13} className="text-slate-400" />
              <a href={sub.website} target="_blank" rel="noopener noreferrer"
                className="text-[13px] text-primary hover:underline">{sub.website}</a>
            </div>
          )}
          {sub.phone && (
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-slate-400" />
              <p className="text-[13px] text-slate-600">{sub.phone}</p>
            </div>
          )}
          {sub.description && (
            <p className="text-[13px] text-slate-600 leading-relaxed italic">&ldquo;{sub.description}&rdquo;</p>
          )}
          {sub.countries_served?.length > 0 && (
            <div>
              <p className="text-[11.5px] font-semibold text-slate-500 mb-1">Destination countries</p>
              <div className="flex flex-wrap gap-1.5">
                {sub.countries_served.map(c => (
                  <span key={c} className="text-[11.5px] px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-600">{c}</span>
                ))}
              </div>
            </div>
          )}
          {sub.services?.length > 0 && (
            <div>
              <p className="text-[11.5px] font-semibold text-slate-500 mb-1">Services</p>
              <div className="flex flex-wrap gap-1.5">
                {sub.services.map(s => (
                  <span key={s} className="text-[11.5px] px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-600">{s}</span>
                ))}
              </div>
            </div>
          )}
          {sub.established_year && (
            <p className="text-[12.5px] text-slate-500">Established: {sub.established_year}</p>
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
              placeholder="Reason for rejection (optional — included in email)"
              className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
            />
            <div className="flex gap-2">
              <button type="button" onClick={handleReject} disabled={isPending}
                className="flex-1 h-9 bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60">
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Confirm Reject
              </button>
              <button type="button" onClick={() => { setRejecting(false); setReason('') }}
                className="px-4 h-9 border border-slate-200 text-[13px] font-medium text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button type="button" onClick={handleApprove} disabled={isPending}
              className="flex-1 h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60">
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Approve & Create Listing
            </button>
            <button type="button" onClick={() => setRejecting(true)} disabled={isPending}
              className="flex-1 h-9 border border-red-200 text-red-600 text-[13px] font-semibold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60">
              <XCircle size={14} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ResolvedRow({ sub }: { sub: SubmissionRow }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Building2 size={14} className="text-slate-400" />
        </div>
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold text-slate-800 truncate">{sub.agency_name}</p>
          <p className="text-[12px] text-slate-400 truncate">{sub.city}, {sub.state} · {sub.contact_name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <StatusBadge status={sub.status} />
        {sub.agency_id && (
          <a href={`/admin/agencies`} className="text-[11.5px] text-primary hover:underline hidden sm:block">View →</a>
        )}
        <span className="text-[11px] text-slate-400 hidden sm:block">
          {sub.reviewed_at ? formatDate(sub.reviewed_at) : formatDate(sub.created_at)}
        </span>
      </div>
    </div>
  )
}

export function AgencySubmissionsClient({
  pending, resolved,
}: { pending: SubmissionRow[]; resolved: SubmissionRow[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-bold text-slate-900">Agency Submissions</h1>
        <p className="text-[13px] text-slate-500 mt-1">
          Review new agency submissions. Approving creates the agency listing and sends login credentials.
        </p>
      </div>

      {/* Pending */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-[16px] font-bold text-slate-800">Pending Review</h2>
          {pending.length > 0 && (
            <span className="h-6 min-w-6 px-2 rounded-full bg-amber-500 text-white text-[12px] font-bold flex items-center justify-center">
              {pending.length}
            </span>
          )}
        </div>
        {pending.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <CheckCircle2 size={28} className="text-slate-300 mx-auto mb-2" />
            <p className="text-[14px] text-slate-400">No pending submissions</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pending.map(s => <PendingCard key={s.id} sub={s} />)}
          </div>
        )}
      </section>

      {/* Resolved */}
      {resolved.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[16px] font-bold text-slate-800">Approved & Rejected</h2>
            <span className="text-[12px] text-slate-400">{resolved.length} total</span>
          </div>
          <div className="flex flex-col gap-2">
            {resolved.map(s => <ResolvedRow key={s.id} sub={s} />)}
          </div>
        </section>
      )}
    </div>
  )
}
