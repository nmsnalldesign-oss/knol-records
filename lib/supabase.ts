import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (process.env.SUPABASE_URL || '').trim()
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_KEY || '').trim()

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase credentials missing. Check your .env file.')
}

// Используем Service Role Key для обхода RLS в админке
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
})
