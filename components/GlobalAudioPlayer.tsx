'use client'

import { useEffect, useRef } from 'react'
import { usePlayerStore } from '@/lib/playerStore'
import { formatTime } from '@/lib/utils'

export default function GlobalAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    stop,
    setCurrentTime,
    setDuration,
    setVolume,
    nextTrack,
    prevTrack
  } = usePlayerStore()

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!currentTrack) return
    const audio = audioRef.current
    if (!audio) return
    
    // Предотвращаем мерцание если src тот же
    if (audio.src !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl
      audio.load()
    }
    audio.volume = volume
    if (isPlaying) {
      audio.play().catch(() => {})
    }
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = volume
  }, [volume])

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (audio) setCurrentTime(audio.currentTime)
  }

  const handleLoadedMetadata = () => {
    const audio = audioRef.current
    if (audio) setDuration(audio.duration)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const time = parseFloat(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
  }

  if (!currentTrack) return null

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack} // Автоматически следующая
      />

      <div className="player-bar fixed bottom-0 left-0 right-0 z-[100] bg-[#0A0C10]/80 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom duration-500">
        
        {/* Progress Slider (Верхняя грань) */}
        <div className="absolute top-0 left-0 right-0 h-1 group cursor-pointer">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="absolute inset-0 bg-white/5" />
          <div 
            className="absolute inset-y-0 left-0 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-100" 
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          
          {/* Left: Track info */}
          <div className="flex items-center gap-4 min-w-0 flex-1 md:flex-initial">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10 shadow-lg">
              {currentTrack.coverUrl ? (
                <img src={currentTrack.coverUrl} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13" /></svg>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-[15px] text-white font-bold truncate tracking-tight">{currentTrack.title}</div>
              <div className="text-[12px] text-white/40 font-medium font-mono">
                {formatTime(currentTime)} <span className="mx-1 text-white/20">/</span> {formatTime(duration)}
              </div>
            </div>
          </div>

          {/* Center: Main Controls */}
          <div className="flex items-center gap-2 sm:gap-6">
            <button 
              onClick={prevTrack}
              className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors group"
              title="Назад"
            >
              <svg className="w-5 h-5 group-active:scale-90 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            <button 
              onClick={togglePlay} 
              className="w-12 h-12 rounded-full bg-white text-black hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-xl shadow-white/10"
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              ) : (
                <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>

            <button 
              onClick={nextTrack}
              className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors group"
              title="Вперед"
            >
              <svg className="w-5 h-5 group-active:scale-90 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18h2V6H6zm3.5-6l8.5-6v12z"/>
              </svg>
            </button>
          </div>

          {/* Right: Volume (Desktop) */}
          <div className="hidden md:flex items-center gap-4 justify-end flex-1 md:flex-initial">
             <button onClick={stop} className="text-white/20 hover:text-red-400 transition-colors mr-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                <svg className="w-4 h-4 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={e => setVolume(parseFloat(e.target.value))}
                  className="w-24 h-1 accent-cyan-400 cursor-pointer"
                />
             </div>
          </div>
        </div>
      </div>
    </<ctrl94>
  )
}
