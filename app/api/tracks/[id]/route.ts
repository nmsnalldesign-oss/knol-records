import { NextRequest, NextResponse } from 'next/server'
import { getTrackById, updateTrack, deleteTrack, hardDeleteTrack } from '@/lib/db'
import { unlink, writeFile } from 'fs/promises'
import path from 'path'

// ═══════════════════════════════════════════════
// API: GET /api/tracks/[id] — Получить трек по ID
// API: PATCH /api/tracks/[id] — Обновить трек
// API: DELETE /api/tracks/[id] — Удалить трек
// ═══════════════════════════════════════════════

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const track = await getTrackById(params.id)
    if (!track) {
      return NextResponse.json({ error: 'Трек не найден' }, { status: 404 })
    }
    return NextResponse.json({ track })
  } catch (error) {
    console.error('Error fetching track:', error)
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authCookie = request.cookies.get('admin_auth')
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    let body: any = {}
    
    // Пытаемся распарсить как FormData (с файлами)
    try {
      const formData = await request.formData()
      if (formData.has('title')) body.title = formData.get('title')
      if (formData.has('category')) body.category = formData.get('category')
      if (formData.has('description')) body.description = formData.get('description')
      if (formData.has('price')) body.price = parseInt(formData.get('price') as string) || 0
      if (formData.has('discount')) body.discount = parseInt(formData.get('discount') as string) || 0

      const coverFile = formData.get('cover') as File | null
      const audioFile = formData.get('audio') as File | null
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

      if (coverFile && coverFile.size > 0) {
        const coverExt = coverFile.name.split('.').pop() || 'jpg'
        const coverFileName = `${params.id}-cover-${Date.now()}.${coverExt}`
        const coverBuffer = Buffer.from(await coverFile.arrayBuffer())
        await writeFile(path.join(uploadsDir, coverFileName), coverBuffer)
        body.cover_url = `/uploads/${coverFileName}`
      }
      
      if (audioFile && audioFile.size > 0) {
        const audioExt = audioFile.name.split('.').pop() || 'mp3'
        const audioFileName = `${params.id}-${Date.now()}.${audioExt}`
        const audioBuffer = Buffer.from(await audioFile.arrayBuffer())
        await writeFile(path.join(uploadsDir, audioFileName), audioBuffer)
        body.audio_url = `/uploads/${audioFileName}`
      }
    } catch {
      // Иначе парсим как обычный JSON
      body = await request.json()
    }

    const track = await updateTrack(params.id, body)

    if (!track) {
      return NextResponse.json({ error: 'Трек не найден' }, { status: 404 })
    }

    return NextResponse.json({ track })
  } catch (error) {
    console.error('Error updating track:', error)
    return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authCookie = request.cookies.get('admin_auth')
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const track = await getTrackById(params.id)
    if (!track) {
      return NextResponse.json({ error: 'Трек не найден' }, { status: 404 })
    }

    // Удаляем файлы с диска
    try {
      if (track.audio_url && !track.audio_url.includes('demo')) {
        await unlink(path.join(process.cwd(), 'public', track.audio_url))
      }
      if (track.cover_url && !track.cover_url.includes('demo')) {
        await unlink(path.join(process.cwd(), 'public', track.cover_url))
      }
    } catch {
      // Файлы могли быть уже удалены
    }

    await hardDeleteTrack(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting track:', error)
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 })
  }
}
