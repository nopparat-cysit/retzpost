/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'pg-boss', 'pg', 'pino'],
  },
};

export default nextConfig;
