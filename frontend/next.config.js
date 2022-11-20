const { i18n } = require('./next-i18next.config');

module.exports = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true
  },
  images: {
    domains: ['localhost', '127.0.0.1']
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
