import { NextRequest, NextResponse } from 'next/server'
import { getTrackById, updateTrack, hardDeleteTrack } from '@/lib/db'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// ═══════════════════════════════════════════════
// API: GET /api/tracks/[id]
// API: PATCH /api/tracks/[id]
// API: DELETE /api/tracks/[id]
// ═══════════════════════════════════════════════

function getPathFromUrl(url: string) {
  if (!url) return null
  const parts = url.split('/media/')
  return parts.length > 1 ? parts[1] : null
}

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
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
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
    
    try {
      const formData = await request.formData()
      if (formData.has('title')) body.title = formData.get('title')
      if (formData.has('category')) body.category = formData.get('category')
      if (formData.has('description')) body.description = formData.get('description')
      if (formData.has('price')) body.price = parseInt(formData.get('price') as string) || 0
      if (formData.has('discount')) body.discount = parseInt(formData.get('discount') as string) || 0

      const coverFile = formData.get('cover') as File | null
      const audioFile = formData.get('audio') as File | null

      // Обновление обложки в Storage
      if (coverFile && coverFile.size > 0) {
        const coverExt = coverFile.name.split('.').pop() || 'jpg'
        const coverFilePath = `covers/${params.id}-${Date.now()}.${coverExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(coverFilePath, coverFile)

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(coverFilePath)
          body.cover_url = publicUrl
        }
      }
      
      // Обновление аудио в Storage
      if (audioFile && audioFile.size > 0) {
        const audioExt = audioFile.name.split('.').pop() || 'mp3'
        const audioFilePath = `audio/${params.id}-${Date.now()}.${audioExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(audioFilePath, audioFile)

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(audioFilePath)
          body.audio_url = publicUrl
        }
      }
    } catch {
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

    // 1. Удаляем файлы из Supabase Storage
    const filesToDelete: string[] = []
    const audioPath = getPathFromUrl(track.audio_url)
    const coverPath = getPathFromUrl(track.cover_url)
    
    if (audioPath) filesToDelete.push(audioPath)
    if (coverPath) filesToDelete.push(coverPath)

    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove(filesToDelete)
      if (storageError) {
        console.warn('Storage deletion error (ignoring):', storageError)
      }
    }

    // 2. Удаляем запись из БД
    await hardDeleteTrack(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting track:', error)
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 })
  }
}
