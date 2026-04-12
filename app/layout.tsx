import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'СонграйтерКноль — Авторские песни на продажу',
  description: 'Покупайте готовые авторские песни с полной передачей прав. Тексты, аранжировки и продакшн студийного качества. Детские, мужские, женские треки.',
  keywords: ['авторские песни', 'купить песню', 'songwriter', 'текст песни', 'аранжировка', 'музыка на заказ'],
  openGraph: {
    title: 'СонграйтерКноль — Авторские песни на продажу',
    description: 'Готовые авторские песни с полной передачей прав. Тексты, аранжировки и продакшн.',
    siteName: 'СонграйтерКноль',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'СонграйтерКноль',
    description: 'Авторские песни на продажу с полной передачей прав',
  },
  robots: {
    index: false,
    follow: false,
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
