'use client'

import { useEffect, useRef, useState } from 'react'
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
    prevTrack,
  } = usePlayerStore()

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!currentTrack) return
    const audio = audioRef.current
    if (!audio) return
    
    // Плавная смена трека
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
        onEnded={nextTrack}
      />

      <div 
        className="fixed bottom-0 left-0 right-0 z-[100] bg-black/60 backdrop-blur-[24px] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom duration-700"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Progress System */}
        <div className="absolute top-0 left-0 right-0 h-1.5 group cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-white/5 sm:bg-transparent" />
          <div 
            className="absolute inset-y-0 left-0 bg-cyan-400 shadow-[0_0_15px_#22d3ee] transition-all duration-150 ease-out z-20"
            style={{ width: `${progressPct}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
          />
          {/* Hover highlight */}
          <div className="absolute inset-x-0 bottom-0 top-0 bg-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between gap-6">
          
          {/* LEFT: Info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#111] border border-white/10 overflow-hidden shrink-0 shadow-2xl group flex items-center justify-center relative">
              {currentTrack.coverUrl ? (
                <img src={currentTrack.coverUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="" />
              ) : (
                <div className="text-xl">🎵</div>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-white font-black text-sm sm:text-lg truncate tracking-tight uppercase">{currentTrack.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] sm:text-xs font-black text-cyan-400 uppercase tracking-widest">{currentTrack.category}</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-[10px] sm:text-xs text-white/30 font-mono font-bold">{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* CENTER: Main Controls */}
          <div className="flex items-center gap-2 sm:gap-10">
            <button 
              onClick={prevTrack} 
              className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-white hover:scale-110 active:scale-95 transition-all outline-none"
              title="Назад"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6l-8.5 6z"/></svg>
            </button>

            <button 
              onClick={togglePlay} 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-black hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-2xl shadow-white/10 outline-none"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>
              ) : (
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>

            <button 
              onClick={nextTrack} 
              className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-white hover:scale-110 active:scale-95 transition-all outline-none"
              title="Вперед"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18h2V6H6zm3.5-6l8.5-6v12l-8.5-6z"/></svg>
            </button>
          </div>

          {/* RIGHT: Volume & Exit */}
          <div className="hidden md:flex items-center gap-6 justify-end flex-1">
            <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-full border border-white/10">
              <svg className="w-4 h-4 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1 accent-cyan-400 cursor-pointer appearance-none bg-white/10 rounded-full"
              />
            </div>
            
            <button 
              onClick={stop} 
              className="w-10 h-10 flex items-center justify-center text-white/10 hover:text-rose-500 transition-colors"
              title="Закрыть плеер"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
