import { NextRequest, NextResponse } from 'next/server'
import { getAllTracks, createTrack, type Track } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// ═══════════════════════════════════════════════
// API: GET /api/tracks — Получить все треки
// API: POST /api/tracks — Создать новый трек
// ═══════════════════════════════════════════════

export async function GET() {
  try {
    const tracks = getAllTracks().map(t => ({
      ...t,
      audioUrl: t.audio_url,
      coverUrl: t.cover_url
    }))
    return NextResponse.json(tracks)
  } catch (error) {
    console.error('Error fetching tracks:', error)
    return NextResponse.json({ error: 'Ошибка получения треков' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const authCookie = request.cookies.get('admin_auth')
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const formData = await request.formData()

    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const price = parseInt(formData.get('price') as string) || 0
    const discount = parseInt(formData.get('discount') as string) || 0
    const audioFile = formData.get('audio') as File | null
    const coverFile = formData.get('cover') as File | null

    if (!title || !category || !audioFile) {
      return NextResponse.json(
        { error: 'Обязательные поля: title, category, audio' },
        { status: 400 }
      )
    }

    // Создаём директорию для загрузок
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const trackId = uuidv4()

    // Сохраняем аудиофайл
    const audioExt = audioFile.name.split('.').pop() || 'mp3'
    const audioFileName = `${trackId}.${audioExt}`
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())
    await writeFile(path.join(uploadsDir, audioFileName), audioBuffer)
    const audioUrl = `/uploads/${audioFileName}`

    // Сохраняем обложку (если есть)
    let coverUrl = ''
    if (coverFile && coverFile.size > 0) {
      const coverExt = coverFile.name.split('.').pop() || 'jpg'
      const coverFileName = `${trackId}-cover.${coverExt}`
      const coverBuffer = Buffer.from(await coverFile.arrayBuffer())
      await writeFile(path.join(uploadsDir, coverFileName), coverBuffer)
      coverUrl = `/uploads/${coverFileName}`
    }

    // Создаём запись в БД
    const track = createTrack({
      id: trackId,
      title,
      category: category as Track['category'],
      description: description || '',
      price,
      discount,
      audio_url: audioUrl,
      cover_url: coverUrl,
    })

    return NextResponse.json({ track }, { status: 201 })
  } catch (error) {
    console.error('Error creating track:', error)
    return NextResponse.json({ error: 'Ошибка создания трека' }, { status: 500 })
  }
}
