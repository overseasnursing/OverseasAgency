import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { loadGuideContent, type GuideInput } from '@/app/actions/admin-guide-content'
import { getMockTestContent } from '@/lib/data/getMockTestContent'
import { GuideEditor } from './_components/GuideEditor'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ locationId: string; categoryId: string }>
}

export default async function GuidePage({ params }: PageProps) {
  const { locationId, categoryId } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const [{ data: location }, { data: category }] = await Promise.all([
    db.from('mock_test_locations').select('id, name, slug').eq('id', locationId).single(),
    db.from('mock_test_categories').select('id, name, slug').eq('id', categoryId).single(),
  ])

  if (!location || !category) notFound()

  // DB first; if empty fall back to .md file so the admin sees what the public page shows
  let existing: GuideInput | null = await loadGuideContent(categoryId)

  if (!existing) {
    const fileContent = await getMockTestContent(categoryId, category.slug)
    if (fileContent) {
      const { meta, body } = fileContent
      existing = {
        category_id:    categoryId,
        body,
        last_updated:   meta.lastUpdated   ?? '',
        published_date: meta.publishedDate ?? '',
        modified_date:  meta.modifiedDate  ?? '',
        author: {
          name:        meta.author?.name        ?? '',
          credentials: meta.author?.credentials ?? '',
          linkedin:    meta.author?.linkedin    ?? '',
        },
        reviewer: {
          name:       meta.reviewer?.name       ?? '',
          title:      meta.reviewer?.title      ?? '',
          experience: meta.reviewer?.experience ?? '',
          license:    meta.reviewer?.license    ?? '',
        },
        faqs:                  (meta.faqs         ?? []).map(f => ({ q: f.q, a: f.a })),
        related_links:         (meta.relatedLinks ?? []).map(l => ({ label: l.label, href: l.href })),
        destination_overrides: meta.destinationOverrides ?? {},
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12.5px] text-slate-400 flex-wrap">
        <Link href="/admin/mock-tests" className="hover:text-primary transition-colors font-medium text-slate-600">
          Mock Tests
        </Link>
        <ChevronRight size={12} />
        <Link href={`/admin/mock-tests/${locationId}`} className="hover:text-primary transition-colors">
          {location.name}
        </Link>
        <ChevronRight size={12} />
        <Link href={`/admin/mock-tests/${locationId}/categories`} className="hover:text-primary transition-colors">
          Categories
        </Link>
        <ChevronRight size={12} />
        <span className="text-slate-600">{category.name}</span>
        <ChevronRight size={12} />
        <span className="text-slate-600 font-medium">Guide</span>
      </nav>

      <GuideEditor
        categoryId={categoryId}
        categoryName={category.name}
        locationId={locationId}
        locationSlug={location.slug}
        categorySlug={category.slug}
        initial={existing}
      />
    </div>
  )
}
