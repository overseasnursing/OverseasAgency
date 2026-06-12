/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== 'production'

// Content-Security-Policy
// - script-src needs 'unsafe-inline': Next.js embeds inline JSON/hydration scripts.
// - style-src needs 'unsafe-inline': Tailwind uses inline style attributes.
// - frame-src: YouTube embeds (nocookie domain only).
// - connect-src: Supabase + analytics.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.clarity.ms https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in http://127.0.0.1:54321 https://maps.gstatic.com https://maps.googleapis.com https://flagcdn.com https://i.ytimg.com https://*.r2.dev https://*.cloudflarestorage.com https://agency.overseasnursing.com https://blog.overseasnursing.com https://mock.overseasnursing.com",
  "frame-src https://www.youtube-nocookie.com https://www.google.com https://maps.google.com",
  "connect-src 'self' https://*.supabase.co https://*.supabase.in http://127.0.0.1:54321 wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://cloudflareinsights.com",
  "font-src 'self'",
  "media-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'framer-motion',
    ],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'http',  hostname: '127.0.0.1', port: '54321', pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: '*.supabase.co',            pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: 'flagcdn.com' },
      // Cloudflare R2 — generic r2.dev fallback
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: '*.cloudflarestorage.com' },
      // Cloudflare R2 custom domains
      { protocol: 'https', hostname: 'agency.overseasnursing.com' },
      { protocol: 'https', hostname: 'blog.overseasnursing.com' },
      { protocol: 'https', hostname: 'mock.overseasnursing.com' },
    ],
  },

  headers: async () => {
    return [
      // Next.js static chunks — immutable (hashed filenames)
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Favicon (matches favicon.ico, favicon.svg, etc.)
      {
        source: '/:file(favicon\\..*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
      // All routes — security + performance
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy',            value: CSP },
          { key: 'X-Content-Type-Options',            value: 'nosniff' },
          { key: 'X-Frame-Options',                   value: 'DENY' },
          { key: 'Referrer-Policy',                   value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',                value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control',            value: 'on' },
          // Prevents cross-origin window takeover (COOP)
          { key: 'Cross-Origin-Opener-Policy',        value: 'same-origin-allow-popups' },
          // HSTS — 1 year, include subdomains, eligible for preload list
          { key: 'Strict-Transport-Security',         value: 'max-age=31536000; includeSubDomains; preload' },
          // Supabase CDN preconnect hint
          { key: 'Link',                              value: '<https://cdn.supabase.co>; rel=preconnect' },
        ],
      },
    ]
  },

  webpack: (config, { dev }) => {
    if (dev) {
      // OneDrive-backed workspaces can corrupt webpack's filesystem cache on Windows.
      // Keep the cache in memory during development to avoid missing vendor chunks.
      config.cache = {
        type: 'memory',
      }
    }

    return config
  },
}

module.exports = nextConfig
