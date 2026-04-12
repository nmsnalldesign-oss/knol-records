'use client'

import { useState, useEffect } from 'react'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[80px] flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="font-display text-2xl text-white tracking-wide font-bold drop-shadow-md">
          Сонграйтер<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(0,206,203,0.5)]">Кноль</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#catalog" className="text-sm font-bold tracking-widest uppercase text-white hover:text-cyan-400 transition-colors">
            Каталог
          </a>
          <a href="#about" className="text-sm font-bold tracking-widest uppercase text-white hover:text-cyan-400 transition-colors">
            О нас
          </a>
          <a href="#how-to-buy" className="text-sm font-bold tracking-widest uppercase text-white hover:text-cyan-400 transition-colors">
            Как купить
          </a>
          <a
            href="https://vk.ru/knolrecords"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors rounded-lg text-[13px] py-2.5 px-6 tracking-widest"
          >
            Связаться
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 bg-white/5 rounded-xl border border-white/10"
          aria-label="Menu"
        >
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 rounded ${mobileOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 rounded ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 rounded ${mobileOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-strong border-b border-white/10 px-6 pb-8 pt-4 space-y-5 shadow-2xl absolute w-full backdrop-blur-3xl">
          <a href="/#catalog" onClick={() => setMobileOpen(false)} className="block text-white/80 font-bold hover:text-white text-lg py-3 border-b border-white/10">Каталог</a>
          <a href="/about" onClick={() => setMobileOpen(false)} className="block text-white/80 font-bold hover:text-white text-lg py-3 border-b border-white/10">О нас</a>
          <a href="/how-to-buy" onClick={() => setMobileOpen(false)} className="block text-white/80 font-bold hover:text-white text-lg py-3 border-b border-white/10">Как купить</a>
          <a href="https://vk.ru/knolrecords" target="_blank" rel="noopener noreferrer" className="btn-main text-sm py-2 px-6">
            Связаться в ВК
          </a>
        </div>
      )}
    </header>
  )
}
