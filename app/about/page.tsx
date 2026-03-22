import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'О нас — СонграйтерKnol',
  description: 'Информация о СонграйтерKnol',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen py-32 bg-page">
      <div className="max-w-4xl mx-auto px-5">
        <div className="glass-panel p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
          <h1 className="font-display text-4xl md:text-5xl text-white mb-6 font-bold text-glow">О нас</h1>
          <p className="text-white/70 text-lg leading-relaxed mb-6 font-medium">
            Мы студия СонграйтерKnol. Создаем уникальные треки под ключ для артистов, контент-мейкеров и брендов. 
            Каждая песня в нашем каталоге — это полностью готовый к релизу продукт с профессиональной аранжировкой и сведенным вокалом.
          </p>
          <a href="/" className="btn-main mt-4">На главную</a>
        </div>
      </div>
    </div>
  )
}
