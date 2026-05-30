import { getAdminProfile } from '@/lib/db/admin-profile'
import { adminProfileToAuthor } from '@/lib/admin-profile'
import type { Author } from './types'

async function fetchAuthor(): Promise<Author | null> {
  const profile = await getAdminProfile()
  if (!profile) return null
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
