# Frontend Foundation — Quick Reference

This document covers all available design tokens, utilities, and component patterns for building pages on OverseasNursing.com.

## Color Utilities

### Primary Brand
```tsx
// Background colors
className="bg-primary" // #0F4C81
className="hover:bg-primary-hover" // #0C3A63

// Text colors
className="text-primary"
className="hover:text-primary-hover"

// Trust indicators
className="bg-verified-bg text-verified-text" // Green
className="bg-trusted-bg text-trusted-text" // Light blue
className="bg-transparent_pricing-bg text-transparent_pricing-text" // Warm
className="bg-scam-bg text-scam-text" // Red
```

### Accent Colors
```tsx
className="text-accent-blue" // #2563EB (links)
className="text-accent-green" // #22C55E (success)
className="text-accent-red" // #EF4444 (danger)
className="text-accent-warm" // #F59E0B (emotional)
```

### Background Colors
```tsx
className="bg-bg-primary" // #F8FAFC (page background)
className="bg-bg-card" // #FFFFFF (cards)
className="bg-bg-section" // #F1F5F9 (alternate sections)
className="bg-bg-warm" // #FFF8F1 (testimonials, human sections)
```

### Text Colors
```tsx
className="text-text-primary" // #0F172A (main text)
className="text-text-secondary" // #64748B (secondary text)
className="text-text-muted" // #94A3B8 (metadata)
```

## Typography Utilities

### Headings
```tsx
className="text-h1" // 48px, bold, 120% line-height
className="text-h2" // 38px, bold, 120% line-height
className="text-h3" // 30px, semi-bold, 120% line-height
className="text-h4" // 22px, semi-bold, 120% line-height

// Mobile versions
className="text-h1-mobile" // 34px
className="text-h2-mobile" // 28px
className="text-h3-mobile" // 24px
className="text-h4-mobile" // 20px
```

### Body Text
```tsx
className="text-body" // 16px, regular, 165% line-height
className="text-sm" // 14px, regular
className="text-xs" // 13px, medium (for labels/metadata)
```

### Usage Example
```tsx
<h1 className="text-h1 md:text-h1 font-bold">Heading</h1>
<p className="text-body text-text-secondary">Secondary text</p>
<label className="text-xs">Label</label>
```

## Spacing Utilities

### Padding/Margin Scale
```tsx
className="p-xs" // 4px
className="p-sm" // 8px
className="p-md" // 16px
className="p-lg" // 24px
className="p-xl" // 32px
className="p-xxl" // 48px
className="p-xxxl" // 72px

className="m-md" // 16px margin
className="gap-lg" // 24px gap in flexbox/grid
```

### Common Patterns
```tsx
// Padding on all sides
className="p-lg"

// Vertical padding (common for sections)
className="py-xxl"

// Horizontal padding (responsive)
className="px-md md:px-lg"

// Margin bottom (for spacing)
className="mb-lg"

// Gap in flex/grid
className="flex gap-md"
className="grid grid-cols-3 gap-lg"
```

## Container & Layout

### Container Component
```tsx
import { Container } from '@/components/layout/Container'

// Default (md size)
<Container>
  Content
</Container>

// Specific sizes
<Container size="sm"> {/* 768px max */}
<Container size="md"> {/* 1280px max */}
<Container size="lg"> {/* 1440px max */}
```

### SectionWrapper Component
```tsx
import { SectionWrapper } from '@/components/layout/SectionWrapper'

// Default
<SectionWrapper>
  <Container>Content</Container>
</SectionWrapper>

// With options
<SectionWrapper spacing="lg" background="card">
  <Container>Content</Container>
</SectionWrapper>

// Spacing options: 'sm', 'md', 'lg'
// Background options: 'primary', 'card', 'section', 'warm'
```

## Border Radius

```tsx
className="rounded-button" // 10px
className="rounded-card" // 18px
className="rounded-input" // 12px
className="rounded-badge" // 999px (full round)
className="rounded-modal" // 24px
```

## Shadows

```tsx
className="shadow-card" // Subtle, for cards
className="shadow-card-hover" // Medium, for hover states
className="shadow-modal" // Large, for modals
```

## Responsive Breakpoints

```tsx
// Mobile-first (no prefix = all sizes)
className="px-md" // applies to xs and up

// Specific breakpoints
className="md:px-lg" // applies at md and up
className="lg:grid-cols-3" // applies at lg and up
className="xl:text-h2" // applies at xl and up

// Common responsive pattern
className="text-h2-mobile md:text-h2 px-md md:px-lg py-xxl md:py-xxxl"
```

### Breakpoint Sizes
- xs: 320px
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## Button Patterns

### Primary Button
```tsx
<button className="px-lg py-md bg-primary hover:bg-primary-hover text-white font-medium rounded-button transition-colors">
  Click me
</button>
```

### Secondary Button
```tsx
<button className="px-lg py-md bg-bg-section hover:bg-gray-300 text-text-primary font-medium rounded-button transition-colors">
  Click me
</button>
```

### Danger Button
```tsx
<button className="px-lg py-md bg-accent-red hover:bg-red-700 text-white font-medium rounded-button transition-colors">
  Delete
</button>
```

### Link Button
```tsx
<a href="#" className="text-accent-blue hover:underline font-medium">
  Link button
</a>
```

## Card Patterns

### Basic Card
```tsx
<div className="bg-bg-card rounded-card p-lg shadow-card hover:shadow-card-hover transition-shadow">
  Card content
</div>
```

### Agency Card Pattern
```tsx
<div className="bg-bg-card rounded-card overflow-hidden shadow-card">
  {/* Agency logo/image */}
  <div className="p-lg">
    <h4 className="text-h4 font-semibold mb-sm">Agency Name</h4>
    <div className="flex items-center gap-md mb-md">
      <span className="text-accent-green">★ 4.5</span>
      <span className="bg-verified-bg text-verified-text px-sm py-xs rounded-badge text-xs">
        Verified
      </span>
    </div>
    <p className="text-text-secondary mb-md">$5,000 - $8,000</p>
  </div>
</div>
```

## Grid Patterns

### 3-Column Desktop, 1-Column Mobile
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
  {/* Cards */}
</div>
```

### 2-Column with Sidebar
```tsx
<div className="grid grid-cols-1 lg:grid-cols-4 gap-lg">
  {/* Sidebar - 1 col */}
  <aside className="lg:col-span-1">Sidebar</aside>
  {/* Main content - 3 cols */}
  <main className="lg:col-span-3">Main content</main>
</div>
```

## Trust Indicator Patterns

### Verified Badge
```tsx
<div className="inline-flex items-center gap-sm bg-verified-bg text-verified-text px-md py-sm rounded-badge">
  <CheckCircle size={16} />
  <span className="text-xs font-medium">Verified Agency</span>
</div>
```

### Scam Alert
```tsx
<div className="bg-scam-bg border border-accent-red rounded-card p-lg">
  <h4 className="text-h4 text-accent-red font-semibold mb-md">Scam Alert</h4>
  <p className="text-scam-text">Details about reported scam</p>
</div>
```

### Rating Display
```tsx
<div className="flex items-center gap-md">
  <div className="flex items-center gap-xs">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={20} className="text-accent-warm fill-accent-warm" />
    ))}
  </div>
  <span className="font-semibold">4.8</span>
  <span className="text-text-secondary">(234 reviews)</span>
</div>
```

## Form Patterns

### Input with Label
```tsx
<div>
  <label className="text-xs font-medium text-text-primary mb-sm block">
    Email Address
  </label>
  <input
    type="email"
    className="w-full px-md py-md border border-gray-300 rounded-input text-body focus:outline-none focus:ring-2 focus:ring-primary"
    placeholder="you@example.com"
  />
</div>
```

### Form Section
```tsx
<form className="space-y-lg">
  <div>
    <label className="text-xs">Name</label>
    <input type="text" className="..." />
  </div>
  <div>
    <label className="text-xs">Email</label>
    <input type="email" className="..." />
  </div>
  <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-md rounded-button font-medium">
    Submit
  </button>
</form>
```

## Accessibility Patterns

### Skip Navigation
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Focus Visible
```tsx
// Automatically applied globally in globals.css
// Elements automatically show outline on focus-visible
```

### ARIA Labels
```tsx
<button aria-label="Close menu">
  <X size={24} />
</button>

<nav aria-label="Main navigation">
  {/* nav items */}
</nav>
```

## Animation Classes

```tsx
className="animate-fade-in" // Smooth fade in
className="animate-slide-up" // Slide up animation
className="transition-all duration-300" // Custom transitions
className="hover:bg-primary" // Hover state
```

## Semantic HTML

### Headings
```tsx
<h1>Page title (only one per page)</h1>
<h2>Section heading</h2>
<h3>Subsection heading</h3>
```

### Lists
```tsx
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<ol>
  <li>Step 1</li>
  <li>Step 2</li>
</ol>
```

### Semantic Sections
```tsx
<article>Article content</article>
<aside>Sidebar content</aside>
<section>Section content</section>
<nav>Navigation</nav>
<footer>Footer content</footer>
```

## Mobile-First Development

Always start with mobile styles (no prefix), then add desktop enhancements:

```tsx
// Good (mobile-first)
className="flex flex-col md:flex-row gap-md md:gap-lg py-md md:py-lg px-md md:px-xl"

// Avoid (desktop-first)
className="md:flex md:flex-row md:gap-lg"
```

## Troubleshooting

### Layout Issues
- Check Container size vs available space
- Use `max-w-container` not `w-full` for content
- Ensure responsive classes are in correct order

### Typography Issues
- Use text-h1/h2/h3/h4 utilities, not arbitrary sizes
- Mobile headings automatically scale with `md:` prefix
- Line heights are optimized in typography utilities

### Color Issues
- Use semantic color utilities (text-primary, bg-primary)
- Verify contrast ratios (AA minimum)
- Check that text on backgrounds meets 4.5:1 contrast

### Spacing Issues
- Use spacing scale (xs-xxxl), not arbitrary values
- Keep sections consistent with SectionWrapper
- Use gap for flex/grid children, not margin

## Performance Tips

1. **Use Server Components** — Default for pages and layouts
2. **Lazy Load Images** — Use next/image with loading="lazy"
3. **Minimize JS** — Keep components simple, move logic to server
4. **CSS Classes** — Tailwind's build-time compilation handles optimization
5. **SVGs** — Use Lucide icons (already optimized)

## Next: Building Pages

Ready to build actual pages? Start with:
1. Use Container + SectionWrapper for layout
2. Import reusable components
3. Follow semantic HTML structure
4. Apply design token utilities consistently
5. Test responsiveness on mobile first
