import { getAdminProfile } from '@/lib/db/admin-profile'
import { adminProfileToReviewer } from '@/lib/admin-profile'
import type { Reviewer } from './types'

async function fetchReviewer(): Promise<Reviewer | null> {
  const profile = await getAdminProfile()
  // getAdminProfile() only nulls out when BOTH author and reviewer are
  // unconfigured — if only the author has been filled in, the reviewer's own
  // fields are still empty strings. Guard here so we never generate an
  // empty-slug /reviewers/ page or a blank sitemap entry.
  if (!profile || !profile.reviewerSlug || !profile.reviewerDisplayName) return null
  return adminProfileToReviewer(profile)
}

export async function getAllReviewers(): Promise<Reviewer[]> {
  const reviewer = await fetchReviewer()
  return reviewer ? [reviewer] : []
}

export async function getReviewerBySlug(slug: string): Promise<Reviewer | undefined> {
  const reviewer = await fetchReviewer()
  if (!reviewer) return undefined
  return reviewer.slug === slug ? reviewer : undefined
}

export async function getReviewedContentSlugs(reviewerSlug: string): Promise<string[]> {
  const reviewer = await getReviewerBySlug(reviewerSlug)
  return reviewer?.reviewedSlugs ?? []
}
