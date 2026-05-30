import { ShieldCheck, Calendar, Globe, Award, User } from 'lucide-react'
import type { VerificationStatus } from '@/lib/reviewers/types'

interface ProfileHeroProps {
  displayName: string
  roleTitle: string
  shortBio: string
  expertiseAreas: string[]
  profileLastUpdated: string
  profileType: 'author' | 'reviewer'
  isDemoProfile?: boolean
  verificationStatus?: VerificationStatus
  credentialSummary?: string
  issuingBody?: string
  registrationNumber?: string
  jurisdiction?: string[]
  yearsExperience?: number
  languages?: string[]
  socialLinks?: { platform: string; url: string }[]
  website?: string
}

export function ProfileHero({
  displayName,
  roleTitle,
  shortBio,
  expertiseAreas,
  profileLastUpdated,
  isDemoProfile,
  verificationStatus,
  credentialSummary,
  issuingBody,
  registrationNumber,
  jurisdiction,
  yearsExperience,
  languages,
  socialLinks,
  website,
}: ProfileHeroProps) {
  const isVerified = verificationStatus === 'verified' && !isDemoProfile

  const allLinks = [
    ...(website ? [{ platform: 'Website', url: website }] : []),
    ...(socialLinks ?? []),
  ]

  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">

        {/* Demo profile notice */}
        {isDemoProfile && (
          <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl px-4 py-3 mb-6 max-w-3xl">
            <p className="text-[12.5px] text-[#92400E] font-semibold">
              Sample profile — demonstration data only. Does not represent a real person.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-6 max-w-3xl">

          {/* Avatar placeholder */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <User size={36} className="text-slate-400" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + verification badge */}
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-[28px] sm:text-[32px] font-bold text-slate-900 leading-tight">
                {displayName}
              </h1>
              {isVerified && (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#166534] flex-shrink-0">
                  <ShieldCheck size={12} />
                  Verified Reviewer
                </span>
              )}
            </div>

            <p className="text-[15px] text-primary font-semibold mb-3">{roleTitle}</p>
            <p className="text-[14.5px] text-slate-500 leading-relaxed mb-4">{shortBio}</p>

            {/* Credential block — reviewer only, omit registrationNumber for demo */}
            {credentialSummary && (
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-4 py-3 mb-4">
                <p className="text-[13px] text-[#166534] font-medium leading-relaxed">
                  {credentialSummary}
                </p>
                {!isDemoProfile && issuingBody && registrationNumber && (
                  <p className="text-[12px] text-[#166534]/80 mt-1">
                    {issuingBody} · Reg. {registrationNumber}
                  </p>
                )}
              </div>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12.5px] text-slate-400">
              {yearsExperience && (
                <span className="flex items-center gap-1">
                  <Award size={13} />
                  {yearsExperience} years experience
                </span>
              )}
              {jurisdiction && jurisdiction.length > 0 && (
                <span className="flex items-center gap-1">
                  <Globe size={13} />
                  {jurisdiction.join(', ')}
                </span>
              )}
              {languages && languages.length > 0 && (
                <span>{languages.join(' · ')}</span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                Updated {profileLastUpdated}
              </span>
            </div>

            {/* Social / website links */}
            {allLinks.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {allLinks.map(({ platform, url }) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12.5px] text-primary font-medium hover:underline"
                  >
                    {platform} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Expertise tags */}
        <div className="flex flex-wrap gap-2 mt-6 max-w-3xl">
          {expertiseAreas.map((area) => (
            <span
              key={area}
              className="inline-block text-[12px] font-medium px-2.5 py-1 rounded-full bg-[#DBEAFE] text-[#1D4ED8]"
            >
              {area}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
