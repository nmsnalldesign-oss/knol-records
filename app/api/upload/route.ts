import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  console.log('[upload] Received upload request')
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const path = form.get('path') as string | null

    console.log('[upload] file:', file?.name, 'size:', file?.size, 'path:', path)

    if (!file || !path) {
      console.log('[upload] Missing file or path')
      return NextResponse.json({ error: 'file and path required' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('[upload] Buffer ready, uploading to Supabase...')

    await supabase.storage.from('media').remove([path])

    const { error } = await supabase.storage
      .from('media')
      .upload(path, buffer, { contentType: file.type, upsert: true })

    if (error) {
      console.error('[upload] Supabase error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
    console.log('[upload] Success, publicUrl:', publicUrl)
    return NextResponse.json({ publicUrl })
  } catch (e: any) {
    console.error('[upload] Exception:', e.message, e.stack)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// Тест - GET запрос проверяет связь с Supabase
export async function GET() {
  try {
    const url = process.env.SUPABASE_URL || 'NOT SET'
    const key = process.env.SUPABASE_SERVICE_KEY ? 'SET (' + process.env.SUPABASE_SERVICE_KEY.substring(0, 10) + '...)' : 'NOT SET'
    
    const { data, error } = await supabase.storage.from('media').list('', { limit: 1 })
    
    return NextResponse.json({
      supabase_url: url,
      service_key: key,
      storage_ok: !error,
      storage_error: error?.message || null,
      files_count: data?.length || 0,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
