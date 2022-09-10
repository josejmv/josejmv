/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    defaultLocale: 'es',
    locales: ['en', 'es'],
  },
}

module.exports = nextConfig
