import { NextRequest, NextResponse } from 'next/server'
import { getTrackById, updateTrack, hardDeleteTrack } from '@/lib/db'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

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
    if (!track) return NextResponse.json({ error: 'Трек не найден' }, { status: 404 })
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

    const body = await request.json()
    // В новой архитектуре файлы уже загружены фронтендом в Storage, 
    // поэтому PATCH просто обновляет ссылки в БД.
    
    const { data: track, error: dbError } = await updateTrack(params.id, body)
    if (dbError) {
      console.error('Error in Supabase PATCH:', dbError)
      return NextResponse.json({ 
        error: 'Ошибка обновления в базе данных: ' + dbError.message,
        details: dbError
      }, { status: 500 })
    }
    if (!track) return NextResponse.json({ error: 'Трек не найден' }, { status: 404 })

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
    if (!track) return NextResponse.json({ error: 'Трек не найден' }, { status: 404 })

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
      if (storageError) console.warn('Storage deletion error:', storageError)
    }

    // 2. Удаляем запись из БД
    await hardDeleteTrack(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting track:', error)
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 })
  }
}
