import { useEffect, useRef, useCallback } from 'react'
import { SHADOW_DRAWERS } from '../utils/shadowDrawers'

const CANVAS_W = 480
const CANVAS_H = 360

export default function ShadowCanvas({ gesture, center, flash }) {
  const canvasRef = useRef(null)
  const flashRef = useRef(false)
  const animRef = useRef(null)
  const prevGestureRef = useRef(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

    // Background – dark wall texture
    const grad = ctx.createRadialGradient(
      CANVAS_W / 2, CANVAS_H / 2, 60,
      CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.8
    )
    grad.addColorStop(0, '#1a1a2e')
    grad.addColorStop(1, '#0d0d14')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    // Spotlight effect (with candlelight flicker micro-animation)
    const flicker = 1 + (Math.sin(Date.now() * 0.005) * 0.015) + (Math.random() * 0.008)
    const spotGrad = ctx.createRadialGradient(
      CANVAS_W / 2, CANVAS_H / 2, 0,
      CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.55 * flicker
    )
    spotGrad.addColorStop(0, 'rgba(255,230,120,0.09)')
    spotGrad.addColorStop(0.5, 'rgba(255,200,80,0.035)')
    spotGrad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = spotGrad
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    // Draw shadow if gesture + center known
    if (gesture && center && SHADOW_DRAWERS[gesture]) {
      const px = center.x * CANVAS_W
      const py = center.y * CANVAS_H
      const scale = 1.2

      // Soft ground shadow
      ctx.save()
      ctx.shadowBlur = 30
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      SHADOW_DRAWERS[gesture](ctx, px, py, scale)
      ctx.restore()

      // Flash overlay on correct detection
      if (flashRef.current) {
        ctx.save()
        ctx.globalAlpha = 0.25
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
        ctx.restore()
      }
    } else {
      // No hand – show hint text
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      ctx.font = '16px Inter'
      ctx.textAlign = 'center'
      ctx.fillText('Show your hand to the camera', CANVAS_W / 2, CANVAS_H / 2)
      ctx.font = '28px serif'
      ctx.fillText('✋', CANVAS_W / 2, CANVAS_H / 2 + 40)
    }

    animRef.current = requestAnimationFrame(draw)
  }, [gesture, center])

  // Trigger flash
  useEffect(() => {
    if (flash) {
      flashRef.current = true
      setTimeout(() => { flashRef.current = false }, 120)
    }
  }, [flash])

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{
        width: '100%',
        maxWidth: '500px',
        height: 'auto',
        borderRadius: '16px',
        border: '2px solid var(--border)',
        display: 'block',
      }}
      aria-label={gesture ? `Shadow of ${gesture}` : 'Shadow canvas – no gesture detected'}
    />
  )
}
