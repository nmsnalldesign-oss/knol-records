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
            Политика конфиденциальности
          </h1>

          <div className="prose prose-invert prose-sm max-w-none text-white/60 space-y-6">
            <p>
              <strong className="text-white/80">Дата вступления в силу:</strong> [ДАТА]
            </p>

            <h2 className="text-lg font-semibold text-white/80 !mt-8">1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности регулирует порядок обработки
              и защиты персональных данных пользователей сайта сонграйтеркноль.рф
              (далее — «Сайт»).
            </p>
            <p>
              Использование Сайта означает согласие пользователя с настоящей Политикой.
            </p>

            <h2 className="text-lg font-semibold text-white/80 !mt-8">2. Какие данные мы собираем</h2>
            <p>
              При использовании Сайта могут обрабатываться следующие данные:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Имя и контактные данные (при обращении через ВК)</li>
              <li>Техническая информация (IP-адрес, тип браузера)</li>
              <li>Данные аналитики (Яндекс.Метрика)</li>
            </ul>

            <h2 className="text-lg font-semibold text-white/80 !mt-8">3. Цели обработки</h2>
            <p>
              Персональные данные обрабатываются для:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Обработки заказов и коммуникации с клиентами</li>
              <li>Улучшения работы Сайта</li>
              <li>Выполнения требований законодательства РФ</li>
            </ul>

            <h2 className="text-lg font-semibold text-white/80 !mt-8">4. Защита данных</h2>
            <p>
              Мы принимаем все необходимые организационные и технические меры
              для защиты персональных данных от неправомерного доступа.
            </p>

            <h2 className="text-lg font-semibold text-white/80 !mt-8">5. Права пользователей</h2>
            <p>
              Пользователь вправе запросить информацию об обрабатываемых данных,
              а также потребовать их удаления, обратившись к Оператору.
            </p>

            <h2 className="text-lg font-semibold text-white/80 !mt-8">6. Контактная информация</h2>
            <p>
              Оператор: [ФИО]<br />
              ИНН: XXXXXXXXXXXX<br />
              Контакт: [email / VK]
            </p>

            <div className="mt-8 p-4 rounded-xl bg-brand/5 border border-brand/10">
              <p className="text-brand-light text-xs">
                ⚠️ Это текст-заглушка. Необходимо заменить на реальный текст политики
                конфиденциальности, соответствующий ФЗ-152 «О персональных данных»,
                перед публикацией сайта.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
