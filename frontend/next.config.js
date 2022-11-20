const { i18n } = require('./next-i18next.config');

module.exports = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_IMAGE_DOMAIN]
  },
  async redirects() {
    return[
      {
        source: '/',
        destination: '/home',
        permanent: true
      },
      {
        source: '/settings',
        destination: '/settings/appearance',
        permanent: true
      }
    ]
  },
  i18n
}
