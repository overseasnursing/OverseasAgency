import React from 'react'

type SectionBackground = 'page' | 'card' | 'section' | 'warm'
type SectionSpacing    = 'xs' | 'sm' | 'md' | 'lg'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  /**
   * xs — 16px/24px — compact strips (trust bars, breadcrumbs)
   * sm — 32px/48px — related content blocks, tight cards
   * md — 56px/80px — standard content section (default)
   * lg — 80px/112px — hero, primary landing sections
   */
  spacing?: SectionSpacing
  /**
   * page    — #F8FAFC — default page background
   * card    — #FFFFFF — elevated/card-like feel
   * section — #F1F5F9 — alternate tint for visual rhythm
   * warm    — #FFF8F1 — testimonials, stories, emotional sections
   */
  background?: SectionBackground
  /** Draws a 1px top rule to separate from the section above */
  divided?: boolean
  as?: React.ElementType
}

const spacingClass: Record<SectionSpacing, string> = {
  xs: 'py-4   md:py-6',
  sm: 'py-8   md:py-12',
  md: 'py-14  md:py-20',
  lg: 'py-20  md:py-28',
}

const backgroundClass: Record<SectionBackground, string> = {
  page:    'bg-[#F8FAFC]',
  card:    'bg-white',
  section: 'bg-[#F1F5F9]',
  warm:    'bg-[#FFF8F1]',
}

export const SectionWrapper = React.forwardRef<HTMLElement, SectionWrapperProps>(
  (
    {
      children,
      className  = '',
      spacing    = 'md',
      background = 'page',
      divided    = false,
      as: Tag    = 'section',
    },
    ref
  ) => (
    <Tag
      ref={ref}
      className={[
        spacingClass[spacing],
        backgroundClass[background],
        divided ? 'border-t border-slate-100' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  )
)

SectionWrapper.displayName = 'SectionWrapper'
