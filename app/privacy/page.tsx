import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — СонграйтерКноль',
  description: 'Политика конфиденциальности и обработки персональных данных.',
}

// ═══════════════════════════════════════════════
// Политика конфиденциальности — Страница-заглушка
// TODO: Заполнить реальным текстом перед релизом
// ═══════════════════════════════════════════════

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          На главную
        </a>

        <div className="glass-strong p-8 sm:p-12 rounded-3xl">
          <h1 className="text-3xl font-display font-bold text-white mb-8">
            Конфиденциальность
          </h1>

          <div className="prose prose-invert prose-sm max-w-none text-white/60 space-y-6">
            <p className="text-lg">
              Сайт является витриной. Мы не собираем и не обрабатываем персональные данные пользователей.
            </p>
            <p>
              Для связи, обсуждения заказов или любых вопросов используйте ссылки на социальные сети (ВКонтакте) или другие способы связи, указанные на главной странице.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
