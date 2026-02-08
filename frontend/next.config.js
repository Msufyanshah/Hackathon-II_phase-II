/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ REMOVE output: 'export'
  // ❌ REMOVE trailingSlash (optional but recommended)

  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
