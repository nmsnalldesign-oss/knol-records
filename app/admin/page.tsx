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
  const [activeTab, setActiveTab] = useState<'tracks' | 'settings'>('tracks')
  const [tracks, setTracks] = useState<Track[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
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

  const fetchTracks = async () => {
    try {
      const res = await fetch('/api/tracks?t=' + Date.now())
      const data = await res.json()
      setTracks(Array.isArray(data) ? data : [])
    } catch (e) { console.error('Fetch tracks error:', e) }
    setLoading(false)
  }

  const fetchSettings = async () => {
    setSettingsLoading(true)
    try {
      const { data, error } = await supabase.from('site_settings').select('*')
      if (data) {
        const s: any = {}
        data.forEach(item => { s[item.key] = item.value })
        setSettings(s)
      }
    } catch (e) { console.error('Fetch settings error:', e) }
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
    setUploadProgress(1)

    const formData = new FormData(e.currentTarget)
    const audioFile = formData.get('audio') as File | null
    const coverFile = formData.get('cover') as File | null
    const trackId = editingTrack ? editingTrack.id : crypto.randomUUID()

    try {
      let finalAudioUrl = editingTrack?.audioUrl || ''
      let finalCoverUrl = editingTrack?.coverUrl || ''

      // 1. Прямая загрузка АУДИО в Supabase
      if (audioFile && audioFile.size > 0) {
        setUploadProgress(10)
        const ext = audioFile.name.split('.').pop()
        const path = `audio/${trackId}-${Date.now()}.${ext}`
        
        const { error: uploadError } = await supabase.storage.from('media').upload(path, audioFile)
        if (uploadError) throw new Error('Ошибка загрузки аудио: ' + uploadError.message)
        
        setUploadProgress(60)
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
        finalAudioUrl = publicUrl
      }

      // 2. Прямая загрузка ОБЛОЖКИ в Supabase
      if (coverFile && coverFile.size > 0) {
        setUploadProgress(70)
        const ext = coverFile.name.split('.').pop()
        const path = `covers/${trackId}-${Date.now()}.${ext}`
        
        const { error: uploadError } = await supabase.storage.from('media').upload(path, coverFile)
        if (uploadError) throw new Error('Ошибка загрузки обложки: ' + uploadError.message)
        
        setUploadProgress(90)
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
        finalCoverUrl = publicUrl
      }

      // 3. Отправляем метаданные
      setUploadProgress(95)
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

      setUploadProgress(100)
      setTimeout(() => {
        resetForm()
        fetchTracks()
        setSubmitting(false)
      }, 500)
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err))
      setSubmitting(false)
      setUploadProgress(0)
    }
  }

  const handleSaveSettings = async (key: string, value: any) => {
    setSettingsLoading(true)
    try {
      const { error } = await supabase.from('site_settings').upsert({ key, value, updated_at: new Date() })
      if (error) throw error
      alert('Настройки сохранены!')
      await fetchSettings()
    } catch (e: any) {
      alert('Ошибка: ' + e.message)
    }
    setSettingsLoading(false)
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
            <p className="text-cyan-400 font-bold text-sm mt-2 tracking-widest uppercase opacity-80">Управление контентом сайта</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => setActiveTab('tracks')} className={`px-5 py-2 rounded-xl font-bold transition-all ${activeTab === 'tracks' ? 'bg-cyan-400 text-black' : 'text-white/40 hover:text-white'}`}>Треки</button>
             <button onClick={() => setActiveTab('settings')} className={`px-5 py-2 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-cyan-400 text-black' : 'text-white/40 hover:text-white'}`}>Сайт</button>
             <button onClick={handleLogout} className="px-5 py-2 rounded-xl font-bold border border-red-500/30 text-red-500 hover:bg-red-500/10">Выйти</button>
          </div>
        </div>

        {activeTab === 'tracks' ? (
          <>
            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={() => { setShowForm(!showForm); if(showForm) resetForm(); }}
                className="bg-cyan-400 hover:bg-cyan-300 transition-all text-black font-bold py-3 px-10 rounded-2xl shadow-lg shadow-cyan-400/20"
              >
                {showForm ? '✕ Отмена' : '+ Загрузить трек'}
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <form ref={formRef} onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-3xl p-8 rounded-[32px] border border-cyan-400/20 mb-10 space-y-6 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">{editingTrack ? 'Редактировать трек' : 'Новая песня'}</h3>

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
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Описание (для карточки)</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-cyan-400/50 transition-all outline-none min-h-[100px]" />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Цена (₽)</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-cyan-400/50 transition-all outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Скидка (%)</label>
                    <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-cyan-400/50 transition-all outline-none" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex justify-between">
                      <span>MP3 Файл</span>
                      {uploadProgress > 0 && uploadProgress < 100 && <span className="text-cyan-400 animate-pulse">Загрузка... {uploadProgress}%</span>}
                    </label>
                    <input type="file" name="audio" accept=".mp3" required={!editingTrack} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-cyan-400 file:text-black cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Обложка</label>
                    <input type="file" name="cover" accept="image/*" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-white/20 file:text-white cursor-pointer" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={submitting} className="flex-1 bg-cyan-400 disabled:bg-cyan-900 disabled:text-white/30 text-black py-4 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-cyan-400/10">
                    {submitting ? `ЗАГРУЗКА (${uploadProgress}%)` : editingTrack ? 'СОХРАНИТЬ ИЗМЕНЕНИЯ' : 'ОПУБЛИКОВАТЬ ТРЕК'}
                  </button>
                  <button type="button" onClick={resetForm} className="px-8 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all">ОТМЕНА</button>
                </div>
              </form>
            )}

            {/* List */}
            <div className="grid gap-4">
              {loading ? <div className="text-center py-20 text-white/20 font-bold tracking-widest animate-pulse">ЗАГРУЗКА КАТАЛОГА...</div> : tracks.map(track => (
                <div key={track.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center justify-between group hover:border-cyan-400/30 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 overflow-hidden shrink-0">
                      {track.coverUrl ? <img src={track.coverUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center opacity-20">🎵</div>}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg leading-tight">{track.title}</h4>
                      <div className="text-white/30 text-xs font-bold uppercase tracking-widest mt-1"> Категория: {track.category} • Цена: {track.price}₽</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => startEdit(track)} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-400/30 transition-all">✎</button>
                    <button onClick={() => handleDelete(track.id)} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 hover:border-red-500/30 transition-all">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {settingsLoading ? <div className="text-white/20 font-bold text-center py-20">ЗАГРУЗКА НАСТРОЕК...</div> : settings && (
              <>
                {/* Hero Banners */}
                <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
                   <h3 className="text-xl font-bold text-white mb-6">Баннеры на главной (Слайдер)</h3>
                   <div className="space-y-10">
                     {settings.hero_banners?.map((banner: any, idx: number) => (
                       <div key={banner.id} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                         <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                            <span className="text-cyan-400 font-black text-xs uppercase tracking-widest">Слайд #{idx+1}</span>
                         </div>
                         <div className="grid gap-4">
                           <input type="text" value={banner.title} onChange={e => {
                             const newBanners = [...settings.hero_banners];
                             newBanners[idx].title = e.target.value;
                             setSettings({...settings, hero_banners: newBanners});
                           }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold" placeholder="Заголовок (используйте \n для переноса)" />
                           <textarea value={banner.text} onChange={e => {
                             const newBanners = [...settings.hero_banners];
                             newBanners[idx].text = e.target.value;
                             setSettings({...settings, hero_banners: newBanners});
                           }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white/60 text-sm" placeholder="Подзаголовок" />
                         </div>
                       </div>
                     ))}
                   </div>
                   <button onClick={() => handleSaveSettings('hero_banners', settings.hero_banners)} className="mt-8 bg-cyan-400 text-black font-black px-10 py-4 rounded-2xl w-full uppercase tracking-tighter hover:bg-cyan-300">Сохранить все баннеры</button>
                </div>

                {/* About Section */}
                <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
                   <h3 className="text-xl font-bold text-white mb-6">Блок «О себе»</h3>
                   <div className="grid gap-6">
                      <div className="space-y-2">
                         <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Заголовок</label>
                         <input type="text" value={settings.about_section?.title} onChange={e => setSettings({...settings, about_section: {...settings.about_section, title: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Первый абзац</label>
                         <textarea value={settings.about_section?.text1} onChange={e => setSettings({...settings, about_section: {...settings.about_section, text1: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white/70 min-h-[100px]" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Второй абзац</label>
                         <textarea value={settings.about_section?.text2} onChange={e => setSettings({...settings, about_section: {...settings.about_section, text2: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white/70 min-h-[100px]" />
                      </div>
                   </div>
                   <button onClick={() => handleSaveSettings('about_section', settings.about_section)} className="mt-8 bg-cyan-400 text-black font-black px-10 py-4 rounded-2xl w-full uppercase tracking-tighter hover:bg-cyan-300">Сохранить раздел «О себе»</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
 
