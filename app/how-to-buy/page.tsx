import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Как купить — СонграйтерКноль',
  description: 'Инструкция по покупке авторских песен',
}

export default function HowToBuyPage() {
  return (
    <div className="min-h-screen py-32 bg-page">
      <div className="max-w-4xl mx-auto px-5">
        <div className="glass-panel p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-cyan/20 blur-[120px] rounded-full pointer-events-none" />
          <h1 className="font-display text-4xl md:text-5xl text-white mb-8 font-bold text-glow">Как купить</h1>
          <div className="space-y-6 text-white/70 text-lg mb-8">
            <div className="glass-strong p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl text-white font-bold mb-2">1. Выбор трека</h3>
              <p>Послушайте демоверсии в нашем каталоге и выберите подходящий материал.</p>
            </div>
            <div className="glass-strong p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl text-accent font-bold mb-2">2. Обращение в ЛС</h3>
              <p>Нажмите кнопку «Обсудить покупку», чтобы связаться с нами ВКонтакте и подтвердить бронь.</p>
            </div>
            <div className="glass-strong p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl text-white font-bold mb-2">3. Договор и опла payment</h3>
              <p>Мы заключаем договор о полной передаче эксклюзивных прав, вы производите оплату.</p>
            </div>
            <div className="glass-strong p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl text-accent-cyan font-bold mb-2">4. Получение материала</h3>
              <p>Вы получаете WAV мультитрек, стемы, проектные файлы (если предусмотрено) и подписанные бумаги.</p>
            </div>
          </div>
          <a href="/" className="btn-main mt-4">На главную</a>
        </div>
      </div>
    </div>
  )
}
