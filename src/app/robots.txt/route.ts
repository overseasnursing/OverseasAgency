/**
 * /robots.txt — served as a raw route handler so we can include
 * Content-Signal directives and per-bot rules that the Next.js
 * MetadataRoute.Robots type cannot express.
 */

export const dynamic = 'force-static'

const ROBOTS = `# As a condition of accessing this website, you agree to abide by the following
# content signals:

# (a)  If a Content-Signal = yes, you may collect content for the corresponding
#      use.
# (b)  If a Content-Signal = no, you may not collect content for the
#      corresponding use.
# (c)  If the website operator does not include a Content-Signal for a
#      corresponding use, the website operator neither grants nor restricts
#      permission via Content-Signal with respect to the corresponding use.

# The content signals and their meanings are:

# search:   building a search index and providing search results (e.g., returning
#           hyperlinks and short excerpts from your website's contents). Search does not
#           include providing AI-generated search summaries.
# ai-input: inputting content into one or more AI models (e.g., retrieval
#           augmented generation, grounding, or other real-time taking of content for
#           generative AI search answers).
# ai-train: training or fine-tuning AI models.

# ANY RESTRICTIONS EXPRESSED VIA CONTENT SIGNALS ARE EXPRESS RESERVATIONS OF
# RIGHTS UNDER ARTICLE 4 OF THE EUROPEAN UNION DIRECTIVE 2019/790 ON COPYRIGHT
# AND RELATED RIGHTS IN THE DIGITAL SINGLE MARKET.

# BEGIN Cloudflare Managed content

User-agent: *
Content-Signal: search=yes,ai-input=yes,ai-train=no
Allow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CloudflareBrowserRenderingCrawler
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: meta-externalagent
Disallow: /

# END Cloudflare Managed Content

User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /mock-tests/*/attempt*
Disallow: /mock-tests/*/study*

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
