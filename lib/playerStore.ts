'use client'

import { create } from 'zustand'

export interface PlayerTrack {
  id: string
  title: string
  audioUrl: string
  coverUrl?: string
  category: string
}

interface PlayerState {
  currentTrack: PlayerTrack | null
  tracksList: PlayerTrack[]
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number

  setTrack: (track: PlayerTrack, list?: PlayerTrack[]) => void
  setTracksList: (list: PlayerTrack[]) => void
  play: () => void
  pause: () => void
  togglePlay: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  stop: () => void
  nextTrack: () => void
  prevTrack: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  tracksList: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,

  setTrack: (track, list) => {
    const current = get().currentTrack
    if (list) set({ tracksList: list })
    
    if (current?.id === track.id) {
      get().togglePlay()
    } else {
      set({ currentTrack: track, isPlaying: true, currentTime: 0, duration: 0 })
    }
  },

  setTracksList: (list) => set({ tracksList: list }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  stop: () => set({ isPlaying: false, currentTrack: null, currentTime: 0, duration: 0 }),

  nextTrack: () => {
    const { currentTrack, tracksList } = get()
    if (!currentTrack || tracksList.length === 0) return
    const currentIndex = tracksList.findIndex(t => t.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % tracksList.length
    const next = tracksList[nextIndex]
    set({ currentTrack: next, isPlaying: true, currentTime: 0, duration: 0 })
  },

  prevTrack: () => {
    const { currentTrack, tracksList } = get()
    if (!currentTrack || tracksList.length === 0) return
    const currentIndex = tracksList.findIndex(t => t.id === currentTrack.id)
    const prevIndex = (currentIndex - 1 + tracksList.length) % tracksList.length
    const prev = tracksList[prevIndex]
    set({ currentTrack: prev, isPlaying: true, currentTime: 0, duration: 0 })
  }
}))
