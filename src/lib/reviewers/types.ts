export interface SocialLink {
  platform: string
  url: string
}

export type VerificationStatus = 'verified' | 'pending' | 'inactive'

export interface Reviewer {
  // Required
  slug: string
  fullName: string
  displayName: string
  reviewerTitle: string
  shortBio: string
  longBio: string
  profileImage: string
  expertiseAreas: string[]
  reviewSpecialties: string[]
  credentialSummary: string
  verificationStatus: VerificationStatus
  jurisdiction: string[]
  profileLastUpdated: string

  // Optional
  licenseNumber?: string
  registrationNumber?: string
  issuingBody?: string
  yearsExperience?: number
  professionalMemberships?: string[]
  socialLinks?: SocialLink[]
  isDemoProfile?: boolean
  reviewedSlugs?: string[]
}
