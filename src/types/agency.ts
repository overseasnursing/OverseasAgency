export type TrustLevel = 'verified' | 'trusted' | 'unverified' | 'scam-reported'

export interface ReviewSnippet {
  authorName: string
  authorFrom: string       // city, state
  countryPlaced: string
  rating: number
  text: string
  actualCostPaid: string   // e.g. "₹4.2L"
  timeline: string         // e.g. "11 months"
  date: string
}

export interface Agency {
  id: string
  slug: string
  name: string
  logo?: string            // URL; falls back to initials
  featuredImage?: string   // hero image on listing card
  location: string         // display string
  city: string
  state: string
  established: number
  trustLevel: TrustLevel
  rating: number           // 0–5
  reviewCount: number
  placementCount: number
  transparencyScore: number // 0–100
  countries: string[]
  examsSupported: string[]
  pricing: {
    minLakhs: number       // in lakhs INR
    maxLakhs: number
    isApproximate: boolean
  }
  hiddenChargesReported: number  // count of reports
  visaSponsorship: boolean
  averageTimelineMonths: string  // e.g. "8–12"
  tagline: string          // short emotional trust summary
  reviewSnippet: ReviewSnippet
  featured: boolean
}

export interface FilterState {
  search: string
  countries: string[]
  state: string | null
  city: string | null
  maxPriceLakhs: number | null
  minRating: number | null
  visaSponsorship: boolean | null
  hideScamReported: boolean
  hideHiddenCharges: boolean
  minPlacements: number | null
  sortBy: 'rating' | 'reviews' | 'placements' | 'price-asc' | 'price-desc'
}

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  countries: [],
  state: null,
  city: null,
  maxPriceLakhs: null,
  minRating: null,
  visaSponsorship: null,
  hideScamReported: false,
  hideHiddenCharges: false,
  minPlacements: null,
  sortBy: 'rating',
}
