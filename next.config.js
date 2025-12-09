/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/config/profile-pic/:path*',
        destination: '/config/profile-pic/:path*',
      },
    ];
  },
}

module.exports = nextConfig

