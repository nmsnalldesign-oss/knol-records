'use client'

import { useState, useEffect } from 'react'

const DEFAULT_ABOUT = {
  title: 'Больше, чем просто слова',
  text1: 'Я — Иван Кноль, профессиональный сонграйтер и автор песен. За моими плечами огромный опыт написания музыки для артистов, контент-мейкеров, брендов и театральных постановок.',
  text2: 'Каждая песня в каталоге или написанная под заказ — это продукт полного цикла. Текст, вокал, аранжировка, сведение и мастеринг. Вы получаете материал, который сразу готов к дистрибуции на любые площадки.',
}

export default function AboutSection() {
  const [about, setAbout] = useState(DEFAULT_ABOUT)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return
        const row = data.find((item: any) => item.key === 'about_section')
        if (row?.value) {
          setAbout({
            title: row.value.title || DEFAULT_ABOUT.title,
            text1: row.value.text1 || DEFAULT_ABOUT.text1,
            text2: row.value.text2 || DEFAULT_ABOUT.text2,
          })
        }
      })
      .catch(() => {})
  }, [])

  // Split title into two parts at the last space before the second word group
  const titleParts = about.title.split(/,|—|\n/)
  const titleMain = titleParts[0]?.trim() || about.title
  const titleHighlight = titleParts.slice(1).join(' ').trim()

  return (
    <section id="about" className="relative py-12 sm:py-24 px-5 sm:px-8 border-t border-white/5 bg-[#0A0C10]">
      {/* Decorative glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        {/* Left side text */}
        <div className="lg:w-1/2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 text-[10px] font-bold tracking-wider uppercase mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            О проекте
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-8 tracking-tight">
            {titleHighlight ? (
              <>
                {titleMain},<br />
                <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(0,206,203,0.5)]">
                  {titleHighlight}
                </span>
              </>
            ) : (
              about.title
            )}
          </h2>
          <div className="space-y-6 text-[#94A3B8] text-lg leading-relaxed font-medium">
            <p>{about.text1}</p>
            <p>{about.text2}</p>
          </div>
          
          <div className="mt-10 grid grid-cols-2 gap-6 sm:gap-10">
            <div>
              <div className="text-3xl font-display font-bold text-white mb-2">50+</div>
              <div className="text-sm text-cyan-400 font-bold uppercase tracking-wider">Готовых демо</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-white mb-2">100%</div>
              <div className="text-sm text-cyan-400 font-bold uppercase tracking-wider">Передача прав</div>
            </div>
          </div>
        </div>

        {/* Right side visual */}
        <div className="lg:w-1/2 w-full relative">
          <div className="aspect-square sm:aspect-video lg:aspect-[4/5] rounded-3xl overflow-hidden glass-panel flex flex-col justify-end p-8 bg-gradient-to-t from-cyan-900/20 to-transparent border-t border-white/10 relative group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity group-hover:opacity-50 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-[#0A0C10]/60 to-transparent" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Живое звучание</h3>
              <p className="text-[#A3A3A3] font-medium leading-relaxed max-w-sm">
                Большой опыт исполнения интуитивно подсказывает, что нужно вашему проекту. Я знаю, как правильно работать с живыми инструментами.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
