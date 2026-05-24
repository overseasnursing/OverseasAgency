import Link from 'next/link'
import {
  Sparkles, Brain, Zap, Upload, FileText,
  Lock, ArrowLeft, ChevronRight,
} from 'lucide-react'

type Props = {
  params: Promise<{
    locationId: string
    categoryId: string
    testId:     string
  }>
}

export default async function AIGeneratorPage({ params }: Props) {
  const { locationId, categoryId, testId } = await params
  const backHref = `/admin/mock-tests/${locationId}/categories/${categoryId}/tests/${testId}/questions`

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Back nav */}
      <Link href={backHref}
        className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-primary transition-colors mb-6">
        <ArrowLeft size={14} /> Back to Questions
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center">
          <Sparkles size={20} className="text-violet-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-slate-900">AI Question Generator</h1>
          <p className="text-[13px] text-slate-400">Auto-generate mock test questions using AI</p>
        </div>
        <span className="ml-auto text-[11px] font-bold px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full">
          Coming Soon
        </span>
      </div>

      {/* Locked overlay card */}
      <div className="mt-6 bg-white border-2 border-dashed border-violet-200 rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/80 pointer-events-none" />
        <Lock size={32} className="text-violet-300 mx-auto mb-4" />
        <h2 className="text-[16px] font-bold text-slate-700 mb-2">Feature Under Development</h2>
        <p className="text-[13px] text-slate-500 max-w-md mx-auto">
          AI-powered question generation is planned for a future release.
          When available, you will be able to generate high-quality MCQs from
          topics, documents, or syllabus outlines.
        </p>
      </div>

      {/* Planned features grid */}
      <div className="mt-8">
        <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-4">Planned Capabilities</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: <Brain size={18} className="text-violet-500" />,
              bg: 'bg-violet-50 border-violet-100',
              title: 'Topic-based Generation',
              desc: 'Enter a nursing topic (e.g., "cardiac medications") and generate 10–50 MCQs instantly with explanations.',
            },
            {
              icon: <Upload size={18} className="text-blue-500" />,
              bg: 'bg-blue-50 border-blue-100',
              title: 'Document Upload',
              desc: 'Upload a PDF or syllabus document and extract exam-ready questions with correct answers.',
            },
            {
              icon: <Zap size={18} className="text-amber-500" />,
              bg: 'bg-amber-50 border-amber-100',
              title: 'Difficulty Calibration',
              desc: 'Control question difficulty — easy, medium, or hard — with automatic bloom taxonomy tagging.',
            },
            {
              icon: <FileText size={18} className="text-emerald-500" />,
              bg: 'bg-emerald-50 border-emerald-100',
              title: 'Bulk Import Review',
              desc: 'Review AI-generated questions before publishing. Edit, reject, or approve individually.',
            },
          ].map(f => (
            <div key={f.title} className={`border rounded-2xl p-5 ${f.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                {f.icon}
                <h3 className="text-[13.5px] font-bold text-slate-800">{f.title}</h3>
              </div>
              <p className="text-[12.5px] text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Manual import CTA */}
      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[13.5px] font-semibold text-slate-800">Need questions now?</p>
          <p className="text-[12.5px] text-slate-500 mt-0.5">Use the existing bulk import (CSV) or add questions one by one.</p>
        </div>
        <Link href={backHref}
          className="flex-shrink-0 flex items-center gap-1.5 h-9 px-4 bg-primary hover:bg-primary/90 text-white text-[12.5px] font-semibold rounded-xl transition-colors">
          Manage Questions <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  )
}
