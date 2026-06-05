import { redirect } from 'next/navigation'

// Individual test landing pages removed — they created near-duplicate content and
// wasted crawl budget. All test-starting happens directly from the category page.
// Existing bookmarks and links are cleanly redirected to the category page.

type PageProps = {
  params: Promise<{ locationSlug: string; categorySlug: string }>
}

export default async function TestLandingPage({ params }: PageProps) {
  const { locationSlug, categorySlug } = await params
  redirect(`/mock-tests/${locationSlug}/${categorySlug}`)
}
