import Database from 'better-sqlite3'
import path from 'path'

// ═══════════════════════════════════════════════
// SQLite База данных — Треки
// ═══════════════════════════════════════════════

const DB_PATH = path.join(process.cwd(), 'songwriterknol.db')

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initializeDb(db)
  }
  return db
}

function initializeDb(db: Database.Database) {
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

  // Проверяем наличие колонки discount для существующей БД
  const columns = db.pragma("table_info('tracks')") as Array<{ name: string }>
  if (!columns.some((col: any) => col.name === 'discount')) {
    db.exec('ALTER TABLE tracks ADD COLUMN discount INTEGER DEFAULT 0;')
  }

  // Добавляем демо-данные, если таблица пустая
  const count = db.prepare('SELECT COUNT(*) as cnt FROM tracks').get() as { cnt: number }
  if (count.cnt === 0) {
    seedDemoData(db)
  }
}

function seedDemoData(db: Database.Database) {
  const insert = db.prepare(`
    INSERT INTO tracks (id, title, category, description, price, discount, audio_url, cover_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const demoTracks = [
    {
      id: 'demo-1',
      title: 'Солнечный зайчик',
      category: 'children',
      description: 'Весёлая детская песня о приключениях солнечного зайчика. Идеальна для утренников и детских праздников.',
      price: 15000,
      discount: 20,
      audio_url: '/uploads/demo/demo-track-1.mp3',
      cover_url: '',
    },
    {
      id: 'demo-2',
      title: 'Мечты о звёздах',
      category: 'children',
      description: 'Колыбельная для малышей. Нежная мелодия и волшебный текст о путешествии к звёздам.',
      price: 12000,
      discount: 0,
      audio_url: '/uploads/demo/demo-track-2.mp3',
      cover_url: '',
    },
    {
      id: 'demo-3',
      title: 'Дорога домой',
      category: 'male',
      description: 'Глубокая баллада о возвращении домой. Мощный вокал, живые инструменты.',
      price: 25000,
      discount: 30,
      audio_url: '/uploads/demo/demo-track-3.mp3',
      cover_url: '',
    },
    {
      id: 'demo-4',
      title: 'Город огней',
      category: 'male',
      description: 'Энергичный рок-трек о ночном городе. Драйв и адреналин в каждой ноте.',
      price: 20000,
      discount: 0,
      audio_url: '/uploads/demo/demo-track-4.mp3',
      cover_url: '',
    },
    {
      id: 'demo-5',
      title: 'Крылья',
      category: 'female',
      description: 'Вдохновляющая поп-баллада о свободе и мечтах. Идеальна для сильного женского вокала.',
      price: 22000,
      discount: 0,
      audio_url: '/uploads/demo/demo-track-5.mp3',
      cover_url: '',
    },
    {
      id: 'demo-6',
      title: 'Танцуй со мной',
      category: 'female',
      description: 'Зажигательный танцевальный трек. Хитовый припев, современное звучание.',
      price: 18000,
      discount: 15,
      audio_url: '/uploads/demo/demo-track-6.mp3',
      cover_url: '',
    },
  ]

  const insertMany = db.transaction(() => {
    for (const track of demoTracks) {
      insert.run(track.id, track.title, track.category, track.description, track.price, track.discount, track.audio_url, track.cover_url)
    }
  })

  insertMany()
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

export function getAllTracks(): Track[] {
  const db = getDb()
  return db.prepare('SELECT * FROM tracks WHERE is_active = 1 ORDER BY created_at DESC').all() as Track[]
}

export function getTracksByCategory(category: string): Track[] {
  const db = getDb()
  return db.prepare('SELECT * FROM tracks WHERE category = ? AND is_active = 1 ORDER BY created_at DESC').all(category) as Track[]
}

export function getTrackById(id: string): Track | undefined {
  const db = getDb()
  return db.prepare('SELECT * FROM tracks WHERE id = ?').get(id) as Track | undefined
}

export function createTrack(track: Omit<Track, 'created_at' | 'updated_at' | 'is_active'>): Track {
  const db = getDb()
  db.prepare(`
    INSERT INTO tracks (id, title, category, description, price, discount, audio_url, cover_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(track.id, track.title, track.category, track.description, track.price, track.discount, track.audio_url, track.cover_url)
  return getTrackById(track.id) as Track
}

export function updateTrack(id: string, data: Partial<Omit<Track, 'id' | 'created_at'>>): Track | undefined {
  const db = getDb()
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

export function deleteTrack(id: string): void {
  const db = getDb()
  db.prepare('UPDATE tracks SET is_active = 0 WHERE id = ?').run(id)
}

export function hardDeleteTrack(id: string): void {
  const db = getDb()
  db.prepare('DELETE FROM tracks WHERE id = ?').run(id)
}
