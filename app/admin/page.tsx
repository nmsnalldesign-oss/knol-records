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
  const [activeTab, setActiveTab] = useState<'tracks' | 'settings'>('tracks')
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

  // Site Settings States
  const [settings, setSettings] = useState<any>(null)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)

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

  const fetchSettings = async () => {
    setSettingsLoading(true)
    try {
      const res = await fetch('/api/settings?t=' + Date.now())
      if (!res.ok) throw new Error('Failed to fetch settings')
      const data = await res.json()
      if (Array.isArray(data)) {
        const s: any = {}
        data.forEach((item: any) => { s[item.key] = item.value })
        setSettings(s)
      }
    } catch (e) {
      console.error('Fetch settings error:', e)
    }
    setSettingsLoading(false)
  }

  useEffect(() => {
    fetchTracks()
    fetchSettings()
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

  // Загрузка файла через наш сервер (service key обходит все ограничения)
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
    const trackId = editingTrack ? editingTrack.id : crypto.randomUUID()

    try {
      let finalAudioUrl = editingTrack?.audioUrl || ''
      let finalCoverUrl = editingTrack?.coverUrl || ''

      // 1. Загрузка аудио через сервер
      if (audioFile && audioFile.size > 0) {
        setUploadStatus('Загружаем MP3...')
        const ext = audioFile.name.split('.').pop()
        const path = `audio/${trackId}-${Date.now()}.${ext}`
        finalAudioUrl = await uploadFile(audioFile, path, (p) => setUploadProgress(p))
        setUploadProgress(60)
      }

      // 2. Загрузка обложки через сервер
      if (coverFile && coverFile.size > 0) {
        setUploadStatus('Загружаем обложку...')
        const ext = coverFile.name.split('.').pop()
        const path = `covers/${trackId}-${Date.now()}.${ext}`
        finalCoverUrl = await uploadFile(coverFile, path, (p) => setUploadProgress(60 + p / 4))
        setUploadProgress(85)
      }

      // 3. Сохраняем метаданные
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

  const handleSaveSettings = async (key: string, value: any) => {
    setSettingsSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Ошибка сохранения')
      }
      alert('Настройки сохранены! ✓')
      await fetchSettings()
    } catch (e: any) {
      alert('Ошибка: ' + e.message)
    }
    setSettingsSaving(false)
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
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border border-white/10 shadow-xl">
          <div>
            <h1 className="font-display text-4xl text-white font-bold tracking-tight">Панель управления</h1>
            <p className="text-cyan-400 font-bold text-sm mt-2 tracking-widest uppercase opacity-80">Knol Records — Управление контентом</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'tracks' ? 'bg-cyan-400 text-black' : 'text-white/40 hover:text-white border border-white/10'}`}
            >
              🎵 Треки
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-cyan-400 text-black' : 'text-white/40 hover:text-white border border-white/10'}`}
            >
              ⚙️ Сайт
            </button>
            <button onClick={handleLogout} className="px-6 py-2.5 rounded-xl font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
              Выйти
            </button>
          </div>
        </div>

        {/* === ТРЕКИ === */}
        {activeTab === 'tracks' && (
          <>
            <div className="flex gap-3 mb-8">
              <button
                onClick={() => { if (showForm) { resetForm() } else { resetForm(); setShowForm(true) } }}
                className="bg-cyan-400 hover:bg-cyan-300 transition-all text-black font-bold py-3 px-10 rounded-2xl shadow-lg shadow-cyan-400/20"
              >
                {showForm ? '✕ Отмена' : '+ Загрузить трек'}
              </button>
            </div>

            {showForm && (
              <form ref={formRef} onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-cyan-400/20 mb-10 space-y-6 shadow-2xl">
                <h3 className="text-2xl font-bold text-white">{editingTrack ? 'Редактировать трек' : 'Новый трек'}</h3>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Название</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-cyan-400/50 transition-all outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Категория</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-cyan-400/50 transition-all outline-none cursor-pointer">
                      <option value="children">Детская</option>
                      <option value="male">Мужская</option>
                      <option value="female">Женская</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Описание</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-cyan-400/50 transition-all outline-none min-h-[100px]" />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Цена (₽)</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-cyan-400/50 transition-all outline-none" required min="0" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Скидка (%)</label>
                    <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-cyan-400/50 transition-all outline-none" min="0" max="100" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex justify-between">
                      <span>MP3 Файл {editingTrack && <span className="text-white/20">(не обязательно)</span>}</span>
                    </label>
                    <input type="file" name="audio" accept=".mp3,audio/mpeg" required={!editingTrack}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-cyan-400 file:text-black cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Обложка {editingTrack && <span className="text-white/20">(не обязательно)</span>}</label>
                    <input type="file" name="cover" accept="image/*"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-white/20 file:text-white cursor-pointer" />
                  </div>
                </div>

                {/* Progress bar */}
                {submitting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/40">
                      <span>{uploadStatus}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-2">
                  <button type="submit" disabled={submitting}
                    className="flex-1 bg-cyan-400 disabled:bg-cyan-900 disabled:text-white/30 text-black py-4 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg">
                    {submitting ? `${uploadStatus || 'Загрузка...'} (${uploadProgress}%)` : editingTrack ? 'СОХРАНИТЬ' : 'ОПУБЛИКОВАТЬ ТРЕК'}
                  </button>
                  <button type="button" onClick={resetForm}
                    className="px-8 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all">
                    ОТМЕНА
                  </button>
                </div>
              </form>
            )}

            {/* Список треков */}
            <div className="grid gap-4">
              {loading ? (
                <div className="text-center py-20 text-white/20 font-bold tracking-widest animate-pulse">ЗАГРУЗКА...</div>
              ) : tracks.length === 0 ? (
                <div className="text-center py-20 text-white/20">Треков нет. Нажми «Загрузить трек».</div>
              ) : tracks.map(track => (
                <div key={track.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center justify-between hover:border-cyan-400/30 transition-all">
                  <div className="flex items-center gap-5 min-w-0">
                    <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 overflow-hidden shrink-0">
                      {track.coverUrl
                        ? <img src={track.coverUrl} className="w-full h-full object-cover" alt="" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">🎵</div>}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white font-bold text-base truncate">{track.title}</h4>
                      <div className="text-white/30 text-xs font-bold uppercase tracking-widest mt-1">
                        {track.category} · {formatPrice(track.price)}{track.discount > 0 ? ` (-${track.discount}%)` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <button onClick={() => startEdit(track)}
                      className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-400/30 transition-all text-lg">
                      ✎
                    </button>
                    <button onClick={() => handleDelete(track.id)}
                      className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 hover:border-red-500/30 transition-all text-lg">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* === НАСТРОЙКИ САЙТА === */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {settingsLoading ? (
              <div className="text-white/20 font-bold text-center py-20 animate-pulse">ЗАГРУЗКА НАСТРОЕК...</div>
            ) : !settings ? (
              <div className="text-white/20 text-center py-20">
                <p>Настройки не найдены.</p>
                <p className="text-sm mt-2">Убедись что таблица site_settings есть в Supabase.</p>
              </div>
            ) : (
              <>
                {/* Баннеры */}
                <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">Баннеры на главной (Слайдер)</h3>
                  <div className="space-y-6">
                    {settings.hero_banners?.map((banner: any, idx: number) => (
                      <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                        <span className="text-cyan-400 font-black text-xs uppercase tracking-widest">Слайд #{idx + 1}</span>
                        <input
                          type="text"
                          value={banner.title || ''}
                          onChange={e => {
                            const nb = [...settings.hero_banners]
                            nb[idx] = { ...nb[idx], title: e.target.value }
                            setSettings({ ...settings, hero_banners: nb })
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold mt-3"
                          placeholder="Заголовок"
                        />
                        <textarea
                          value={banner.text || ''}
                          onChange={e => {
                            const nb = [...settings.hero_banners]
                            nb[idx] = { ...nb[idx], text: e.target.value }
                            setSettings({ ...settings, hero_banners: nb })
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white/60 text-sm"
                          placeholder="Подзаголовок"
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    disabled={settingsSaving}
                    onClick={() => handleSaveSettings('hero_banners', settings.hero_banners)}
                    className="mt-8 bg-cyan-400 disabled:opacity-50 text-black font-black px-10 py-4 rounded-2xl w-full uppercase tracking-tighter hover:bg-cyan-300 transition-all"
                  >
                    {settingsSaving ? 'Сохранение...' : 'Сохранить баннеры'}
                  </button>
                </div>

                {/* О себе */}
                <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">Блок «О себе»</h3>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Заголовок</label>
                      <input
                        type="text"
                        value={settings.about_section?.title || ''}
                        onChange={e => setSettings({ ...settings, about_section: { ...settings.about_section, title: e.target.value } })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Первый абзац</label>
                      <textarea
                        value={settings.about_section?.text1 || ''}
                        onChange={e => setSettings({ ...settings, about_section: { ...settings.about_section, text1: e.target.value } })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white/70 min-h-[100px]"
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Второй абзац</label>
                      <textarea
                        value={settings.about_section?.text2 || ''}
                        onChange={e => setSettings({ ...settings, about_section: { ...settings.about_section, text2: e.target.value } })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white/70 min-h-[100px]"
                        rows={4}
                      />
                    </div>
                  </div>
                  <button
                    disabled={settingsSaving}
                    onClick={() => handleSaveSettings('about_section', settings.about_section)}
                    className="mt-8 bg-cyan-400 disabled:opacity-50 text-black font-black px-10 py-4 rounded-2xl w-full uppercase tracking-tighter hover:bg-cyan-300 transition-all"
                  >
                    {settingsSaving ? 'Сохранение...' : 'Сохранить «О себе»'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
