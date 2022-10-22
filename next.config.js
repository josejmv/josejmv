/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  i18n: { defaultLocale: 'es', locales: ['en', 'es'] },
}

module.exports = nextConfig
