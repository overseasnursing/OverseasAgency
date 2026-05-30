import { createAdminClient } from '@/lib/supabase/admin'
import type { AdminProfile, AdminProfileRow } from '@/types/admin-profile'

const FIXED_ROW_ID = '00000000-0000-0000-0000-000000000001'

function rowToProfile(row: AdminProfileRow): AdminProfile {
  return {
    authorDisplayName: row.author_display_name,
    authorSlug: row.author_slug,
    authorRoleTitle: row.author_role_title,
    authorShortBio: row.author_short_bio,
    authorLongBio: row.author_long_bio,
    authorProfilePhoto: row.author_profile_photo,
    authorYearsExperience: row.author_years_experience ?? undefined,
    authorExpertiseAreas: row.author_expertise_areas ?? [],
    authorContentSpecialties: row.author_content_specialties ?? [],
    authorLinkedinUrl: row.author_linkedin_url ?? undefined,
    authorFacebookUrl: row.author_facebook_url ?? undefined,
    authorInstagramUrl: row.author_instagram_url ?? undefined,
    authorTwitterUrl: row.author_twitter_url ?? undefined,
    authorYoutubeUrl: row.author_youtube_url ?? undefined,

    reviewerDisplayName: row.reviewer_display_name,
    reviewerSlug: row.reviewer_slug,
    reviewerTitle: row.reviewer_title,
    reviewerShortBio: row.reviewer_short_bio,
    reviewerLongBio: row.reviewer_long_bio,
    reviewerProfilePhoto: row.reviewer_profile_photo,
    reviewerYearsExperience: row.reviewer_years_experience ?? undefined,
    reviewerRegistrationNumber: row.reviewer_registration_number ?? undefined,
    reviewerIssuingAuthority: row.reviewer_issuing_authority ?? undefined,
    reviewerExpertiseAreas: row.reviewer_expertise_areas ?? [],
    reviewerSpecialties: row.reviewer_specialties ?? [],
    reviewerCredentialSummary: row.reviewer_credential_summary,
    reviewerLinkedinUrl: row.reviewer_linkedin_url ?? undefined,
    reviewerFacebookUrl: row.reviewer_facebook_url ?? undefined,
    reviewerInstagramUrl: row.reviewer_instagram_url ?? undefined,
    reviewerTwitterUrl: row.reviewer_twitter_url ?? undefined,
    reviewerYoutubeUrl: row.reviewer_youtube_url ?? undefined,

    updatedAt: row.updated_at ?? undefined,
  }
}

export async function getAdminProfile(): Promise<AdminProfile | null> {
  try {
    const db = createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (db as any)
      .from('admin_profile')
      .select('*')
      .eq('id', FIXED_ROW_ID)
      .single()

    if (error || !data) return null

    const row = data as AdminProfileRow
    // If the profile hasn't been filled in yet, return null
    if (!row.author_display_name && !row.reviewer_display_name) return null

    return rowToProfile(row)
  } catch {
    return null
  }
}

export async function upsertAdminProfile(
  profile: Partial<AdminProfile>,
): Promise<{ error?: string }> {
  try {
    const db = createAdminClient()

    const payload: Record<string, unknown> = { id: FIXED_ROW_ID, updated_at: new Date().toISOString() }

    if (profile.authorDisplayName !== undefined) payload.author_display_name = profile.authorDisplayName
    if (profile.authorSlug !== undefined) payload.author_slug = profile.authorSlug
    if (profile.authorRoleTitle !== undefined) payload.author_role_title = profile.authorRoleTitle
    if (profile.authorShortBio !== undefined) payload.author_short_bio = profile.authorShortBio
    if (profile.authorLongBio !== undefined) payload.author_long_bio = profile.authorLongBio
    if (profile.authorProfilePhoto !== undefined) payload.author_profile_photo = profile.authorProfilePhoto
    if (profile.authorYearsExperience !== undefined) payload.author_years_experience = profile.authorYearsExperience
    if (profile.authorExpertiseAreas !== undefined) payload.author_expertise_areas = profile.authorExpertiseAreas
    if (profile.authorContentSpecialties !== undefined) payload.author_content_specialties = profile.authorContentSpecialties
    if (profile.authorLinkedinUrl !== undefined) payload.author_linkedin_url = profile.authorLinkedinUrl || null
    if (profile.authorFacebookUrl !== undefined) payload.author_facebook_url = profile.authorFacebookUrl || null
    if (profile.authorInstagramUrl !== undefined) payload.author_instagram_url = profile.authorInstagramUrl || null
    if (profile.authorTwitterUrl !== undefined) payload.author_twitter_url = profile.authorTwitterUrl || null
    if (profile.authorYoutubeUrl !== undefined) payload.author_youtube_url = profile.authorYoutubeUrl || null

    if (profile.reviewerDisplayName !== undefined) payload.reviewer_display_name = profile.reviewerDisplayName
    if (profile.reviewerSlug !== undefined) payload.reviewer_slug = profile.reviewerSlug
    if (profile.reviewerTitle !== undefined) payload.reviewer_title = profile.reviewerTitle
    if (profile.reviewerShortBio !== undefined) payload.reviewer_short_bio = profile.reviewerShortBio
    if (profile.reviewerLongBio !== undefined) payload.reviewer_long_bio = profile.reviewerLongBio
    if (profile.reviewerProfilePhoto !== undefined) payload.reviewer_profile_photo = profile.reviewerProfilePhoto
    if (profile.reviewerYearsExperience !== undefined) payload.reviewer_years_experience = profile.reviewerYearsExperience
    if (profile.reviewerRegistrationNumber !== undefined) payload.reviewer_registration_number = profile.reviewerRegistrationNumber || null
    if (profile.reviewerIssuingAuthority !== undefined) payload.reviewer_issuing_authority = profile.reviewerIssuingAuthority || null
    if (profile.reviewerExpertiseAreas !== undefined) payload.reviewer_expertise_areas = profile.reviewerExpertiseAreas
    if (profile.reviewerSpecialties !== undefined) payload.reviewer_specialties = profile.reviewerSpecialties
    if (profile.reviewerCredentialSummary !== undefined) payload.reviewer_credential_summary = profile.reviewerCredentialSummary
    if (profile.reviewerLinkedinUrl !== undefined) payload.reviewer_linkedin_url = profile.reviewerLinkedinUrl || null
    if (profile.reviewerFacebookUrl !== undefined) payload.reviewer_facebook_url = profile.reviewerFacebookUrl || null
    if (profile.reviewerInstagramUrl !== undefined) payload.reviewer_instagram_url = profile.reviewerInstagramUrl || null
    if (profile.reviewerTwitterUrl !== undefined) payload.reviewer_twitter_url = profile.reviewerTwitterUrl || null
    if (profile.reviewerYoutubeUrl !== undefined) payload.reviewer_youtube_url = profile.reviewerYoutubeUrl || null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (db as any)
      .from('admin_profile')
      .upsert(payload, { onConflict: 'id' })

    if (error) return { error: error.message }
    return {}
  } catch (e) {
    return { error: String(e) }
  }
}
