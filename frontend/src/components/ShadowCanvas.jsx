import React, { useEffect, useRef } from 'react'
import { SHADOW_DRAWERS } from '../utils/shadowDrawers'

const CANVAS_W = 480
const CANVAS_H = 360

export default function ShadowCanvas({ gesture, center, flash }) {
  const canvasRef = useRef(null)
  const flashRef = useRef(false)
  const animRef = useRef(null)
  const latestPropsRef = useRef({ gesture, center })

  useEffect(() => {
    latestPropsRef.current = { gesture, center }
  }, [gesture, center])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const render = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

      // Neutral dark wall projection background
      const grad = ctx.createRadialGradient(
        CANVAS_W / 2, CANVAS_H / 2, 60,
        CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.8
      )
      grad.addColorStop(0, '#172033')
      grad.addColorStop(1, '#0b1120')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Spotlight illumination
      const spotGrad = ctx.createRadialGradient(
        CANVAS_W / 2, CANVAS_H / 2, 0,
        CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.55
      )
      spotGrad.addColorStop(0, 'rgba(255, 235, 180, 0.08)')
      spotGrad.addColorStop(0.5, 'rgba(255, 215, 140, 0.03)')
      spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = spotGrad
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      const { gesture: currentGesture, center: currentCenter } = latestPropsRef.current

      // Draw shadow if gesture and center known
      // Note: Invert X (1 - currentCenter.x) to match mirrored user camera coordinate
      if (currentGesture && currentCenter && SHADOW_DRAWERS[currentGesture]) {
        const px = (1 - currentCenter.x) * CANVAS_W
        const py = currentCenter.y * CANVAS_H
        const scale = 1.2

        ctx.save()
        ctx.shadowBlur = 24
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
        SHADOW_DRAWERS[currentGesture](ctx, px, py, scale)
        ctx.restore()

        if (flashRef.current) {
          ctx.save()
          ctx.globalAlpha = 0.2
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
          ctx.restore()
        }
      } else {
        // No hand: clean text prompt (NO emojis)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.font = '14px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Position hand in camera frame to cast shadow', CANVAS_W / 2, CANVAS_H / 2)
      }

      animRef.current = requestAnimationFrame(render)
    }

    animRef.current = requestAnimationFrame(render)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  // Trigger flash
  useEffect(() => {
    if (flash) {
      flashRef.current = true
      const timer = setTimeout(() => { flashRef.current = false }, 120)
      return () => clearTimeout(timer)
    }
  }, [flash])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{
        width: '100%',
        maxWidth: '500px',
        height: 'auto',
        borderRadius: '4px',
        border: '1px solid var(--border)',
        display: 'block',
      }}
      aria-label={gesture ? `Shadow projection: ${gesture}` : 'Shadow projection: no gesture detected'}
    />
  )
}
