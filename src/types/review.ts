export interface PlatformReview {
  id: string
  agencySlug: string
  agencyName: string

  authorName: string
  authorInitials: string
  authorFrom: string
  verified: boolean
  verifiedPlacement: boolean
  date: string

  rating: number
  communicationRating: number
  transparencyRating: number
  speedRating: number

  destinationCountry: string
  destinationCity: string
  hospitalType: string
  actualCostPaid: number
  timelineMonths: number
  visaReceived: boolean

  hiddenChargesExperienced: boolean
  hiddenChargesAmount?: number
  wouldRecommend: boolean
  recommendCondition?: string

  title: string
  body: string
  whatSurprisedMe?: string
  adviceForOthers?: string

  helpful: number
  featured: boolean
}
