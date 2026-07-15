import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOwnedScamReport } from '@/lib/db/scam-reports'
import { ScamReportForm } from '@/app/scam-reports/submit/ScamReportForm'

export const metadata: Metadata = { title: 'Edit Scam Report — OverseasNursing' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditScamReportPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?next=/dashboard/scam-reports/${id}/edit`)

  const report = await getOwnedScamReport(id, user.id)
  if (!report) notFound()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-900 mb-1">Edit Scam Report</h1>
        <p className="text-[13px] text-slate-500">
          Editing sends your report back for re-verification before it&apos;s public again.
        </p>
      </div>
      <ScamReportForm
        editReportId={report.id}
        lockedAgencySlug={report.agency_slug}
        lockedAgencyName={report.agency_name}
        initialData={{
          countryPromised: report.country_promised,
          amountPaid: report.amount_paid != null ? String(report.amount_paid) : '',
          amountLost: report.amount_lost != null ? String(report.amount_lost) : '',
          category: report.category,
          fullIncident: report.incident_text,
          warningSignsMissed: (report.warning_signs_missed ?? []).join('\n'),
          lessonsLearned: (report.lessons_learned ?? []).join('\n'),
          emotionalExperience: report.emotional_experience ?? '',
          reporterName: report.reporter_name,
          reporterFrom: report.reporter_from,
          evidenceConsent: true,
          legalConsent: true,
        }}
      />
    </div>
  )
}
