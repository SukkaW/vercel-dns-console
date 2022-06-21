/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    browsersListForSwc: true,
    legacyBrowsers: false
  }
}

module.exports = nextConfig
