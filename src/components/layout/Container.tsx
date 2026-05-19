import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  /**
   * readable  — 68ch   — articles, guides, single-column copy
   * default   — 1200px — most pages
   * wide      — 1400px — full-width grids, comparisons
   */
  size?: 'readable' | 'default' | 'wide'
}

const sizeClass: Record<NonNullable<ContainerProps['size']>, string> = {
  readable: 'max-w-readable',
  default:  'max-w-content',
  wide:     'max-w-wide',
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className = '', size = 'default' }, ref) => (
    <div
      ref={ref}
      className={[
        'w-full mx-auto',
        'px-5 sm:px-6 lg:px-8',
        sizeClass[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
)

Container.displayName = 'Container'
