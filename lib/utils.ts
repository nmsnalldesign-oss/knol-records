// ═══════════════════════════════════════════════
// Утилиты проекта
// ═══════════════════════════════════════════════

/**
 * Форматирование цены в рублях
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Форматирование времени аудио (секунды → MM:SS)
 */
export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Получить название категории на русском
 */
export function getCategoryName(category: string): string {
  const map: Record<string, string> = {
    children: 'Детские песни',
    male: 'Мужские песни',
    female: 'Женские песни',
  }
  return map[category] || category
}

/**
 * Получить иконку категории (emoji)
 */
export function getCategoryIcon(category: string): string {
  const map: Record<string, string> = {
    children: '🧸',
    male: '🎤',
    female: '🌸',
  }
  return map[category] || '🎵'
}

/**
 * Генерация ссылки для обсуждения покупки в ВК
 */
export function getVkContactLink(trackTitle: string): string {
  const vkId = 'knolrecords'
  const message = encodeURIComponent(`Здравствуйте! Меня интересует трек: ${trackTitle}`)
  return `https://vk.me/${vkId}?text=${message}`
}

/**
 * CN — утилита для условных классов (TailwindMerge light)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
