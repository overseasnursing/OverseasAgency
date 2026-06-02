import React from 'react'
import { BookOpen, UserCheck, Calendar, ExternalLink, ShieldCheck } from 'lucide-react'
import type { MockTestContent } from '@/lib/data/getMockTestContent'
import { ExamMarkdown } from './ExamMarkdown'
import { FaqAccordion } from './FaqAccordion'

function buildGuideTitle(categoryName: string, lastUpdated?: string): string {
  const yearMatch = categoryName.match(/\b(19|20)\d{2}\b/) ?? lastUpdated?.match(/\b(19|20)\d{2}\b/)
  const year = yearMatch?.[0] ?? String(new Date().getFullYear())

  const base = categoryName
    .replace(/\s*-\s*practice.*$/i, '')
    .replace(/\b(19|20)\d{2}\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const nursingMockPattern = /^(.*?)\s+nursing\s+mock\s+test\s+(.*)$/i
  const parts = base.match(nursingMockPattern)

  let examName = base
  if (parts) {
    examName = `${parts[1]} ${parts[2]} Nursing Exam`.replace(/\s+/g, ' ').trim()
  } else {
    examName = base.replace(/\bmock\s*test\b/ig, 'Exam').replace(/\s+/g, ' ').trim()
    if (!/\bexam\b/i.test(examName)) {
      examName = `${examName} Exam`
    }
  }

  return `Comprehensive ${examName} Preparation Guide (${year})`
}

function buildFaqExamContext(categoryName: string): string {
  const authorityMatch = categoryName.match(/\b(DHA|DOH|HAAD|MOH|NCLEX|IELTS|OET|AHPRA)\b/i)
  if (authorityMatch) {
    return `${authorityMatch[1].toUpperCase()} Nursing License & Exam`
  }

  const base = categoryName
    .replace(/\s*-\s*practice.*$/i, '')
    .replace(/\b(19|20)\d{2}\b/g, '')
    .replace(/\bmock\s*test\b/ig, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!base) return 'Nursing License & Exam'
  if (/\bnursing\b/i.test(base)) return `${base} License & Exam`
  return `${base} Nursing License & Exam`
}

export function ExamGuideContent({
  content,
  categoryName,
}: {
  content: MockTestContent
  categoryName: string
}) {
  const { meta, body } = content
  const guideTitle = buildGuideTitle(categoryName, meta.lastUpdated)
  const faqExamContext = buildFaqExamContext(categoryName)

  return (
    <section className="mt-12 pt-10 border-t border-slate-200" aria-label="Exam guide">

      {/* ── Section header ── */}
      <div className="mb-7">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full mb-3">
          <BookOpen size={11} /> Complete Guide
        </span>
        <h2 className="text-[22px] font-bold text-slate-900 leading-tight">
          {guideTitle}
        </h2>

        {/* Author + last updated bar */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3">
          {meta.author && (
            <div className="flex items-center gap-2 text-[13px] text-slate-500">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <UserCheck size={12} className="text-primary" />
              </div>
              <span>
                By{' '}
                {meta.author.linkedin ? (
                  <a
                    href={meta.author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-slate-700 hover:text-primary transition-colors"
                  >
                    {meta.author.name}
                  </a>
                ) : (
                  <span className="font-semibold text-slate-700">{meta.author.name}</span>
                )}
                {meta.author.credentials && (
                  <span className="text-slate-400"> · {meta.author.credentials}</span>
                )}
              </span>
            </div>
          )}
          {meta.lastUpdated && (
            <div className="flex items-center gap-1.5 text-[12.5px] text-slate-400">
              <Calendar size={12} />
              <span>Last Updated: <span className="font-medium text-slate-600">{meta.lastUpdated}</span></span>
            </div>
          )}
        </div>
      </div>

      {/* ── Markdown body ── */}
      <div className="max-w-[860px]">
        <ExamMarkdown content={body} />
      </div>

      {/* ── FAQ Section ── */}
      {meta.faqs && meta.faqs.length > 0 && (
        <div className="mt-10 max-w-[860px]">
          <div className="mb-5">
            <h2 className="text-[20px] font-bold text-slate-800">
              Frequently Asked Questions
            </h2>
            <p className="text-[13.5px] text-slate-400 mt-1">
              {meta.faqs.length} Frequently Asked Questions About the {faqExamContext}
            </p>
          </div>
          <FaqAccordion faqs={meta.faqs} />
        </div>
      )}

      {/* ── Related resources ── */}
      {meta.relatedLinks && meta.relatedLinks.length > 0 && (
        <div className="mt-10 max-w-[860px]">
          <h2 className="text-[18px] font-bold text-slate-800 mb-4">Related Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {meta.relatedLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-4 py-3.5 bg-white border border-slate-200 hover:border-primary/30 hover:bg-primary/[0.02] rounded-xl transition-all group"
              >
                <span className="text-[13.5px] font-semibold text-slate-700 group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <ExternalLink size={13} className="text-slate-300 group-hover:text-primary transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Reviewer box ── */}
      {meta.reviewer && (
        <div className="mt-10 max-w-[860px] bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              Clinically Reviewed By
            </p>
            <p className="text-[14px] font-bold text-slate-800">{meta.reviewer.name}</p>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {meta.reviewer.title}
              {meta.reviewer.experience && ` · ${meta.reviewer.experience}`}
              {meta.reviewer.license && ` · ${meta.reviewer.license}`}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
