/** @type {import('next').NextConfig} */
const nextConfig = {
  // Разрешаем серверные действия
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
