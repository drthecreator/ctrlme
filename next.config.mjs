/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    staleTimes: { dynamic: 300, static: 300 },
  },
}

export default nextConfig
