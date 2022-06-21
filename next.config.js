/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    browsersListForSwc: true,
    legacyBrowsers: false,
    images: {
      unoptimized: true,
    }
  }
}

module.exports = nextConfig
