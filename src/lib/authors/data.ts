import { getAdminProfile } from '@/lib/db/admin-profile'
import { adminProfileToAuthor } from '@/lib/admin-profile'
import type { Author } from './types'

async function fetchAuthor(): Promise<Author | null> {
  const profile = await getAdminProfile()
  // getAdminProfile() only nulls out when BOTH author and reviewer are
  // unconfigured — if only the reviewer has been filled in, the author's own
  // fields are still empty strings. Guard here so we never generate an
  // empty-slug /authors/ page or a blank sitemap entry.
  if (!profile || !profile.authorSlug || !profile.authorDisplayName) return null
  return adminProfileToAuthor(profile)
}

export async function getAllAuthors(): Promise<Author[]> {
  const author = await fetchAuthor()
  return author ? [author] : []
}

export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
  const author = await fetchAuthor()
  if (!author) return undefined
  return author.slug === slug ? author : undefined
}

export async function getAuthoredContentSlugs(authorSlug: string): Promise<string[]> {
  const author = await getAuthorBySlug(authorSlug)
  return author?.authoredSlugs ?? []
}
