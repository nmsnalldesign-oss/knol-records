import { NextRequest, NextResponse } from 'next/server'

// ═══════════════════════════════════════════════
// API: POST /api/auth/login — Авторизация админа
// 
// ⚠️ Захардкоженные данные — замени перед релизом!
// Логин: ADMIN | Пароль: ADMIN
// ═══════════════════════════════════════════════

const ADMIN_LOGIN = 'ADMIN'
const ADMIN_PASSWORD = 'ADMIN'

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json()

    if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true })

      // Устанавливаем cookie авторизации
      response.cookies.set('admin_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 часа
        path: '/',
      })

      return response
    }

    return NextResponse.json(
      { error: 'Неверный логин или пароль' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Ошибка авторизации' }, { status: 500 })
  }
}
