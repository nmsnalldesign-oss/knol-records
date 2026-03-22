'use client'

import { useEffect, useRef } from 'react'

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight
    let mx = width / 2
    let my = height / 2

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    let time = 0
    const lines = 35

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = 1.2
      
      const mouseInfluenceY = ((my / height) - 0.5) * 150
      
      for (let i = 0; i < lines; i++) {
        ctx.beginPath()
        
        // Progress from top to bottom
        const progress = i / lines
        
        // Gradient of gold
        const alpha = Math.max(0.01, 0.4 - progress * 0.3)
        ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`
        
        const baseY = height * 0.3 + (progress * height * 0.8)
        
        for (let x = -50; x <= width + 50; x += 30) {
          const dx = x - mx
          const distance = Math.abs(dx)
          
          const timeOffset = time * (0.5 + progress * 0.5)
          const wave1 = Math.sin(x * 0.003 + timeOffset) * 40
          const wave2 = Math.cos(x * 0.005 - timeOffset) * 60 * progress
          
          // Influence from mouse
          const influence = Math.max(0, 1 - distance / 500) * mouseInfluenceY * progress
          
          const y = baseY + wave1 + wave2 + influence
          
          if (x === -50) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      
      time += 0.02
      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40 mix-blend-screen"
    />
  )
}
