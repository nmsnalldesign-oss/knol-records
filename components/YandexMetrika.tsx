'use client'

// ═══════════════════════════════════════════════
// Яндекс.Метрика — Компонент
// 
// ⚠️ Счётчик подключается ТОЛЬКО в production!
// 📝 Замени XXXXXX на реальный ID счётчика
// ═══════════════════════════════════════════════

import { useEffect } from 'react'

const METRIKA_ID = 'XXXXXX' // TODO: Замени на реальный ID Яндекс.Метрики

export function YandexMetrika() {
  useEffect(() => {
    // Подключаем только в продакшене
    if (process.env.NODE_ENV !== 'production') {
      console.log('[YandexMetrika] Скрипт не подключён — не production окружение')
      return
    }

    // Создаём скрипт Яндекс.Метрики
    const script = document.createElement('script')
    script.innerHTML = `
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(${METRIKA_ID}, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
      });
    `
    document.head.appendChild(script)

    // Добавляем noscript пиксель
    const noscript = document.createElement('noscript')
    const img = document.createElement('img')
    img.src = `https://mc.yandex.ru/watch/${METRIKA_ID}`
    img.style.cssText = 'position:absolute;left:-9999px;'
    img.alt = ''
    noscript.appendChild(img)
    document.body.appendChild(noscript)

    return () => {
      // Cleanup not strictly necessary but good practice
      if (script.parentNode) script.parentNode.removeChild(script)
      if (noscript.parentNode) noscript.parentNode.removeChild(noscript)
    }
  }, [])

  return null
}
