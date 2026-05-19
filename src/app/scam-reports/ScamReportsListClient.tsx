'use client'

import React, { useState, useMemo } from 'react'
import { ScamReportCard } from '@/components/scam/ScamReportCard'
import type { PlatformScamReport, ScamCategory, ScamSeverity } from '@/types/scamReport'

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'fee-fraud', label: 'Fee Fraud' },
  { value: 'fake-job', label: 'Fake Job' },
  { value: 'document-fraud', label: 'Document Fraud' },
  { value: 'visa-fraud', label: 'Visa Fraud' },
  { value: 'abandonment', label: 'Abandonment' },
]

const SEVERITIES: { value: string; label: string }[] = [
  { value: 'all', label: 'All Severity' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'moderate', label: 'Moderate' },
]

interface ScamReportsListClientProps {
  reports: PlatformScamReport[]
}

export function ScamReportsListClient({ reports }: ScamReportsListClientProps) {
  const [category, setCategory] = useState('all')
  const [severity, setSeverity] = useState('all')
  const [unresolvedOnly, setUnresolvedOnly] = useState(false)

  const filtered = useMemo(() => {
    let list = [...reports]
    if (category !== 'all') list = list.filter((r) => r.category === (category as ScamCategory))
    if (severity !== 'all') list = list.filter((r) => r.severity === (severity as ScamSeverity))
    if (unresolvedOnly) list = list.filter((r) => !r.resolved)
    list.sort((a, b) => b.helpful - a.helpful)
    return list
  }, [reports, category, severity, unresolvedOnly])

  return (
    <div>
      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`text-[13px] px-3 py-1.5 rounded-lg font-medium transition-colors ${
                category === c.value
                  ? 'bg-[#DC2626] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={unresolvedOnly}
              onChange={(e) => setUnresolvedOnly(e.target.checked)}
              className="rounded"
            />
            Unresolved only
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="text-[13px] border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white"
          >
            {SEVERITIES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-[13px] text-slate-500 mb-4">
        {filtered.length} report{filtered.length !== 1 ? 's' : ''}
      </p>

      <div className="flex flex-col gap-5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-[14px]">
            No reports match your filters.
          </div>
        ) : (
          filtered.map((report) => <ScamReportCard key={report.id} report={report} />)
        )}
      </div>
    </div>
  )
}
