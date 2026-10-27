import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // block on generateMetadata so notFound() there returns a real 404 status (not a streamed 200)
  htmlLimitedBots: /.*/,
  images: { formats: ['image/avif', 'image/webp'] },
  // product photo uploads go through server actions (max 1.5 MB per photo, a few per save)
  experimental: { serverActions: { bodySizeLimit: '8mb' } },
  async redirects() {
    return [
      { source: '/about/mission', destination: '/about#mission', permanent: true },
      { source: '/cooperative/:path*', destination: '/group/:path*', permanent: true },
    ];
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
export default config;
