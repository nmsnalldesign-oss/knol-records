'use client'

import { usePlayerStore } from '@/lib/playerStore'
import { formatPrice } from '@/lib/utils'

interface Track {
  id: string
  title: string
  category: string
  description: string
  price: number
  discount: number
  audioUrl: string
  coverUrl: string
}

export default function TrackCard({ track }: { track: Track }) {
  const { currentTrack, isPlaying, setTrack, togglePlay } = usePlayerStore()
  const isActive = currentTrack?.id === track.id

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isActive) {
      togglePlay()
    } else {
      setTrack(track)
    }
  }

  const categoryLabel: Record<string, string> = {
    children: 'Детская',
    male: 'Мужская',
    female: 'Женская',
  }

  const discountPercent = track.discount || 0
  const oldPrice = discountPercent > 0 ? Math.round(track.price / (1 - discountPercent / 100)) : null
  
  const vkLink = `https://vk.ru/knolrecords?text=${encodeURIComponent(`Здравствуйте! Меня интересует трек: ${track.title}`)}`

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes eqBar1 { from { height: 4px; } to { height: 16px; } }
        @keyframes eqBar2 { from { height: 8px; } to { height: 12px; } }
        @keyframes eqBar3 { from { height: 6px; } to { height: 14px; } }
      `}} />
      <div className="group flex flex-col h-full bg-white/5 backdrop-blur-xl border-t border-white/10 rounded-3xl overflow-hidden shadow-2xl w-full">
        {/* Cover */}
        <div className="relative w-full aspect-square bg-[#050505] shrink-0">
          {track.coverUrl ? (
            <img
              src={track.coverUrl}
              alt={track.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#050505]">
              <svg className="w-12 h-12 text-[#222]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              aria-label={isActive && isPlaying ? "Pause" : "Play"}
              onClick={handlePlay}
              className="w-14 h-14 rounded-full bg-cyan-400 text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isActive && isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 items-start z-10">
            <span className="px-3 py-1 rounded bg-[#050505]/80 backdrop-blur-md border border-[#333] text-[10px] uppercase font-bold tracking-widest text-[#AAA]">
              {categoryLabel[track.category] || track.category}
            </span>
          </div>
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="px-2 py-1 rounded bg-cyan-400/20 border border-cyan-400/30 text-[10px] uppercase font-bold tracking-widest text-cyan-400 shadow-[0_0_10px_rgba(0,206,203,0.2)]">
                -{discountPercent}%
              </span>
            </div>
          )}

          {/* Active indicator */}
          {isActive && isPlaying && (
            <div className="absolute bottom-3 left-3 flex gap-[3px] items-end h-4 p-1.5 rounded bg-black/80 border border-[#333]">
              <span className="w-[3px] bg-cyan-400 rounded-full animate-[eqBar1_0.45s_ease-in-out_infinite_alternate]" />
              <span className="w-[3px] bg-cyan-300 rounded-full animate-[eqBar2_0.55s_ease-in-out_infinite_alternate]" />
              <span className="w-[3px] bg-cyan-500 rounded-full animate-[eqBar3_0.5s_ease-in-out_infinite_alternate]" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6 flex flex-col flex-1 justify-between bg-transparent">
          <div className="mb-4">
            <h3 className="text-chrome font-bold text-lg truncate leading-tight group-hover:text-cyan-400 transition-colors">{track.title}</h3>
            <p className="text-[#888] text-sm mt-2 line-clamp-2 leading-relaxed">{track.description}</p>
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {oldPrice && (
                  <span className="text-[11px] text-[#555] line-through font-bold">{formatPrice(oldPrice)}</span>
                )}
                <span className="text-white font-bold tracking-wide text-[20px]">{formatPrice(track.price)}</span>
              </div>
              <a
                href={vkLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-transparent border border-cyan-400/50 text-cyan-400 font-bold hover:border-cyan-400 hover:text-white hover:bg-cyan-400/20 transition-all hover:drop-shadow-[0_0_15px_rgba(0,206,203,0.8)] focus:outline-none"
            >
                Написать
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
