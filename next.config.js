/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
    streamingComponents: true,
  },
  images: {
    domains: ['images.unsplash.com', 'ui-avatars.com'],
  },
}

module.exports = nextConfig