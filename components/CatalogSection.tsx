'use client'

import { useEffect, useState } from 'react'
import TrackCard from './TrackCard'

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

const categories = [
  { key: 'all', label: 'Все треки' },
  { key: 'children', label: 'Детские' },
  { key: 'male', label: 'Мужские' },
  { key: 'female', label: 'Женские' },
]

export default function CatalogSection() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tracks')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTracks(data)
        } else {
          setTracks([])
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered =
    activeCategory === 'all'
      ? tracks
      : tracks.filter(t => t.category === activeCategory)

  return (
    <section id="catalog" className="relative py-4 sm:py-8 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 text-[10px] font-bold tracking-wider uppercase mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Выбор треков
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
            Каталог песен
          </h2>
          <p className="text-[#888] max-w-lg text-[14px] font-medium leading-relaxed">
            Послушайте демо и нажмите &quot;Связаться&quot; для покупки.
          </p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => {
            const count =
              cat.key === 'all'
                ? tracks.length
                : tracks.filter(t => t.category === cat.key).length

            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`cat-pill ${activeCategory === cat.key ? 'selected' : ''}`}
              >
                {cat.label}
                <span className="ml-1.5 text-[12px] opacity-50">{count}</span>
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-surface animate-pulse aspect-square" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(track => (
              <TrackCard key={track.id} track={track} tracksList={filtered} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#888]">
            <div className="font-semibold text-lg text-white">Треки загружаются</div>
          </div>
        )}
      </div>
    </section>
  )
}
