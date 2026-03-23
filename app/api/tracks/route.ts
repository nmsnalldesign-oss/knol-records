import { NextRequest, NextResponse } from 'next/server'
import { getAllTracks, createTrack, type Track } from '@/lib/db'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export const dynamic = 'force-dynamic'

// ═══════════════════════════════════════════════
// API: GET /api/tracks — Получить все треки
// API: POST /api/tracks — Создать новый трек (через Storage)
// ═══════════════════════════════════════════════

export async function GET() {
  try {
    const tracksData = await getAllTracks()
    // Мапим для фронтенда (если он еще использует camelCase)
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
        { error: 'Обязательные поля: Название, Категория и Аудиофайл' },
        { status: 400 }
      )
    }

    const trackId = uuidv4()

    // 1. Загружаем аудиофайл в Supabase Storage
    const audioExt = audioFile.name.split('.').pop() || 'mp3'
    const audioFilePath = `audio/${trackId}.${audioExt}`
    
    const { error: audioUploadError } = await supabase.storage
      .from('media')
      .upload(audioFilePath, audioFile)

    if (audioUploadError) {
      console.error('Audio Upload Error:', audioUploadError)
      return NextResponse.json({ error: 'Ошибка загрузки аудиофайла' }, { status: 500 })
    }

    const { data: { publicUrl: audioUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(audioFilePath)

    // 2. Загружаем обложку (если есть)
    let coverUrl = ''
    if (coverFile && coverFile.size > 0) {
      const coverExt = coverFile.name.split('.').pop() || 'jpg'
      const coverFilePath = `covers/${trackId}.${coverExt}`
      
      const { error: coverUploadError } = await supabase.storage
        .from('media')
        .upload(coverFilePath, coverFile)

      if (coverUploadError) {
        console.warn('Cover Upload Error:', coverUploadError)
        // Не фатально, можем продолжить без обложки
      } else {
        const { data: { publicUrl: cUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(coverFilePath)
        coverUrl = cUrl
      }
    }

    // 3. Создаём запись в БД
    const track = await createTrack({
      id: trackId,
      title,
      category: category as Track['category'],
      description: description || '',
      price,
      discount,
      audio_url: audioUrl,
      cover_url: coverUrl,
    })

    if (!track) {
      return NextResponse.json({ error: 'Ошибка записи в базу данных' }, { status: 500 })
    }

    return NextResponse.json({ track }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/tracks:', error)
    return NextResponse.json({ error: 'Ошибка сервера при создании трека' }, { status: 500 })
  }
}
