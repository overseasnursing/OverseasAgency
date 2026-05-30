export interface AuthorEducation {
  degree: string
  institution: string
  year?: number
}

export interface SocialLink {
  platform: string
  url: string
}

export interface Author {
  // Required
  slug: string
  fullName: string
  displayName: string
  roleTitle: string
  shortBio: string
  longBio: string
  profileImage: string
  expertiseAreas: string[]
  contentSpecialties: string[]
  profileLastUpdated: string

  // Optional
  credentials?: string[]
  education?: AuthorEducation[]
  yearsExperience?: number
  languages?: string[]
  socialLinks?: SocialLink[]
  website?: string
  isDemoProfile?: boolean
  authoredSlugs?: string[]
}
