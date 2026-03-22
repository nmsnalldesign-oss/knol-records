import { NextRequest, NextResponse } from 'next/server'
import { getAllTracks, createTrack, type Track } from '@/lib/db'

export const dynamic = 'force-dynamic'
import { v4 as uuidv4 } from 'uuid'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// ═══════════════════════════════════════════════
// API: GET /api/tracks — Получить все треки
// API: POST /api/tracks — Создать новый трек
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
    console.warn('API: Database error, providing mock data for draft:', error)
    
    // Временный список треков для черновика, если база недоступна
    const mockTracks = [
      {
        id: 'mock-1',
        title: 'Солнечный зайчик',
        category: 'children',
        description: 'Весёлая детская песня о приключениях солнечного зайчика.',
        price: 15000,
        discount: 20,
        audioUrl: '/uploads/demo/demo-track-1.mp3',
        coverUrl: ''
      },
      {
        id: 'mock-2',
        title: 'Мечты о звёздах',
        category: 'children',
        description: 'Колыбельная для малышей.',
        price: 12000,
        discount: 0,
        audioUrl: '/uploads/demo/demo-track-2.mp3',
        coverUrl: ''
      },
      {
        id: 'mock-3',
        title: 'Дорога домой',
        category: 'male',
        description: 'Глубокая баллада о возвращении домой.',
        price: 25000,
        discount: 30,
        audioUrl: '/uploads/demo/demo-track-3.mp3',
        coverUrl: ''
      }
    ]
    
    return NextResponse.json(mockTracks)
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

    // Создаём директорию для загрузок (пропускаем или игнорим ошибку на Vercel)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      if (!process.env.VERCEL) {
        await mkdir(uploadsDir, { recursive: true })
      }
    } catch (e) {
      console.warn('API: Could not create uploads directory', e)
    }

    const trackId = uuidv4()

    // Сохраняем аудиофайл
    const audioExt = audioFile.name.split('.').pop() || 'mp3'
    const audioFileName = `${trackId}.${audioExt}`
    const audioUrl = `/uploads/${audioFileName}`
    
    try {
      if (!process.env.VERCEL) {
        const audioBuffer = Buffer.from(await audioFile.arrayBuffer())
        await writeFile(path.join(uploadsDir, audioFileName), audioBuffer)
      } else {
        console.log('API: Running on Vercel, skipping disk write for audio')
      }
    } catch (e) {
      console.warn('API: File write failed (expected on Vercel)', e)
    }

    // Сохраняем обложку (если есть)
    let coverUrl = ''
    if (coverFile && coverFile.size > 0) {
      const coverExt = coverFile.name.split('.').pop() || 'jpg'
      const coverFileName = `${trackId}-cover.${coverExt}`
      coverUrl = `/uploads/${coverFileName}`
      
      try {
        if (!process.env.VERCEL) {
          const coverBuffer = Buffer.from(await coverFile.arrayBuffer())
          await writeFile(path.join(uploadsDir, coverFileName), coverBuffer)
        }
      } catch (e) {
        console.warn('API: Cover file write failed', e)
      }
    }

    // Создаём запись в БД
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

    return NextResponse.json({ track }, { status: 201 })
  } catch (error) {
    console.error('Error creating track:', error)
    return NextResponse.json({ error: 'Ошибка создания трека' }, { status: 500 })
  }
}
