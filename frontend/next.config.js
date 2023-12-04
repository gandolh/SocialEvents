/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'gravatar.com',
            pathname: '/avatar/**',
          }
        ]
      },
      async redirects() {
        return [
          {
            source: '/',
            destination: '/calendar/year',
            permanent: true,
          },
        ];
      }
}

module.exports = nextConfig
