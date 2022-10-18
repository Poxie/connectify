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
  }
}
