import React from 'react'
import { requirePermission } from '@/lib/require-admin'
import AgencyForm from '../_components/AgencyForm'

export default async function NewAgencyPage() {
  await requirePermission('agencies')
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[12px] text-slate-400 mb-1">
          <a href="/admin/agencies" className="hover:text-primary transition-colors">Agencies</a>
          {' / '}New
        </p>
        <h1 className="text-[22px] font-bold text-slate-900">Add Agency</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">Fill in the details below. Branches and FAQs can be added after the agency is created.</p>
      </div>

      <AgencyForm initialData={null} />
    </div>
  )
}
