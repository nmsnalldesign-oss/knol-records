import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'Сонграйтер Кноль — Песни для артистов на заказ | Аранжировка под ключ',
  description: 'Профессиональное написание песен на заказ и создание музыки под ключ от Ивана Кноля. Уникальная песня в подарок, аранжировка, сведение и мастеринг для артистов любого жанра.',
  keywords: [
    'написание песен на заказ', 'заказать песню', 'купить песню', 'песня под ключ', 'песня в подарок', 
    'Иван Кноль', 'сонграйтер Кноль', 'заказать аранжировку', 'услуги сонграйтера', 'написать текст песни',
    'песня на заказ цена', 'стоимость аранжировки', 'песня на свадьбу заказать', 'песня для артиста'
  ],
  openGraph: {
    title: 'Сонграйтер Кноль — Песни для артистов на заказ',
    description: 'Написание песен на заказ, аранжировка и сведение под ключ. Иван Кноль — ваш профессиональный сонграйтер.',
    siteName: 'Сонграйтер Кноль',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Сонграйтер Кноль — Песни для артистов на заказ',
    description: 'Профессиональное написание песен и создание музыки под ключ.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
