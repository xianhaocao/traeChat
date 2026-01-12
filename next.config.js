/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowReadOnlyServerComponents: true,
    },
  },
  images: {
    domains: ['images.unsplash.com', 'ui-avatars.com'],
  },
}

export default nextConfig