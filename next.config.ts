import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Headers de segurança para produção
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  // Redirect raiz para portal (protegida por middleware)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/portal',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
