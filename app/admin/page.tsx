'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
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

export default function AdminPage() {
  const router = useRouter()
  const [tracks, setTracks] = useState<Track[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  // Track Form States
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('children')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('0')

  const fetchTracks = async () => {
    try {
      const res = await fetch('/api/tracks?t=' + Date.now())
      const data = await res.json()
      setTracks(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Fetch tracks error:', e)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTracks()
  }, [])

  const resetForm = () => {
    setTitle('')
    setCategory('children')
    setDescription('')
    setPrice('')
    setDiscount('0')
    setEditingTrack(null)
    setShowForm(false)
    setUploadProgress(0)
    setUploadStatus('')
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

  const uploadFile = async (file: File, path: string, onProgress: (p: number) => void): Promise<string> => {
    const form = new FormData()
    form.append('file', file)
    form.append('path', path)
    onProgress(10)
    const res = await fetch('/api/upload', { method: 'POST', body: form })
    onProgress(90)
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Ошибка загрузки файла')
    }
    const data = await res.json()
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setUploadProgress(1)
    setUploadStatus('Начинаем...')

    const formData = new FormData(e.currentTarget)
    const audioFile = formData.get('audio') as File | null
    const coverFile = formData.get('cover') as File | null
    const trackId = editingTrack ? editingTrack.id : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16) })

    try {
      let finalAudioUrl = editingTrack?.audioUrl || ''
      let finalCoverUrl = editingTrack?.coverUrl || ''

      if (audioFile && audioFile.size > 0) {
        setUploadStatus('Загружаем MP3...')
        const ext = audioFile.name.split('.').pop()
        const path = `audio/${trackId}-${Date.now()}.${ext}`
        finalAudioUrl = await uploadFile(audioFile, path, (p) => setUploadProgress(p))
        setUploadProgress(60)
      }

      if (coverFile && coverFile.size > 0) {
        setUploadStatus('Загружаем обложку...')
        const ext = coverFile.name.split('.').pop()
        const path = `covers/${trackId}-${Date.now()}.${ext}`
        finalCoverUrl = await uploadFile(coverFile, path, (p) => setUploadProgress(60 + p / 4))
        setUploadProgress(85)
      }

      setUploadStatus('Сохраняем в базу...')
      setUploadProgress(90)

      const payload = {
        title,
        category,
        description,
        price: Number(price),
        discount: Number(discount),
        audio_url: finalAudioUrl,
        cover_url: finalCoverUrl,
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

      setUploadProgress(100)
      setUploadStatus('Готово! ✓')

      setTimeout(() => {
        resetForm()
        fetchTracks()
        setSubmitting(false)
      }, 800)
    } catch (err: any) {
      alert('Ошибка: ' + (err.message || String(err)))
      setSubmitting(false)
      setUploadProgress(0)
      setUploadStatus('')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить трек?')) return
    const res = await fetch(`/api/tracks/${id}`, { method: 'DELETE' })
    if (!res.ok) alert('Ошибка при удалении')
    await fetchTracks()
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#050505] py-16 px-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[32px] flex flex-col md:items-center md:flex-row justify-between gap-6 mb-10 border border-white/10 shadow-xl">
          <div>
            <h1 className="font-display text-4xl text-white font-bold tracking-tight">Панель управления</h1>
            <p className="text-cyan-400 font-bold text-sm mt-2 tracking-widest uppercase opacity-80">Управление песнями</p>
          </div>
          <button onClick={handleLogout} className="px-8 py-3 rounded-2xl font-black border border-red-500/20 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition-all uppercase tracking-widest text-xs">
            Выйти
          </button>
        </div>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => { if (showForm) { resetForm() } else { resetForm(); setShowForm(true) } }}
            className="bg-cyan-400 hover:bg-cyan-300 transition-all text-black font-black py-4 px-12 rounded-2xl shadow-xl shadow-cyan-400/20 uppercase tracking-widest text-sm"
          >
            {showForm ? '✕ Отмена' : '+ ЗАГРУЗИТЬ НОВУЮ ПЕСНЮ'}
          </button>
        </div>

        {showForm && (
          <form ref={formRef} onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-cyan-400/20 mb-10 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">{editingTrack ? 'Редактировать трек' : 'Добавление в каталог'}</h3>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Название</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-cyan-400 transition-all outline-none font-bold" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Категория</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-cyan-400 transition-all outline-none cursor-pointer font-bold">
                  <option value="children">Детская</option>
                  <option value="male">Мужская</option>
                  <option value="female">Женская</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Описание (для карточки)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-cyan-400 transition-all outline-none min-h-[120px] font-medium" />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Стоимость (₽)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-cyan-400 transition-all outline-none font-bold" required min="0" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Скидка (%)</label>
                <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-cyan-400 transition-all outline-none font-bold" min="0" max="100" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Файл MP3</label>
                <input type="file" name="audio" accept=".mp3" required={!editingTrack} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-cyan-400 file:text-black cursor-pointer" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Картинка (Cover)</label>
                <input type="file" name="cover" accept="image/*" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-white/20 file:text-white cursor-pointer" />
              </div>
            </div>

            {submitting && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                  <span>{uploadStatus}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1">
                  <div className="bg-cyan-400 h-1 rounded-full transition-all duration-300 shadow-[0_0_10px_#22d3ee]" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={submitting} className="flex-1 bg-cyan-400 disabled:opacity-50 text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-cyan-400/10">
                {submitting ? 'ЗАГРУЗКА...' : editingTrack ? 'СОХРАНИТЬ ИЗМЕНЕНИЯ' : 'ОПУБЛИКОВАТЬ В КАТАЛОГЕ'}
              </button>
            </div>
          </form>
        )}

        {/* Список треков */}
        <div className="grid gap-5">
          {loading ? (
            <div className="text-center py-20 text-cyan-400/20 font-black tracking-[0.5em] animate-pulse uppercase">Загрузка базы...</div>
          ) : tracks.length === 0 ? (
            <div className="text-center py-20 text-white/10 font-bold">Список пуст. Добавьте первый трек!</div>
          ) : tracks.map(track => (
            <div key={track.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[32px] flex items-center justify-between hover:border-cyan-400/40 transition-all group">
              <div className="flex items-center gap-6 min-w-0">
                <div className="w-20 h-20 rounded-[24px] bg-black border border-white/10 overflow-hidden shrink-0 shadow-2xl">
                  {track.coverUrl
                    ? <img src={track.coverUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt="" />
                    : <div className="w-full h-full flex items-center justify-center text-4xl opacity-10">🎵</div>}
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-black text-xl truncate tracking-tight">{track.title}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest py-1 px-2.5 bg-cyan-400/10 rounded-lg">{track.category}</span>
                    <span className="text-white/40 text-xs font-bold">{formatPrice(track.price)}</span>
                    {track.discount > 0 && <span className="text-rose-500 text-[10px] font-black">-{track.discount}%</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <button onClick={() => startEdit(track)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-cyan-400 hover:border-cyan-400/40 transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button onClick={() => handleDelete(track.id)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-red-500 hover:border-red-500/40 transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
