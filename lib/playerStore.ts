'use client'

import { create } from 'zustand'

// ═══════════════════════════════════════════════
// Zustand Store — Глобальный плеер
// ═══════════════════════════════════════════════

export interface PlayerTrack {
  id: string
  title: string
  audioUrl: string
  coverUrl?: string
  category: string
}

interface PlayerState {
  // Текущий трек
  currentTrack: PlayerTrack | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number

  // Действия
  setTrack: (track: PlayerTrack) => void
  play: () => void
  pause: () => void
  togglePlay: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  stop: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,

  setTrack: (track) => {
    const current = get().currentTrack
    if (current?.id === track.id) {
      // Тот же трек — просто переключаем play/pause
      get().togglePlay()
    } else {
      set({ currentTrack: track, isPlaying: true, currentTime: 0, duration: 0 })
    }
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  stop: () => set({ isPlaying: false, currentTrack: null, currentTime: 0, duration: 0 }),
}))
