import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookOpen, FileText } from 'lucide-react'
import { getAllAuthors, getAuthorBySlug, getAuthoredContentSlugs } from '@/lib/authors/data'
import { ProfileHero } from '@/components/profiles/ProfileHero'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildAuthorPersonSchema } from '@/lib/seo/schemas'

export async function generateStaticParams() {
  const authors = await getAllAuthors()
  return authors.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) return {}
  return {
    title: `${author.displayName} — OverseasNursing Author`,
    description: author.shortBio,
    alternates: { canonical: `https://overseasnursing.com/authors/${author.slug}` },
    ...(author.isDemoProfile ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${author.displayName} — OverseasNursing Author`,
      description: author.shortBio,
      url: `https://overseasnursing.com/authors/${author.slug}`,
      type: 'profile',
      images: [
        author.profileImage ??
          `/api/og?type=default&title=${encodeURIComponent(author.displayName)}`,
      ],
    },
  }
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Authors', href: '/authors' },
    { name: author.displayName, href: `/authors/${author.slug}` },
  ]

  const schema = buildAuthorPersonSchema(author)
  const paragraphs = author.longBio.split('\n\n').filter(Boolean)

  // Extension point: Phase 2 will populate authored content here
  const authoredSlugs = await getAuthoredContentSlugs(author.slug)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <JsonLd schema={schema} />

      <div className="bg-white border-b border-slate-100 pt-6">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <ProfileHero
        displayName={author.displayName}
        roleTitle={author.roleTitle}
        shortBio={author.shortBio}
        expertiseAreas={author.expertiseAreas}
        profileLastUpdated={author.profileLastUpdated}
        profileType="author"
        isDemoProfile={author.isDemoProfile}
        yearsExperience={author.yearsExperience}
        languages={author.languages}
        socialLinks={author.socialLinks}
        website={author.website}
      />

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl flex flex-col gap-8">

          {/* Bio */}
          <section
            aria-labelledby="bio-heading"
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8"
          >
            <h2 id="bio-heading" className="text-[18px] font-bold text-slate-800 mb-5">
              About {author.displayName}
            </h2>
            <div className="flex flex-col gap-4 text-[14.5px] text-slate-600 leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {/* Content specialties */}
          <section
            aria-labelledby="specialties-heading"
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-[#DBEAFE] rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen size={15} className="text-primary" />
              </div>
              <h2 id="specialties-heading" className="text-[18px] font-bold text-slate-800">
                Content Specialties
              </h2>
            </div>
            <ul className="flex flex-col gap-2">
              {author.contentSpecialties.map((s) => (
                <li key={s} className="flex items-center gap-2.5 text-[13.5px] text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {/* Education */}
          {author.education && author.education.length > 0 && (
            <section
              aria-labelledby="education-heading"
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8"
            >
              <h2 id="education-heading" className="text-[18px] font-bold text-slate-800 mb-4">
                Education
              </h2>
              <ul className="flex flex-col gap-3">
                {author.education.map((ed) => (
                  <li key={ed.degree}>
                    <p className="text-[13.5px] font-semibold text-slate-700">{ed.degree}</p>
                    <p className="text-[13px] text-slate-500">
                      {ed.institution}
                      {ed.year ? `, ${ed.year}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Articles by this author — Phase 2 extension point */}
          <section
            aria-labelledby="articles-heading"
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText size={15} className="text-slate-400" />
              </div>
              <h2 id="articles-heading" className="text-[18px] font-bold text-slate-800">
                Articles by {author.displayName}
              </h2>
            </div>
            {authoredSlugs.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {authoredSlugs.map((s) => (
                  <li key={s}>
                    <a href={`/${s}`} className="text-[13.5px] text-primary hover:underline">
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-slate-400">
                Content attribution is being added. Articles by this author will appear here.
              </p>
            )}
          </section>

          {/* Editorial standards note */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl px-5 py-4">
            <p className="text-[13px] text-slate-600 leading-relaxed">
              This author operates under the OverseasNursing{' '}
              <a href="/editorial-policy" className="text-primary font-semibold hover:underline">
                editorial policy
              </a>
              , including full independence from agencies and commitment to verified sourcing.
            </p>
          </div>

          <a href="/authors" className="text-[13.5px] font-semibold text-primary hover:underline">
            ← All authors
          </a>
        </div>
      </div>
    </div>
  )
}
