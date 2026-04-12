import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Публичная оферта — СонграйтерКноль',
  description: 'Публичная оферта на оказание услуг по продаже авторских песен.',
}

// ═══════════════════════════════════════════════
// Публичная оферта — Страница-заглушка
// TODO: Заполнить реальным текстом перед релизом
// ═══════════════════════════════════════════════

export default function OfertaPage() {
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
          <h1 className="text-3xl font-display font-bold text-white mb-8">Публичная оферта</h1>

          <div className="prose prose-invert prose-sm max-w-none text-white/60 space-y-6">
            <p>
              <strong className="text-white/80">Дата публикации:</strong> [ДАТА]
            </p>

            <h2 className="text-lg font-semibold text-white/80 !mt-8">1. Общие положения</h2>
            <p>
              Настоящий документ является публичной офертой (далее — «Оферта») самозанятого
              лица (далее — «Исполнитель») и содержит все существенные условия
              оказания услуг по передаче исключительных (эксклюзивных) прав на
              музыкальные произведения (далее — «Услуги»).
            </p>
            <p>
              В соответствии со статьей 437 Гражданского кодекса Российской Федерации,
              данный документ является публичной офертой.
            </p>

            <h2 className="text-lg font-semibold text-white/80 !mt-8">2. Предмет оферты</h2>
            <p>
              Исполнитель обязуется передать Заказчику исключительную лицензию на
              музыкальное произведение (песню), выбранное из каталога на сайте,
              а Заказчик обязуется оплатить Услуги в размере, указанном на сайте.
            </p>

            <h2 className="text-lg font-semibold text-white/80 !mt-8">3. Условия оплаты</h2>
            <p>
              Оплата производится безналичным способом в размере 100% стоимости
              выбранного музыкального произведения до передачи файлов.
            </p>

            <h2 className="text-lg font-semibold text-white/80 !mt-8">4. Порядок оказания услуг</h2>
            <p>
              После оплаты Заказчик получает файлы музыкального произведения
              (WAV, MP3) и документ, подтверждающий передачу эксклюзивных прав.
              Произведение удаляется из публичного каталога.
            </p>

            <h2 className="text-lg font-semibold text-white/80 !mt-8">5. Контактная информация</h2>
            <p>
              Самозанятый: [ФИО]<br />
              ИНН: XXXXXXXXXXXX<br />
              Контакт: [email / VK]
            </p>

            <div className="mt-8 p-4 rounded-xl bg-brand/5 border border-brand/10">
              <p className="text-brand-light text-xs">
                ⚠️ Это текст-заглушка. Необходимо заменить на реальный текст оферты,
                соответствующий действующему законодательству РФ, перед публикацией сайта.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
