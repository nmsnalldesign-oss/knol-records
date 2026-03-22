import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ═══════════════════════════════════════════════
// Middleware — Защита маршрутов /admin
// Простая авторизация через cookies
// ═══════════════════════════════════════════════

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Защищаем все /admin маршруты, КРОМЕ /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const authCookie = request.cookies.get('admin_auth')

    if (!authCookie || authCookie.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
