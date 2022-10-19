const { i18n } = require('./next-i18next.config');

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['localhost']
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
