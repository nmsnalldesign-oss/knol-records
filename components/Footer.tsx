export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B0C10] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-10">
        
        {/* Top block */}
        <div className="glass-panel p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-white/5 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-400/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10 w-full lg:w-3/4">
            <h3 className="text-3xl sm:text-4xl text-white mb-4 font-bold tracking-tight leading-tight">
              Нужна уникальная песня?
            </h3>
            <p className="text-[#94A3B8] text-base sm:text-lg max-w-xl font-medium leading-relaxed">
              Создадим хит специально для вас. Текст, аранжировка, вокал — полное сопровождение под ключ.
            </p>
          </div>
          <a
            href="https://vk.ru/knolrecords"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-cyan-400 text-black font-bold tracking-wider uppercase transition-all shadow-[0_10px_30px_rgba(0,206,203,0.3)] hover:bg-cyan-300 hover:shadow-[0_10px_40px_rgba(0,206,203,0.5)] hover:-translate-y-1 active:scale-[0.98] text-sm shrink-0 relative z-10"
          >
            Написать в ВК
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-10 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-sm text-[#64748B] font-medium border-t border-white/10 pt-10">
          <div className="space-y-2">
            <div className="font-display text-base text-white/90 font-bold tracking-wide">СонграйтерКноль</div>
            <div className="flex items-center gap-3">
              <span>Самозанятый</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span>ИНН XXXXXXXXXXXX</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {/* Ссылки убраны по просьбе */}
          </div>

          <div className="font-bold tracking-wider opacity-60">© {new Date().getFullYear()}</div>
        </div>
      </div>
    </footer>
  )
}
