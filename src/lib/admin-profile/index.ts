import { getAdminProfile } from '@/lib/db/admin-profile'
import type { AdminProfile } from '@/types/admin-profile'
import type { Author } from '@/lib/authors/types'
import type { Reviewer } from '@/lib/reviewers/types'

// Content association metadata — which pages this author/reviewer contributed to.
// This is editorial metadata tied to the codebase content, not the personal profile.
const AUTHORED_SLUGS = [
  'salary/germany-nurse-salary',
  'salary/uk-nurse-salary',
  'salary/canada-nurse-salary',
  'salary/australia-nurse-salary',
  'salary/dubai-nurse-salary',
  'exam/oet-guide',
  'exam/ielts-guide',
  'exam/nclex-rn-guide',
  'compare/germany-vs-uk',
  'compare/germany-vs-canada',
  'compare/uk-vs-australia',
]

const REVIEWED_SLUGS = [
  'salary/germany-nurse-salary',
  'salary/uk-nurse-salary',
  'exam/oet-guide',
  'exam/ielts-guide',
  'exam/cbse-osce-guide',
  'compare/germany-vs-uk',
  'compare/uk-vs-australia',
]

function buildSocialLinks(profile: AdminProfile, prefix: 'author' | 'reviewer') {
  const links: { platform: string; url: string }[] = []
  const p = profile as unknown as Record<string, unknown>
  const platforms = ['linkedin', 'facebook', 'instagram', 'twitter', 'youtube']
  for (const platform of platforms) {
    const url = p[`${prefix}${platform.charAt(0).toUpperCase() + platform.slice(1)}Url`] as string | undefined
    if (url) links.push({ platform, url })
  }
  return links
}

export function adminProfileToAuthor(profile: AdminProfile): Author {
  return {
    slug: profile.authorSlug,
    fullName: profile.authorDisplayName,
    displayName: profile.authorDisplayName,
    roleTitle: profile.authorRoleTitle,
    shortBio: profile.authorShortBio,
    longBio: profile.authorLongBio,
    profileImage: profile.authorProfilePhoto,
    expertiseAreas: profile.authorExpertiseAreas,
    contentSpecialties: profile.authorContentSpecialties,
    profileLastUpdated: profile.updatedAt
      ? new Date(profile.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
      : new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    yearsExperience: profile.authorYearsExperience,
    socialLinks: buildSocialLinks(profile, 'author'),
    isDemoProfile: false,
    authoredSlugs: AUTHORED_SLUGS,
  }
}

export function adminProfileToReviewer(profile: AdminProfile): Reviewer {
  const hasRegistration = Boolean(profile.reviewerRegistrationNumber)
  return {
    slug: profile.reviewerSlug,
    fullName: profile.reviewerDisplayName,
    displayName: profile.reviewerDisplayName,
    reviewerTitle: profile.reviewerTitle,
    shortBio: profile.reviewerShortBio,
    longBio: profile.reviewerLongBio,
    profileImage: profile.reviewerProfilePhoto,
    expertiseAreas: profile.reviewerExpertiseAreas,
    reviewSpecialties: profile.reviewerSpecialties,
    credentialSummary: profile.reviewerCredentialSummary,
    verificationStatus: hasRegistration ? 'verified' : 'pending',
    jurisdiction: [],
    profileLastUpdated: profile.updatedAt
      ? new Date(profile.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
      : new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    issuingBody: profile.reviewerIssuingAuthority,
    registrationNumber: profile.reviewerRegistrationNumber,
    yearsExperience: profile.reviewerYearsExperience,
    socialLinks: buildSocialLinks(profile, 'reviewer'),
    isDemoProfile: false,
    reviewedSlugs: REVIEWED_SLUGS,
  }
}

// Lightweight utility for ContentAttribution blocks across page templates.
// Returns null if no profile is configured — callers omit author/reviewer props gracefully.
export async function getAttributionProfiles(): Promise<{
  author: { name: string; slug: string }
  reviewer: { name: string; slug: string }
} | null> {
  const profile = await getAdminProfile()
  if (!profile) return null
  return {
    author: { name: profile.authorDisplayName, slug: profile.authorSlug },
    reviewer: { name: profile.reviewerDisplayName, slug: profile.reviewerSlug },
  }
}
