'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Array of banners that later can be managed via the admin panel
const BANNERS = [
  {
    id: 1,
    title: 'Песни под ключ\nдля артистов',
    text: 'Пишу музыку, текст, делаю аранжировку, запись и сведение. Идеальное решение для поп-певцов, рэп-исполнителей, блогеров и рок-групп.',
    action: '🎧 В демо более 50 песен — возможно, одна из них станет вашей!',
    buttonText: 'Слушать каталог',
    buttonLink: '#catalog',
    bgClass: 'bg-gradient-to-br from-cyan-500/10 to-transparent',
    btnClass: 'bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:text-white hover:drop-shadow-[0_0_15px_rgba(0,206,203,0.8)]'
  },
  {
    id: 2,
    title: 'Песня в подарок\nдля самых близких',
    text: 'Неподдельные эмоции, которые останутся на всю жизнь. Уникальный подарок жене, маме, девушке или на знаменательное событие.',
    action: '🎸 Создаю треки с учетом вашей личной истории и пожеланий.',
    buttonText: 'Заказать песню',
    buttonLink: 'https://vk.ru/knolrecords',
    bgClass: 'bg-gradient-to-br from-rose-500/10 to-transparent',
    btnClass: 'bg-transparent border border-rose-400 text-rose-400 hover:bg-rose-400/20 hover:text-white hover:drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]'
  },
  {
    id: 3,
    title: 'Мощные треки\nдля вашего бизнеса',
    text: 'Пишу музыку для заведений, театров, мюзиклов. Сочиняю шедевры для конкурсов и уникальных корпоративных событий.',
    action: '🔥 Огромный опыт исполнения и интуитивное понимание рынка.',
    buttonText: 'Обсудить проект',
    buttonLink: 'https://vk.ru/knolrecords',
    bgClass: 'bg-gradient-to-br from-blue-500/10 to-transparent',
    btnClass: 'bg-transparent border border-blue-400 text-blue-400 hover:bg-blue-400/20 hover:text-white hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]'
  }
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % BANNERS.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrent(prev => (prev + 1) % BANNERS.length)
  const prevSlide = () => setCurrent(prev => (prev - 1 + BANNERS.length) % BANNERS.length)

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-12 w-full overflow-hidden">
      {/* Abstract Background Noise */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,206,203,0.02)_0%,transparent_80%)] pointer-events-none z-0" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* The Carousel Container */}
        <div className="relative w-full aspect-[3/4] sm:aspect-[16/9] lg:aspect-[2.3/1] bg-white/5 backdrop-blur-xl border-t border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.98 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute inset-0 w-full h-full flex items-center ${BANNERS[current].bgClass}`}
            >
              
              {/* Content Box */}
              <div className="p-8 sm:p-14 lg:p-20 w-full lg:w-3/4 h-full flex flex-col justify-center relative z-10">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-[64px] font-bold leading-[1.05] text-white whitespace-pre-line tracking-tight">
                  {BANNERS[current].title}
                </h1>
                
                <p className="mt-6 text-[15px] sm:text-lg text-[#A3A3A3] leading-relaxed max-w-2xl font-medium">
                  {BANNERS[current].text}
                </p>
                
                <div className="mt-5 text-[#E2E8F0] font-semibold text-sm sm:text-base drop-shadow-md">
                  {BANNERS[current].action}
                </div>
                
                <div className="mt-10 flex">
                  <a
                    href={BANNERS[current].buttonLink}
                    className={`inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold tracking-wide transition-all ${BANNERS[current].btnClass}`}
                  >
                    {BANNERS[current].buttonText}
                  </a>
                </div>
              </div>
              
              {/* Overlay styling for visual balance */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Controls - Arrows */}
          <div className="absolute right-6 bottom-6 sm:right-8 sm:bottom-8 flex gap-3 z-20">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-colors group"
            >
              <svg className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-colors group"
            >
              <svg className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Controls - Dots */}
          <div className="absolute left-8 bottom-8 flex gap-2 z-20">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  current === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
