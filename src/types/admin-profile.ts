export interface AdminProfile {
  // ── Author ──────────────────────────────────────────
  authorDisplayName: string
  authorSlug: string
  authorRoleTitle: string
  authorShortBio: string
  authorLongBio: string
  authorProfilePhoto: string
  authorYearsExperience?: number
  authorExpertiseAreas: string[]
  authorContentSpecialties: string[]
  authorLinkedinUrl?: string
  authorFacebookUrl?: string
  authorInstagramUrl?: string
  authorTwitterUrl?: string
  authorYoutubeUrl?: string

  // ── Reviewer ─────────────────────────────────────────
  reviewerDisplayName: string
  reviewerSlug: string
  reviewerTitle: string
  reviewerShortBio: string
  reviewerLongBio: string
  reviewerProfilePhoto: string
  reviewerYearsExperience?: number
  reviewerRegistrationNumber?: string
  reviewerIssuingAuthority?: string
  reviewerExpertiseAreas: string[]
  reviewerSpecialties: string[]
  reviewerCredentialSummary: string
  reviewerLinkedinUrl?: string
  reviewerFacebookUrl?: string
  reviewerInstagramUrl?: string
  reviewerTwitterUrl?: string
  reviewerYoutubeUrl?: string

  // ── Site social links ────────────────────────────────
  siteFacebookUrl?: string
  siteInstagramUrl?: string
  siteTwitterUrl?: string
  siteLinkedinUrl?: string
  siteYoutubeUrl?: string
  siteWhatsappUrl?: string

  // ── Email / SendPulse ────────────────────────────────
  sendpulseApiId?: string
  sendpulseApiSecret?: string
  emailFromName?: string
  emailFromEmail?: string

  updatedAt?: string
}

// DB row shape (snake_case) — used only inside the DB layer
export interface AdminProfileRow {
  id: string
  author_display_name: string
  author_slug: string
  author_role_title: string
  author_short_bio: string
  author_long_bio: string
  author_profile_photo: string
  author_years_experience: number | null
  author_expertise_areas: string[]
  author_content_specialties: string[]
  author_linkedin_url: string | null
  author_facebook_url: string | null
  author_instagram_url: string | null
  author_twitter_url: string | null
  author_youtube_url: string | null
  reviewer_display_name: string
  reviewer_slug: string
  reviewer_title: string
  reviewer_short_bio: string
  reviewer_long_bio: string
  reviewer_profile_photo: string
  reviewer_years_experience: number | null
  reviewer_registration_number: string | null
  reviewer_issuing_authority: string | null
  reviewer_expertise_areas: string[]
  reviewer_specialties: string[]
  reviewer_credential_summary: string
  reviewer_linkedin_url: string | null
  reviewer_facebook_url: string | null
  reviewer_instagram_url: string | null
  reviewer_twitter_url: string | null
  reviewer_youtube_url: string | null
  site_facebook_url: string | null
  site_instagram_url: string | null
  site_twitter_url: string | null
  site_linkedin_url: string | null
  site_youtube_url: string | null
  site_whatsapp_url: string | null
  sendpulse_api_id: string | null
  sendpulse_api_secret: string | null
  email_from_name: string | null
  email_from_email: string | null
  updated_at: string | null
}
