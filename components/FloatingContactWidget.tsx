'use client'

import { useState } from 'react'

export default function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-[110] flex flex-col items-end gap-3">
      {/* Menu items */}
      <div 
        className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10 pointer-events-none'
        }`}
      >
        <a 
          href="https://t.me/ЗАГЛУШКА" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#2AABEE] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="Telegram"
        >
          <svg className="w-6 h-6 ml-[-2px] mt-[1px]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </a>
        
        <a 
          href="https://wa.me/ЗАГЛУШКА" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="WhatsApp"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.996 0C5.372 0 0 5.373 0 11.996c0 2.636.853 5.08 2.348 7.085L.548 24l5.06-1.8c1.948 1.285 4.3 2.035 6.837 2.035 6.626 0 12-5.373 12-11.996S18.622 0 11.996 0zm5.66 17.15c-.244.7-1.336 1.343-1.85 1.442-.486.094-1.114.18-3.243-.703-2.615-1.085-4.286-3.794-4.414-3.966-.128-.173-1.054-1.404-1.054-2.68 0-1.275.66-1.903.896-2.155.234-.253.51-.302.68-.302.17 0 .34.008.49.015.158.007.37.009.58.508.21.503.722 1.767.788 1.895.065.129.112.285.023.46-.089.176-.134.283-.267.437-.132.152-.276.324-.396.44-.128.12-.26.252-.112.508.15.253.666 1.096 1.432 1.782.988.885 1.812 1.157 2.067 1.284.256.128.405.105.556-.06.15-.164.654-.761.828-1.02.176-.258.35-.214.588-.124.238.09 1.503.71 1.76 8.38.257.129.429.233.49.362.062.13-.062.76-.307 1.46z"/>
          </svg>
        </a>

        <a 
          href="https://vk.ru/knolrecords" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#0077FF] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="VK"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.176 16.512c-.176.264-.528.352-.88.352h-1.672c-.44 0-.704-.264-.968-.616-1.056-1.584-3.52-1.76-3.52-1.76V15.8c0 .352-.264.704-.704.704H8.208c-2.464 0-4.928-1.584-6.424-4.576C.376 9.112.376 6.384.464 5.944c.088-.44.44-.616.792-.616h1.76c.44 0 .704.264.88.616 1.056 2.376 2.552 4.4 3.256 4.4.264 0 .44-.176.44-.704V6.12c0-.352-.088-.704-.616-.88.352-.352 1.056-.44 1.76-.44 1.32 0 1.496.088 1.936.352.528.264.616.792.616 1.76v3.344c0 .44.352.616.528.616.352 0 .968-.792 2.2-3.696.176-.44.528-.616.88-.616h1.848c.616 0 .792.264.704.704-.176.88-1.496 3.168-3.08 5.104-.352.44-.352.792 0 1.232 0 0 2.2 2.024 2.64 2.816.264.44.088.792-.176.968z" />
          </svg>
        </a>
      </div>

      {/* Toggle button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 to-cyan-600 flex items-center justify-center text-[#0B0C10] shadow-[0_5px_20px_rgba(0,206,203,0.3)] hover:shadow-[0_5px_25px_rgba(0,206,203,0.5)] transition-all hover:scale-105"
        aria-label="Contact actions"
      >
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-[-45deg]' : 'rotate-0'}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            )}
          </svg>
        </div>
      </button>
    </div>
  )
}
