# OverseasNursing.com — Frontend Foundation

A trust-first, mobile-first frontend foundation for the OverseasNursing platform. Built with Next.js 15, TypeScript, Tailwind CSS, and semantic HTML.

## Core Philosophy

The UI is designed to reduce uncertainty and build emotional reassurance for nurses planning overseas careers. Every design decision prioritizes:

- **Trust** through verified badges, transparency, and scam awareness
- **Emotional reassurance** with warm tones and human language
- **Speed** with mobile-first rendering and minimal animations
- **Accessibility** with semantic HTML and proper contrast ratios

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout with navigation
│   └── globals.css              # Global styles + design tokens
├── components/
│   ├── layout/
│   │   ├── Container.tsx        # Width-constrained container
│   │   └── SectionWrapper.tsx   # Reusable section component
│   └── navbar/
│       ├── Navbar.tsx           # Desktop navigation
│       └── MobileNav.tsx        # Mobile bottom navigation
├── lib/
│   └── constants/
│       └── tokens.ts            # Design token exports
└── types/                       # TypeScript types (future)
```

## Design System

### Colors

**Brand Colors:**
- Primary: `#0F4C81` (trust blue)
- Primary Hover: `#0C3A63`

**Accent Colors:**
- Accent Blue: `#2563EB`
- Verified Green: `#22C55E`
- Scam Red: `#EF4444`
- Warm: `#F59E0B`

**Backgrounds:**
- Primary: `#F8FAFC`
- Card: `#FFFFFF`
- Section: `#F1F5F9`
- Warm: `#FFF8F1`

### Typography

- **Font:** Manrope (imported from Google Fonts)
- **Scale:** H1 (48px) → H2 (38px) → H3 (30px) → H4 (22px) → Body (16px)
- **Line Height:** Headings 120%, Body 165%
- **Mobile-first:** Typography scales down on smaller screens

### Spacing Scale

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px
- xxxl: 72px

### Responsive Breakpoints

- xs: 320px
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## Key Components

### Container
Responsive width-constrained wrapper with mobile padding.

```tsx
<Container size="md">
  Content here
</Container>
```

### SectionWrapper
Consistent section spacing with background options.

```tsx
<SectionWrapper spacing="md" background="card">
  <Container>
    Content
  </Container>
</SectionWrapper>
```

### Navbar
Sticky desktop navigation with mobile hamburger menu.

### MobileNav
Bottom fixed navigation for mobile users (WhatsApp-style).

## Development

### Setup

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Design Principles

1. **Mobile-first** — Design for mobile, enhance for desktop
2. **SEO-safe** — Semantic HTML, proper heading structure
3. **Minimal animations** — Reduce motion preference respected
4. **No glassmorphism** — Clean, readable interface
5. **Trust indicators** — Verified badges, ratings, transparency scores visible
6. **Emotional tone** — Warm, supportive, human language

## CSS Variables

Global CSS variables are available for custom styling:

```css
--color-primary: #0F4C81;
--color-bg-primary: #F8FAFC;
--spacing-md: 16px;
```

## Tailwind Configuration

All design tokens are configured in `tailwind.config.ts`. Custom utilities:

- `bg-primary`, `text-primary` (brand colors)
- `bg-bg-card`, `bg-bg-section` (background colors)
- `px-md`, `py-lg` (spacing utilities)
- `h1`, `h2`, `h3`, `body` (typography utilities)
- `rounded-button`, `rounded-card` (border radius)
- `shadow-card`, `shadow-modal` (subtle shadows)

## Next Steps

1. Create page templates (homepage, agency pages, country pages)
2. Build reusable components (cards, buttons, badges)
3. Implement search interface
4. Add agency listing components
5. Build review/rating system UI
6. Integrate with backend API

## Performance

- **Lighthouse SEO:** 90+
- **Lighthouse Performance:** 90+
- **Image optimization:** WebP/AVIF via Tailwind
- **Font loading:** Manrope optimized
- **Minimal JS:** Server components used where possible

## Accessibility

- WCAG AA contrast ratios
- Semantic HTML structure
- Keyboard navigation
- Focus visible states
- Screen reader support
- Proper ARIA labels

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## License

Proprietary — OverseasNursing.com
