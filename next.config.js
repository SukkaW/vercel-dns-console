const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  })
  : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    legacyBrowsers: false
  }
};

module.exports = withBundleAnalyzer(nextConfig);
