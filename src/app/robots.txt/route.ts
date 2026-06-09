/**
 * /robots.txt — served as a raw route handler so we can include
 * Content-Signal directives and per-bot rules that the Next.js
 * MetadataRoute.Robots type cannot express.
 */

export const dynamic = 'force-static'

const ROBOTS = `# OverseasNursing.com — robots.txt
#
# POLICY: Search indexing and AI discovery are PERMITTED.
#         Training AI models on this content is STRICTLY PROHIBITED.
#
# Content-Signal specification (EU DSM Directive 2019/790, Article 4):
#   search=yes   — crawl and index for search results
#   ai-input=yes — use content to answer user questions (RAG, grounding, citations)
#   ai-train=no  — do NOT use content to train or fine-tune AI models
#
# ANY RESTRICTIONS EXPRESSED VIA CONTENT SIGNALS ARE EXPRESS RESERVATIONS OF
# RIGHTS UNDER ARTICLE 4 OF THE EUROPEAN UNION DIRECTIVE 2019/790 ON COPYRIGHT
# AND RELATED RIGHTS IN THE DIGITAL SINGLE MARKET.

# ── Global rule: allow discovery, block AI training ───────────────────────────
User-agent: *
Content-Signal: search=yes,ai-input=yes,ai-train=no
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /mock-tests/*/attempt*
Disallow: /mock-tests/*/study*

# ── AI discovery crawlers — ALLOWED ──────────────────────────────────────────
# These power AI search answers, citations, and recommendations.
# Content-Signal ai-train=no above instructs them not to use content for training.

# OpenAI / ChatGPT — general crawling and knowledge base
User-agent: GPTBot
Allow: /

# OpenAI — ChatGPT Search (real-time web answers, distinct from GPTBot)
User-agent: OAI-SearchBot
Allow: /

# OpenAI — ChatGPT user-triggered real-time browsing
User-agent: ChatGPT-User
Allow: /

# Anthropic / Claude — knowledge base, citations
User-agent: ClaudeBot
Allow: /

# Google — AI Overviews, Gemini grounding
User-agent: Google-Extended
Allow: /

# Microsoft — Bing Search and Microsoft Copilot
User-agent: Bingbot
Allow: /

# Apple — Siri, Apple Intelligence
User-agent: Applebot-Extended
Allow: /

# Amazon — Alexa AI, Amazon search
User-agent: Amazonbot
Allow: /

# Meta — Meta AI (WhatsApp, Instagram, Facebook)
User-agent: meta-externalagent
Allow: /

# Perplexity AI — AI-native search engine
User-agent: PerplexityBot
Allow: /

# You.com AI search
User-agent: YouBot
Allow: /

# Brave — Brave Search / Brave Leo AI
User-agent: BraveBot
Allow: /

# DuckDuckGo — DuckAssist AI answers
User-agent: DuckAssistBot
Allow: /

# Cloudflare internal rendering
User-agent: CloudflareBrowserRenderingCrawler
Allow: /

# ── Pure AI training scrapers — BLOCKED ──────────────────────────────────────
# These provide zero discovery or search benefit — they exist only to harvest
# content for training datasets. Strictly disallowed.

# Common Crawl — feeds most open-source training corpora
User-agent: CCBot
Disallow: /

# ByteDance / TikTok training crawler
User-agent: Bytespider
Disallow: /

# Diffbot — commercial data extraction for training
User-agent: Diffbot
Disallow: /

# iCrawl — AI training scraper
User-agent: iCrawl
Disallow: /

# Omgili / Webz.io — media monitoring and training data
User-agent: omgili
Disallow: /

# ── Sitemaps ──────────────────────────────────────────────────────────────────
Sitemap: https://overseasnursing.com/sitemap.xml
Sitemap: https://overseasnursing.com/sitemaps/agencies
Sitemap: https://overseasnursing.com/sitemaps/countries
Sitemap: https://overseasnursing.com/sitemaps/pricing
Sitemap: https://overseasnursing.com/sitemaps/scam-reports
Sitemap: https://overseasnursing.com/sitemaps/locations
Sitemap: https://overseasnursing.com/sitemaps/comparisons
Sitemap: https://overseasnursing.com/sitemaps/salaries
Sitemap: https://overseasnursing.com/sitemaps/exams
`

export function GET() {
  return new Response(ROBOTS, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  })
}
