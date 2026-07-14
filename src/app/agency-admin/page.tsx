import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Building2, Star, MessageSquare, AlertTriangle, Settings, ExternalLink, CheckCircle2 } from 'lucide-react'

export default async function AgencyAdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/agency-admin')

  const agencyId = user.app_metadata?.agency_id as string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const [agencyRes, reviewRes, scamRes] = await Promise.all([
    db.from('agencies').select('id, name, slug, city, state, trust_level, rating, is_claimed').eq('id', agencyId).single(),
    db.from('reviews').select('id', { count: 'exact', head: true }).eq('agency_id', agencyId).eq('status', 'approved'),
    db.from('scam_reports').select('id', { count: 'exact', head: true }).eq('agency_id', agencyId).eq('status', 'approved'),
  ])

  const agency     = agencyRes.data
  const reviewCount = reviewRes.count ?? 0
  const scamCount  = scamRes.count ?? 0

  if (!agency) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <p className="text-slate-500">Agency not found. Please contact support.</p>
      </div>
    )
  }

  const trustColour: Record<string, string> = {
    verified:        'text-emerald-700 bg-emerald-50 border-emerald-200',
    trusted:         'text-blue-700 bg-blue-50 border-blue-200',
    unverified:      'text-slate-600 bg-slate-100 border-slate-200',
    'scam-reported': 'text-red-700 bg-red-50 border-red-200',
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Agency header card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${trustColour[agency.trust_level] ?? trustColour.unverified}`}>
                {agency.trust_level === 'verified' && <CheckCircle2 size={10} />}
                {(agency.trust_level ?? 'unverified').charAt(0).toUpperCase() + (agency.trust_level ?? 'unverified').slice(1)}
              </span>
            </div>
            <h1 className="text-[22px] font-bold text-slate-900">{agency.name}</h1>
            {(agency.city || agency.state) && (
              <p className="text-[13px] text-slate-500 mt-0.5">{[agency.city, agency.state].filter(Boolean).join(', ')}</p>
            )}
          </div>
          <a
            href={`/agency/${agency.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-primary hover:underline flex-shrink-0"
          >
            <ExternalLink size={13} /> View listing
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { icon: Star,           label: 'Avg Rating',     value: agency.rating ? `${Number(agency.rating).toFixed(1)} / 5` : '—',          color: 'text-amber-500' },
          { icon: MessageSquare,  label: 'Approved Reviews', value: String(reviewCount), color: 'text-blue-500' },
          { icon: AlertTriangle,  label: 'Scam Reports',   value: String(scamCount), color: scamCount > 0 ? 'text-red-500' : 'text-slate-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5">
            <Icon size={18} className={`${color} mb-2`} />
            <p className="text-[22px] font-bold text-slate-900">{value}</p>
            <p className="text-[12px] text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-[15px] font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="flex flex-col gap-2">
          <Link
            href="/agency-admin/edit"
            className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/4 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-[13.5px] font-semibold text-slate-800">Edit Agency Listing</p>
                <p className="text-[12px] text-slate-400">Update description, pricing, branches, social links, and more</p>
              </div>
            </div>
            <Building2 size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
          </Link>

          <a
            href={`/agency/${agency.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <ExternalLink size={16} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[13.5px] font-semibold text-slate-800">View Public Listing</p>
                <p className="text-[12px] text-slate-400">See how nurses see your agency page</p>
              </div>
            </div>
            <ExternalLink size={16} className="text-slate-300" />
          </a>
        </div>
      </div>

      {scamCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13.5px] font-semibold text-red-800">Active scam reports</p>
            <p className="text-[12.5px] text-red-600 mt-0.5">
              There {scamCount === 1 ? 'is' : 'are'} {scamCount} approved scam report{scamCount !== 1 ? 's' : ''} against your agency.
              Contact <a href="mailto:hello@overseasnursing.com" className="underline">hello@overseasnursing.com</a> to dispute any incorrect reports.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
