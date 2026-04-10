import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const path = form.get('path') as string | null

    if (!file || !path) {
      return NextResponse.json({ error: 'file and path required' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Удаляем старый файл если есть (upsert через upload не всегда работает)
    await supabase.storage.from('media').remove([path])

    const { error } = await supabase.storage
      .from('media')
      .upload(path, buffer, { contentType: file.type, upsert: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
    return NextResponse.json({ publicUrl })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
