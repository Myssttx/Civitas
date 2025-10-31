/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Enable static export for Firebase Hosting
  images: {
    unoptimized: true, // Required for static export
  },
  experimental: {
    serverActions: false, // Disable for static export
  },
  // Disable features not compatible with static export
  // Note: API routes won't work with static export
  // Use Firebase Cloud Functions for API routes instead
};

module.exports = withNextIntl(nextConfig);

