<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
| ------ | ---------- |
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.

---

# Database Safety Rules (NON-NEGOTIABLE)

Production holds real, live user data. Treat it as valuable and irreplaceable.

Never, under any circumstances, without explicit user approval in that exact conversation:

* Run `supabase db reset` (in any form).
* Run `supabase db reset --linked`.
* Run destructive SQL — `DROP`, `TRUNCATE`, or a `DELETE`/`UPDATE` without a narrow `WHERE` — against the linked/production database.
* Apply migrations to production (`supabase db push` or equivalent) automatically or as a side effect of another task.
* Modify, seed, or overwrite production data.

Always:

* Assume the linked/remote Supabase project is production unless told otherwise.
* Ask the user before executing any destructive or production-affecting database operation, and state exactly what will run.
* Prefer `--local` for any reset, seed, or destructive testing operation.
* Default to read-only verification (`supabase migration list`, `supabase db query --linked` for SELECTs) when checking production state.

If a task seems to require a destructive or production database operation, stop and ask — do not infer approval from unrelated instructions.

---

# OverseasNursing.com — Advanced Claude Instructions

## Core Product Identity

This project is NOT:

* a traditional company website
* a recruitment portal
* a job board
* a consultancy landing page

This project IS:

* a search-first platform
* an SEO-first content engine
* a trust & transparency platform
* a migration intelligence platform
* a pricing comparison engine
* a scam awareness system

Think:
“Glassdoor + TripAdvisor + CompareTheMarket for Overseas Nursing Migration”

The platform should behave like:

* a search engine
* a comparison platform
* a structured information system
* a scalable SEO directory

---

# Core Priorities

Every technical and design decision must prioritize:

1. SEO
2. Page speed
3. Scalability
4. Search intent
5. Trust
6. Mobile-first UX
7. Programmatic page generation

---

# Rendering Architecture (VERY IMPORTANT)

## SSG — Static Site Generation

Use SSG for:

* country pages
* guide pages
* salary pages
* comparison pages
* FAQ pages
* visa pages
* exam pages
* location pages

Examples:

* /country/germany
* /guides/nclex-process
* /compare/germany-vs-uk
* /location/kerala

Reason:
These pages are SEO-focused and rarely change.

Benefits:

* maximum indexing speed
* lower TTFB
* better Lighthouse scores
* lower hosting cost
* stronger Core Web Vitals

---

## ISR — Incremental Static Regeneration

Use ISR for:

* agency pages
* pricing pages
* review pages

Examples:

* /agency/abc-overseas
* /pricing/germany

Reason:
Agency data changes occasionally.

ISR avoids rebuilding the entire site.

Revalidation:

* Agency pages: 1–7 days
* Reviews: 1 day
* Pricing: 1–3 days

---

## SSR — Server Side Rendering

Use SSR ONLY for:

* live search
* dynamic filtering
* dashboards
* admin systems
* authenticated pages

Avoid excessive SSR.

SSR-heavy architecture is slower, expensive, and harder to scale.

---

# SEO Architecture (CRITICAL)

SEO is the main growth engine.

Without SEO:

* no traffic
* no indexing
* no scale
* no authority

Main SEO page types:

* Country SEO
* Agency SEO
* Location SEO
* Pricing SEO
* Guide SEO
* Comparison SEO
* Scam SEO

Examples:

* /country/germany
* /agency/best-overseas
* /location/kochi
* /pricing/germany
* /guides/oet-vs-ielts
* /compare/germany-vs-uk

---

# Programmatic SEO

Programmatically generate:

* city pages
* salary pages
* comparison pages
* pricing pages
* agency pages
* exam pages
* FAQ pages

Focus on:

* search intent coverage
* long-tail SEO
* internal linking
* topical authority

Examples:

* best nursing agencies in kerala
* germany nurse salary for indian nurses
* dha exam process from india
* germany nursing consultancy fees

---

# Structured Data Requirements

Must implement:

* FAQ Schema
* Review Schema
* Breadcrumb Schema
* Organization Schema
* Article Schema

Use:

* JSON-LD only

Every SEO page should support schema markup.

---

# Metadata Rules

Every page must have:

* unique title
* unique meta description
* canonical URL
* Open Graph tags
* Twitter metadata

Must dynamically generate metadata.

---

# Internal Linking Strategy

Every page must internally link to:

* related agencies
* related countries
* related guides
* related pricing pages
* related comparison pages

Purpose:

* authority clustering
* crawl optimization
* SEO scaling

---

# URL Structure

Use clean SEO-first URLs.

Examples:

* /country/germany
* /agency/abc-overseas
* /pricing/germany
* /guides/nclex-process
* /compare/germany-vs-uk
* /location/kochi

Avoid:

* query-heavy URLs
* random IDs in URLs

Always use slugs.

---

# Performance Requirements

Target:

* 90+ Lighthouse SEO
* 90+ Lighthouse Performance

Must implement:

* lazy loading
* route caching
* CDN caching
* image optimization
* dynamic imports
* responsive images
* metadata optimization

Use:

* WebP
* AVIF
* next/image

---

# UI & Design Philosophy

The UI must feel:

* lightweight
* modern
* trustworthy
* fast
* information-rich
* search-first

Avoid:

* glassmorphism
* excessive gradients
* heavy animation
* cluttered layouts
* overdesigned corporate UI

Animations should be subtle and minimal.

---

# Homepage Philosophy

Homepage is NOT a branding page.

Homepage is:

* a search portal
* an SEO hub
* a discovery system

Homepage must prioritize:

* search
* country discovery
* agency discovery
* pricing discovery
* trust indicators

---

# Search Philosophy

Search is a core product feature.

Search should support:

* agencies
* countries
* exams
* pricing
* locations

Prefer:

* PostgreSQL Full Text Search

Avoid:

* over-engineered search infrastructure initially

---

# Core Features

Build:

* agency listings
* country pages
* guides
* reviews
* scam reports
* pricing comparison
* admin moderation
* search
* filtering

Do NOT build in MVP:

* AI systems
* messaging
* forums
* subscriptions
* community systems
* advanced analytics dashboards

---

# Database Philosophy

Use scalable normalized schema structure.

Core tables:

* users
* agencies
* branches
* reviews
* pricing
* scam_reports
* countries
* guides

All schemas must support:

* scalability
* filtering
* SEO generation
* future expansion

---

# Tech Stack

Frontend:

* Next.js 15 App Router
* React Server Components
* TypeScript
* Tailwind CSS
* shadcn/ui

Backend:

* Supabase
* PostgreSQL
* Supabase Auth
* Edge Functions

Infrastructure:

* Vercel
* Cloudflare CDN
* Cloudflare R2
* Cloudflare WAF

SEO:

* next-sitemap
* JSON-LD
* dynamic metadata

Analytics:

* Google Analytics
* Google Search Console
* Microsoft Clarity

---

# Coding Philosophy

Prefer:

* reusable components
* server components
* scalable architecture
* modular structure
* SEO-first rendering

Avoid:

* unnecessary client components
* large monolithic files
* unoptimized rendering
* over-engineering

---

# Final Product Direction

This platform should eventually become:

* the search engine for overseas nursing migration
* the transparency layer for agencies
* the pricing intelligence platform
* the scam awareness authority
* the SEO-dominant migration directory

Everything should prioritize:

* SEO traffic
* trust
* speed
* scalability
* search intent

