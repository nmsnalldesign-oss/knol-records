import { NextRequest, NextResponse } from 'next/server'
import { getAllTracks, createTrack, type Track } from '@/lib/db'

export const dynamic = 'force-dynamic'

// ═══════════════════════════════════════════════
// API: GET /api/tracks — Получить все треки
// API: POST /api/tracks — Создать новый трек (Метаданные)
// ═══════════════════════════════════════════════

export async function GET() {
  try {
    const tracksData = await getAllTracks()
    const tracks = tracksData.map(t => ({
      ...t,
      audioUrl: t.audio_url,
      coverUrl: t.cover_url
    }))
    return NextResponse.json(tracks)
  } catch (error) {
    console.error('API Error (GET):', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const authCookie = request.cookies.get('admin_auth')
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, category, description, price, discount, audio_url, cover_url } = body

    if (!title || !category || !audio_url) {
      return NextResponse.json(
        { error: 'Обязательные поля: Название, Категория и Ссылка на аудио' },
        { status: 400 }
      )
    }

    // Создаём запись в БД (файлы уже загружены через фронтенд напрямую в Storage)
    const { data: track, error: dbError } = await createTrack({
      id: id || crypto.randomUUID(),
      title,
      category: category as Track['category'],
      description: description || '',
      price: Number(price) || 0,
      discount: Number(discount) || 0,
      audio_url,
      cover_url: cover_url || '',
    })

    if (dbError) {
      console.error('Error in Supabase POST:', dbError)
      return NextResponse.json({ 
        error: 'Ошибка записи в базу данных: ' + dbError.message,
        details: dbError
      }, { status: 500 })
    }

    return NextResponse.json({ track }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/tracks:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
