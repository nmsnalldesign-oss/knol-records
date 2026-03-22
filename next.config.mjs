/** @type {import('next').NextConfig} */
const nextConfig = {
  // Разрешаем серверные действия
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Пропускаем ESLint при сборке (иначе Vercel не деплоится)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
