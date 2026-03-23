import { supabase } from './supabase'

// ── Интерфейс трека ──
export interface Track {
  id: string
  title: string
  category: 'children' | 'male' | 'female'
  description: string
  price: number
  discount: number
  audio_url: string
  cover_url: string
  created_at: string
  updated_at?: string
  is_active: boolean
}

// ── CRUD операции через Supabase ──

export async function getAllTracks(): Promise<Track[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tracks:', error)
    return []
  }

  return data as Track[]
}

export async function getTracksByCategory(category: string): Promise<Track[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tracks by category:', error)
    return []
  }

  return data as Track[]
}

export async function getTrackById(id: string): Promise<Track | undefined> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching track by id:', error)
    return undefined
  }

  return data as Track
}

export async function createTrack(track: Omit<Track, 'created_at' | 'is_active'>): Promise<Track | null> {
  const { data, error } = await supabase
    .from('tracks')
    .insert([track])
    .select()
    .single()

  if (error) {
    console.error('Error creating track:', error)
    return null
  }

  return data as Track
}

export async function updateTrack(id: string, data: Partial<Omit<Track, 'id' | 'created_at'>>): Promise<Track | null> {
  const { data: updatedData, error } = await supabase
    .from('tracks')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating track:', error)
    return null
  }

  return updatedData as Track
}

export async function deleteTrack(id: string): Promise<void> {
  // Мягкое удаление (скрытие)
  await supabase
    .from('tracks')
    .update({ is_active: false })
    .eq('id', id)
}

export async function hardDeleteTrack(id: string): Promise<void> {
  // Полное удаление из БД
  await supabase
    .from('tracks')
    .delete()
    .eq('id', id)
}
