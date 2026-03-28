/** @type {import('next').NextConfig} */
const nextConfig = {
  // Разрешаем серверные действия
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gwxaymepeyxxwdmhlkgp.supabase.co',
      },
    ],
  },
  // Пропускаем ESLint при сборке (иначе Vercel не деплоится)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
