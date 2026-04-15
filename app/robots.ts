import { MetadataRoute } from 'next'

// ═══════════════════════════════════════════════════════════════════
// ROBOTS.TXT — Управление индексацией
// 
// ⚠️ СЕЙЧАС: Индексация ЗАПРЕЩЕНА (сайт в разработке)
// ✅ ПЕРЕД РЕЛИЗОМ: Раскомментируй блок "ПРОДАКШН" и закомментируй "РАЗРАБОТКА"
// ═══════════════════════════════════════════════════════════════════

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://xn--80agahbe6afbfcd7bk9f.xn--p1ai/sitemap.xml',
  }
}
