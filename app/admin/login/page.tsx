'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      })

      if (res.ok) {
        router.push('/admin')
      } else {
        setError('Неверный логин или пароль')
      }
    } catch {
      setError('Ошибка подключения')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="w-full max-w-sm relative z-10">
        <div className="glass-panel p-8 md:p-10 text-center">
          <h1 className="font-display text-3xl text-white mb-2 font-bold text-glow">Вход</h1>
          <p className="text-white/50 text-sm mb-8 font-medium">Панель управления каталогом</p>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Логин</label>
              <input
                type="text"
                value={login}
                onChange={e => setLogin(e.target.value)}
                className="form-input"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="text-[#FF4A4A] text-sm bg-[#FF4A4A]/10 border border-[#FF4A4A]/20 rounded-xl px-5 py-3 font-semibold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-main w-full justify-center mt-4 disabled:opacity-50 text-[14px] py-4"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
