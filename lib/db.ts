import Database from 'better-sqlite3'
import path from 'path'
import postgres from 'postgres'

// ═══════════════════════════════════════════════
// Конфигурация Баз Данных
// ═══════════════════════════════════════════════

const DB_PATH = path.join(process.cwd(), 'songwriterknol.db')
const DATABASE_URL = process.env.DATABASE_URL

// Инициализация драйверов
let sqliteDb: Database.Database | null = null
let sql: any = null // Postgres client

const isPostgres = !!DATABASE_URL

// ── Получение экземпляра БД ──
function getSqlite(): Database.Database {
  if (!sqliteDb) {
    sqliteDb = new Database(DB_PATH)
    sqliteDb.pragma('journal_mode = WAL')
    sqliteDb.pragma('foreign_keys = ON')
    initializeSqlite(sqliteDb)
  }
  return sqliteDb
}

function getPostgres() {
  if (!sql && DATABASE_URL) {
    sql = postgres(DATABASE_URL, {
      ssl: 'require',
      idle_timeout: 20,
      max_lifetime: 60 * 30
    })
    // Инициализация PostgreSQL будет происходить лениво
  }
  return sql
}

// ── Инициализация Схемы ──
function initializeSqlite(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tracks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('children', 'male', 'female')),
      description TEXT DEFAULT '',
      price INTEGER DEFAULT 0,
      discount INTEGER DEFAULT 0,
      audio_url TEXT NOT NULL,
      cover_url TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      is_active INTEGER DEFAULT 1
    );
  `)
  
  const count = db.prepare('SELECT COUNT(*) as cnt FROM tracks').get() as { cnt: number }
  if (count.cnt === 0) {
    seedDemoData(db)
  }
}

async function ensurePostgresSchema() {
  if (!isPostgres) return
  const pg = getPostgres()
  try {
    await pg`
      CREATE TABLE IF NOT EXISTS tracks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('children', 'male', 'female')),
        description TEXT DEFAULT '',
        price INTEGER DEFAULT 0,
        discount INTEGER DEFAULT 0,
        audio_url TEXT NOT NULL,
        cover_url TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        is_active INTEGER DEFAULT 1
      );
    `
    // Проверка наличия демо-данных
    const rows = await pg`SELECT count(*) FROM tracks`
    if (parseInt(rows[0].count) === 0) {
      await seedPostgresDemo(pg)
    }
  } catch (err) {
    console.error('Postgres Init Error:', err)
  }
}

// ── Демо данные ──
const demoTracks = [
  { id: 'demo-1', title: 'Солнечный зайчик', category: 'children', price: 15000, discount: 20, audio_url: '/uploads/demo/demo-track-1.mp3', cover_url: '', description: 'Детская песня' },
  { id: 'demo-2', title: 'Мечты о звёздах', category: 'children', price: 12000, discount: 0, audio_url: '/uploads/demo/demo-track-2.mp3', cover_url: '', description: 'Колыбельная' },
  { id: 'demo-3', title: 'Дорога домой', category: 'male', price: 25000, discount: 30, audio_url: '/uploads/demo/demo-track-3.mp3', cover_url: '', description: 'Баллада' }
]

function seedDemoData(db: Database.Database) {
  const insert = db.prepare(`
    INSERT INTO tracks (id, title, category, description, price, discount, audio_url, cover_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  db.transaction(() => {
    for (const t of demoTracks) {
      insert.run(t.id, t.title, t.category, t.description, t.price, t.discount, t.audio_url, t.cover_url)
    }
  })()
}

async function seedPostgresDemo(pg: any) {
  for (const t of demoTracks) {
    await pg`
      INSERT INTO tracks (id, title, category, description, price, discount, audio_url, cover_url)
      VALUES (${t.id}, ${t.title}, ${t.category}, ${t.description}, ${t.price}, ${t.discount}, ${t.audio_url}, ${t.cover_url})
    `
  }
}

// ── CRUD операции ──

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
  updated_at: string
  is_active: number
}

// ── Вспомогательные функции ──
function mapTrack(row: any): Track {
  if (!row) return row
  return {
    ...row,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at
  }
}

export async function getAllTracks(): Promise<Track[]> {
  if (isPostgres) {
    await ensurePostgresSchema()
    const pg = getPostgres()
    const rows = await pg`SELECT * FROM tracks WHERE is_active = 1 ORDER BY created_at DESC`
    return rows.map(mapTrack)
  } else {
    const db = getSqlite()
    const rows = db.prepare('SELECT * FROM tracks WHERE is_active = 1 ORDER BY created_at DESC').all() as any[]
    return rows.map(mapTrack)
  }
}

export async function getTracksByCategory(category: string): Promise<Track[]> {
  if (isPostgres) {
    await ensurePostgresSchema()
    const pg = getPostgres()
    const rows = await pg`SELECT * FROM tracks WHERE category = ${category} AND is_active = 1 ORDER BY created_at DESC`
    return rows.map(mapTrack)
  } else {
    const db = getSqlite()
    const rows = db.prepare('SELECT * FROM tracks WHERE category = ? AND is_active = 1 ORDER BY created_at DESC').all(category) as any[]
    return rows.map(mapTrack)
  }
}

export async function getTrackById(id: string): Promise<Track | undefined> {
  if (isPostgres) {
    await ensurePostgresSchema()
    const pg = getPostgres()
    const rows = await pg`SELECT * FROM tracks WHERE id = ${id}`
    return mapTrack(rows[0])
  } else {
    const db = getSqlite()
    const row = db.prepare('SELECT * FROM tracks WHERE id = ?').get(id)
    return mapTrack(row)
  }
}

export async function createTrack(track: Omit<Track, 'created_at' | 'updated_at' | 'is_active'>): Promise<Track> {
  if (isPostgres) {
    await ensurePostgresSchema()
    const pg = getPostgres()
    await pg`
      INSERT INTO tracks (id, title, category, description, price, discount, audio_url, cover_url)
      VALUES (${track.id}, ${track.title}, ${track.category}, ${track.description}, ${track.price}, ${track.discount}, ${track.audio_url}, ${track.cover_url})
    `
    const res = await getTrackById(track.id)
    return res as Track
  } else {
    const db = getSqlite()
    db.prepare(`
      INSERT INTO tracks (id, title, category, description, price, discount, audio_url, cover_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(track.id, track.title, track.category, track.description, track.price, track.discount, track.audio_url, track.cover_url)
    return getTrackById(track.id) as Promise<Track> as unknown as Track
  }
}

export async function updateTrack(id: string, data: Partial<Omit<Track, 'id' | 'created_at'>>): Promise<Track | undefined> {
  if (isPostgres) {
    await ensurePostgresSchema()
    const pg = getPostgres()
    
    // В PostgreSQL обновление через pg-client немного отличается
    const updateData: any = { ...data, updated_at: new Date() }
    
    // Фильтруем undefined
    const keys = Object.keys(updateData).filter(key => updateData[key] !== undefined)
    
    if (keys.length === 0) return getTrackById(id)

    // Простой паттерн для динамического UPDATE в postgres.js
    await pg`
      UPDATE tracks 
      SET ${pg(updateData, ...keys)}
      WHERE id = ${id}
    `
    return getTrackById(id)
  } else {
    const db = getSqlite()
    const fields: string[] = []
    const values: unknown[] = []

    if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title) }
    if (data.category !== undefined) { fields.push('category = ?'); values.push(data.category) }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description) }
    if (data.price !== undefined) { fields.push('price = ?'); values.push(data.price) }
    if (data.discount !== undefined) { fields.push('discount = ?'); values.push(data.discount) }
    if (data.audio_url !== undefined) { fields.push('audio_url = ?'); values.push(data.audio_url) }
    if (data.cover_url !== undefined) { fields.push('cover_url = ?'); values.push(data.cover_url) }
    if (data.is_active !== undefined) { fields.push('is_active = ?'); values.push(data.is_active) }

    fields.push("updated_at = datetime('now')")
    values.push(id)

    db.prepare(`UPDATE tracks SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return getTrackById(id)
  }
}

export async function deleteTrack(id: string): Promise<void> {
  if (isPostgres) {
    const pg = getPostgres()
    await pg`UPDATE tracks SET is_active = 0 WHERE id = ${id}`
  } else {
    const db = getSqlite()
    db.prepare('UPDATE tracks SET is_active = 0 WHERE id = ?').run(id)
  }
}

export async function hardDeleteTrack(id: string): Promise<void> {
  if (isPostgres) {
    const pg = getPostgres()
    await pg`DELETE FROM tracks WHERE id = ${id}`
  } else {
    const db = getSqlite()
    db.prepare('DELETE FROM tracks WHERE id = ?').run(id)
  }
}
