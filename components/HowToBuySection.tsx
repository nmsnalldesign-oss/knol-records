'use client'

export default function HowToBuySection() {
  const steps = [
    {
      num: '01',
      title: 'Выбор трека',
      desc: 'Послушайте демоверсии в каталоге или закажите песню под ключ, предоставив референсы.'
    },
    {
      num: '02',
      title: 'Обсуждение',
      desc: 'Нажмите «Связаться» и напишите нам ВКонтакте для подтверждения деталей.'
    },
    {
      num: '03',
      title: 'Договор и оплата',
      desc: 'Заключаем документ об отчуждении исключительных авторских прав, после чего вы производите оплату.'
    },
    {
      num: '04',
      title: 'Получение материала',
      desc: 'Получаете WAV файлы, мультитреки (если нужно) и подписанные бумаги. Ваш хит готов к релизу!'
    }
  ]

  return (
    <section id="how-to-buy" className="relative py-24 px-5 sm:px-8 bg-[#0B0C10]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 text-[10px] font-bold tracking-wider uppercase mb-5 shadow-sm">
            ПРОЗРАЧНЫЙ ПРОЦЕСС
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-white mb-6 tracking-tight">
            Как происходит покупка
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto font-medium">
            Всего 4 простых шага отделяют вас от получения полностью готового трека с эксклюзивными исключительными правами.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="glass-panel p-8 rounded-3xl border-t border-white/10 hover:-translate-y-2 transition-transform duration-300 group flex flex-col bg-white/5"
            >
              <div className="text-5xl font-display font-bold text-white/5 mb-6 group-hover:text-cyan-400/20 transition-colors">
                {step.num}
              </div>
              <h3 className="text-xl text-white font-bold mb-4 font-display">
                {step.title}
              </h3>
              <p className="text-[#888] font-medium leading-relaxed group-hover:text-[#A3A3A3] transition-colors">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
