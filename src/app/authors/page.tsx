import type { Metadata } from 'next'
import { getAllAuthors } from '@/lib/authors/data'
import { AuthorCard } from '@/components/authors/AuthorCard'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildWebPageSchema } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'Authors — OverseasNursing',
  description: 'The writers and researchers behind OverseasNursing content. Each profile includes editorial focus, credentials, and independence disclosure.',
  alternates: { canonical: 'https://overseasnursing.com/authors' },
  openGraph: {
    title: 'Authors — OverseasNursing',
    description: 'Meet the writers and researchers who create OverseasNursing content.',
    url: 'https://overseasnursing.com/authors',
    type: 'website',
  },
}

export default async function AuthorsPage() {
  const authors = await getAllAuthors()

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Authors', href: '/authors' },
  ]

  const schema = buildWebPageSchema({
    title: 'Authors — OverseasNursing',
    description: 'The writers and researchers behind OverseasNursing content.',
    path: '/authors',
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <JsonLd schema={schema} />

      <div className="bg-white border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-5">
            <h1 className="text-[32px] sm:text-[38px] font-bold text-slate-900 leading-tight mb-3">
              Our Authors
            </h1>
            <p className="text-[15px] text-slate-500 leading-relaxed max-w-2xl">
              OverseasNursing content is written by specialist migration researchers and journalists.
              Every author operates under our{' '}
              <a href="/editorial-policy" className="text-primary font-medium hover:underline">
                editorial policy
              </a>{' '}
              with full disclosure of credentials and commercial independence.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-12">
        {authors.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl">
            {authors.map((author) => (
              <AuthorCard key={author.slug} author={author} />
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-slate-400">Author profiles are being prepared.</p>
        )}

        <div className="flex flex-wrap gap-6 mt-10 text-[13.5px]">
          <a href="/about" className="text-primary font-semibold hover:underline">
            ← About OverseasNursing
          </a>
          <a href="/editorial-policy" className="text-primary font-semibold hover:underline">
            Editorial Policy →
          </a>
        </div>
      </div>
    </div>
  )
}
