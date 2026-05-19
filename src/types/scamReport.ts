export type ScamCategory = 'fee-fraud' | 'fake-job' | 'document-fraud' | 'visa-fraud' | 'abandonment' | 'other'
export type ScamSeverity = 'critical' | 'high' | 'moderate'

export interface ScamTimelineEvent {
  date: string
  event: string
}

export interface PlatformScamReport {
  id: string
  slug: string
  agencySlug: string
  agencyName: string
  reporterName: string
  reporterInitials: string
  reporterFrom: string
  reportedDate: string
  displayDate: string
  title: string
  category: ScamCategory
  severity: ScamSeverity
  amountLost: number
  amountPaid: number
  amountRecovered: number
  countryPromised: string
  cityPromised?: string
  summary: string
  fullIncident: string
  timelineEvents: ScamTimelineEvent[]
  warningSignsMissed: string[]
  lessonsLearned: string[]
  emotionalExperience: string
  resolved: boolean
  resolutionNote?: string
  agencyResponse?: string
  verified: boolean
  helpful: number
  evidenceCount: number
  relatedReportSlugs: string[]
}
