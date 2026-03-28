'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()
const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

export default function AdminPage() {
  const router = useRouter()
  // ... (остальные стейты без изменений)
  const [tracks, setTracks] = useState<Track[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('children')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('0')

  const fetchTracks = async () => {
    try {
      const res = await fetch('/api/tracks?t=' + Date.now())
      const data = await res.json()
      setTracks(data)
    } catch (e) { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchTracks() }, [])

  const resetForm = () => {
    setTitle('')
    setCategory('children')
    setDescription('')
    setPrice('')
    setDiscount('0')
    setEditingTrack(null)
    setShowForm(false)
    if (formRef.current) formRef.current.reset()
  }

  const startEdit = (track: Track) => {
    setTitle(track.title)
    setCategory(track.category)
    setDescription(track.description)
    setPrice(String(track.price))
    setDiscount(String(track.discount ?? 0))
    setEditingTrack(track)
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const audioFile = formData.get('audio') as File | null
    const coverFile = formData.get('cover') as File | null
    const trackId = editingTrack ? editingTrack.id : crypto.randomUUID()

    try {
      let finalAudioUrl = editingTrack?.audioUrl || ''
      let finalCoverUrl = editingTrack?.coverUrl || ''

      // 1. Прямая загрузка АУДИО в Supabase (в обход Vercel Payload Limit)
      if (audioFile && audioFile.size > 0) {
        const ext = audioFile.name.split('.').pop()
        const path = `audio/${trackId}-${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage.from('media').upload(path, audioFile)
        if (uploadError) throw new Error('Ошибка загрузки аудио: ' + uploadError.message)
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
        finalAudioUrl = publicUrl
      }

      // 2. Прямая загрузка ОБЛОЖКИ в Supabase
      if (coverFile && coverFile.size > 0) {
        const ext = coverFile.name.split('.').pop()
        const path = `covers/${trackId}-${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage.from('media').upload(path, coverFile)
        if (uploadError) throw new Error('Ошибка загрузки обложки: ' + uploadError.message)
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
        finalCoverUrl = publicUrl
      }

      // 3. Отправляем только метаданные (текст и ссылки) на наш API
      const payload = {
        title,
        category,
        description,
        price: Number(price),
        discount: Number(discount),
        audio_url: finalAudioUrl,
        cover_url: finalCoverUrl
      }

      const res = await fetch(`/api/tracks${editingTrack ? `/${editingTrack.id}` : ''}`, {
        method: editingTrack ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTrack ? payload : { ...payload, id: trackId }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Ошибка сохранения в базу')
      }

      resetForm()
      await fetchTracks()
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err))
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить трек?')) return
    const res = await fetch(`/api/tracks/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const error = await res.json()
      alert('Ошибка при удалении: ' + (error.error || res.statusText))
    }
    await fetchTracks()
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const categoryLabel: Record<string, string> = {
    children: 'Детская',
    male: 'Мужская',
    female: 'Женская',
  }

  return (
    <div className="min-h-screen bg-page py-16 px-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="glass-strong p-8 rounded-[32px] flex items-center justify-between mb-10 border border-white/10 shadow-xl">
          <div>
            <h1 className="font-display text-4xl text-white font-bold drop-shadow-md">Панель управления</h1>
            <p className="text-[#06B6D4] font-bold text-sm mt-2 tracking-widest uppercase">Админзона • Управление треками</p>
          </div>
          <button onClick={handleLogout} className="btn-outline text-sm py-2 px-5 border-[#FF4A4A]/30 text-[#FF4A4A] hover:bg-[#FF4A4A]/10 hover:border-[#FF4A4A] hover:text-[#FF4A4A] hover:shadow-[0_0_15px_rgba(255,74,74,0.3)]">
            Выйти
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => {
              if (showForm && !editingTrack) {
                resetForm()
              } else {
                resetForm()
                setShowForm(true)
              }
            }}
            className="btn-main text-sm py-3 px-8 shadow-[0_4px_20px_rgba(0,206,203,0.3)]"
          >
            {showForm && !editingTrack ? '✕ Отмена' : '+ Добавить трек'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form ref={formRef} onSubmit={handleSubmit} className="glass-panel-accent p-6 sm:p-8 mb-10 space-y-5">
            <div className="accent-bar w-20 mb-4" />
            <h3 className="font-display text-xl text-white">
              {editingTrack ? 'Редактировать трек' : 'Новый трек'}
            </h3>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Название</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Категория</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="children">Детская</option>
                  <option value="male">Мужская</option>
                  <option value="female">Женская</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-1.5">Описание</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="form-input min-h-[80px] resize-y"
                rows={3}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Цена (₽)</label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Скидка (%)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  className="form-input"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* File uploads */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-white/40 mb-1.5">MP3 файл {editingTrack && '(опционально)'}</label>
                <input
                  type="file"
                  name="audio"
                  accept="audio/mpeg,audio/mp3"
                  className="form-input text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-accent/20 file:text-accent-light file:font-medium file:text-xs file:cursor-pointer"
                  required={!editingTrack}
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Обложка {editingTrack && '(опционально)'}</label>
                <input
                  type="file"
                  name="cover"
                  accept="image/*"
                  className="form-input text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-accent/20 file:text-accent-light file:font-medium file:text-xs file:cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-main text-sm py-2.5 px-6 disabled:opacity-50"
              >
                {submitting ? 'Сохранение...' : editingTrack ? 'Сохранить изменения' : 'Добавить'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-outline text-sm py-2.5 px-6"
              >
                Отмена
              </button>
            </div>
          </form>
        )}

        {/* Track list */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-white/30 text-center py-12">Загрузка...</div>
          ) : tracks.length === 0 ? (
            <div className="text-white/25 text-center py-12">
              Треков нет. Нажмите «Добавить трек», чтобы загрузить первый.
            </div>
          ) : (
            tracks.map(track => (
              <div
                key={track.id}
                className="glass-panel flex items-center gap-4 p-4 hover:border-white/[0.1] transition-colors"
              >
                {/* Cover */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface shrink-0">
                  {track.coverUrl ? (
                    <img src={track.coverUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full bg-surface-raised flex items-center justify-center">
                      <svg className="w-6 h-6 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13" /></svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm truncate">{track.title}</div>
                  <div className="text-white/30 text-xs mt-0.5">
                    {categoryLabel[track.category] || track.category} · {formatPrice(track.price)} {track.discount > 0 ? `(-${track.discount}%)` : ''}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(track)}
                    className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-accent/15 flex items-center justify-center text-white/40 hover:text-accent-light transition-colors"
                    title="Редактировать"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(track.id)}
                    className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-red-500/15 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                    title="Удалить"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
