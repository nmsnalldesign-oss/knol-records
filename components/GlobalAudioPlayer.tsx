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
  } = usePlayerStore()

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!currentTrack) return

    const audio = audioRef.current
    if (!audio) return

    audio.src = currentTrack.audioUrl
    audio.volume = volume
    audio.play().catch(() => {})
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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * duration
    setCurrentTime(audio.currentTime)
  }

  const handleStop = () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    stop()
  }

  if (!currentTrack) return null

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleStop}
      />

      <div className="player-bar fixed bottom-0 left-0 right-0 z-[100] bg-white/5 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {/* Progress */}
        <div className="progress-track" onClick={handleProgressClick}>
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Cover */}
          <div className="w-11 h-11 rounded-lg overflow-hidden bg-surface shrink-0">
            {currentTrack.coverUrl ? (
              <img src={currentTrack.coverUrl} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13" /></svg>
              </div>
            )}
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white font-medium truncate">{currentTrack.title}</div>
            <div className="text-[11px] text-white/30">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white transition-colors">
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              ) : (
                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>

            <button onClick={handleStop} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <svg className="w-[14px] h-[14px]" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
            </button>

            {/* Volume — desktop only */}
            <div className="hidden md:flex items-center gap-2">
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
                className="w-20 h-1 accent-cyan-400"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
