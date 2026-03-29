import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      // ── Static assets: long-lived cache (Next.js hashes filenames) ──────
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // ── Public images/fonts/icons ────────────────────────────────────────
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/(.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.webp|.*\\.svg|.*\\.ico|.*\\.woff2?)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      // ── API routes: never cache ──────────────────────────────────────────
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
      // ── All pages + everything else: security headers + short revalidate ─
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Pages: allow browser to revalidate but keep short-lived
          { key: 'Cache-Control', value: 'no-cache, must-revalidate' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Root → home hub
      { source: '/', destination: '/home', permanent: false },
      // Backward compat: old /portal → new /threat-universe
      { source: '/portal', destination: '/threat-universe', permanent: true },
    ];
  },
};

export default nextConfig;
