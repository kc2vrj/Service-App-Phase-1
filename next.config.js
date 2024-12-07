/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['pages', 'components', 'lib', 'utils', 'contexts']
  },
  typescript: {
    ignoreBuildErrors: false
  },
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Permissions-Policy',
            value: 'private-state-token-redemption=(), private-state-token-issuance=(), browsing-topics=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'production' 
              ? "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseapp.com https://*.googleapis.com https://cdnjs.cloudflare.com; " +
                "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
                "img-src 'self' data: https://*; " +
                "font-src 'self' data: https://cdnjs.cloudflare.com; " +
                "frame-src 'self' https://*.firebaseapp.com https://*.firebase.com; " +
                "connect-src 'self' https://*.firebase.com https://*.firebaseio.com https://*.cloudfunctions.net https://*.googleapis.com wss://*.firebaseio.com; " +
                "form-action 'self';"
              : "default-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.firebaseapp.com https://*.googleapis.com"
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;