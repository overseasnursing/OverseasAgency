'use server'

import { upsertAdminProfile } from '@/lib/db/admin-profile'
import type { AdminProfile } from '@/types/admin-profile'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function saveAdminSettings(
  _prevState: { success: boolean; error?: string } | null,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const authorDisplayName = (formData.get('authorDisplayName') as string | null)?.trim() ?? ''
  const reviewerDisplayName = (formData.get('reviewerDisplayName') as string | null)?.trim() ?? ''

  const profile: Partial<AdminProfile> = {
    authorDisplayName,
    authorSlug: slugify(authorDisplayName),
    authorRoleTitle: (formData.get('authorRoleTitle') as string | null)?.trim() ?? '',
    authorShortBio: (formData.get('authorShortBio') as string | null)?.trim() ?? '',
    authorLongBio: (formData.get('authorLongBio') as string | null)?.trim() ?? '',
    authorProfilePhoto: (formData.get('authorProfilePhoto') as string | null)?.trim() ?? '',
    authorYearsExperience: Number(formData.get('authorYearsExperience') ?? 0) || undefined,
    authorExpertiseAreas: parseLines(formData.get('authorExpertiseAreas')),
    authorContentSpecialties: parseLines(formData.get('authorContentSpecialties')),
    authorLinkedinUrl: (formData.get('authorLinkedinUrl') as string | null)?.trim() ?? '',
    authorFacebookUrl: (formData.get('authorFacebookUrl') as string | null)?.trim() ?? '',
    authorInstagramUrl: (formData.get('authorInstagramUrl') as string | null)?.trim() ?? '',
    authorTwitterUrl: (formData.get('authorTwitterUrl') as string | null)?.trim() ?? '',
    authorYoutubeUrl: (formData.get('authorYoutubeUrl') as string | null)?.trim() ?? '',

    reviewerDisplayName,
    reviewerSlug: slugify(reviewerDisplayName),
    reviewerTitle: (formData.get('reviewerTitle') as string | null)?.trim() ?? '',
    reviewerShortBio: (formData.get('reviewerShortBio') as string | null)?.trim() ?? '',
    reviewerLongBio: (formData.get('reviewerLongBio') as string | null)?.trim() ?? '',
    reviewerProfilePhoto: (formData.get('reviewerProfilePhoto') as string | null)?.trim() ?? '',
    reviewerYearsExperience: Number(formData.get('reviewerYearsExperience') ?? 0) || undefined,
    reviewerRegistrationNumber: (formData.get('reviewerRegistrationNumber') as string | null)?.trim() ?? '',
    reviewerIssuingAuthority: (formData.get('reviewerIssuingAuthority') as string | null)?.trim() ?? '',
    reviewerExpertiseAreas: parseLines(formData.get('reviewerExpertiseAreas')),
    reviewerSpecialties: parseLines(formData.get('reviewerSpecialties')),
    reviewerCredentialSummary: (formData.get('reviewerCredentialSummary') as string | null)?.trim() ?? '',
    reviewerLinkedinUrl: (formData.get('reviewerLinkedinUrl') as string | null)?.trim() ?? '',
    reviewerFacebookUrl: (formData.get('reviewerFacebookUrl') as string | null)?.trim() ?? '',
    reviewerInstagramUrl: (formData.get('reviewerInstagramUrl') as string | null)?.trim() ?? '',
    reviewerTwitterUrl: (formData.get('reviewerTwitterUrl') as string | null)?.trim() ?? '',
    reviewerYoutubeUrl: (formData.get('reviewerYoutubeUrl') as string | null)?.trim() ?? '',
  }

  const result = await upsertAdminProfile(profile)
  if (result.error) return { success: false, error: result.error }
  return { success: true }
}

function parseLines(value: FormDataEntryValue | null): string[] {
  if (!value) return []
  return (value as string)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}
