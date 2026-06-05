/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
  async rewrites() {
    return {
      // beforeFiles runs before filesystem + page routes, so this overrides app/page.tsx
      beforeFiles: [
        {
          source: '/',
          destination: '/landing.html',
        },
      ],
    };
  },
};

module.exports = nextConfig;
