import { NextResponse } from 'next/server'

// ═══════════════════════════════════════════════
// API: POST /api/auth/logout — Выход из админки
// ═══════════════════════════════════════════════

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_auth')
  return response
}
