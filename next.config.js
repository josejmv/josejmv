/** @type {import('next').NextConfig} */
module.exports = {
  swcMinify: true,
  reactStrictMode: true,
  i18n: { defaultLocale: 'es', locales: ['en', 'es'] },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_ADMIN: process.env.NEXT_PUBLIC_ADMIN,
    NEXT_PUBLIC_USERNAME: process.env.NEXT_PUBLIC_USERNAME,
    NEXT_PUBLIC_PASSWORD: process.env.NEXT_PUBLIC_PASSWORD,
    NEXT_PUBLIC_SECRET_REDIRECTION: process.env.NEXT_PUBLIC_SECRET_REDIRECTION
  }
}
