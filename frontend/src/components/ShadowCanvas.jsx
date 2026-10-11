import React, { useEffect, useRef } from 'react'
import { SHADOW_DRAWERS } from '../utils/shadowDrawers'

const CANVAS_W = 640
const CANVAS_H = 480

export default function ShadowCanvas({ 
  gesture, 
  center, 
  flash, 
  lightMode = 'tungsten', 
  softness = 22,
  lightAngle = 0,
  ghostGesture = null,
}) {
  const canvasRef = useRef(null)
  const flashRef = useRef(false)
  const animRef = useRef(null)
  const latestPropsRef = useRef({ gesture, center, lightMode, softness, lightAngle, ghostGesture })

  useEffect(() => {
    latestPropsRef.current = { gesture, center, lightMode, softness, lightAngle, ghostGesture }
  }, [gesture, center, lightMode, softness, lightAngle, ghostGesture])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let frame = 0

    const render = () => {
      frame++
      const { 
        gesture: currentGesture, 
        center: currentCenter, 
        lightMode: currentLightMode, 
        softness: currentSoftness, 
        lightAngle: currentLightAngle,
        ghostGesture: currentGhost
      } = latestPropsRef.current

      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

      // Base Projection Wall Background
      ctx.fillStyle = '#0f121a'
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Subtle fine paper / stage fabric grain
      const lightX = CANVAS_W / 2 + currentLightAngle * 90
      const lightY = CANVAS_H / 2 - 20

      // Stage Light Beam Gradient (Authentic warm analog tones)
      const grad = ctx.createRadialGradient(
        lightX, lightY, 40,
        CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.75
      )

      if (currentLightMode === 'tungsten') {
        // Warm Tungsten Lantern (2800K)
        grad.addColorStop(0, 'rgba(234, 179, 8, 0.16)')
        grad.addColorStop(0.35, 'rgba(217, 119, 6, 0.08)')
        grad.addColorStop(0.7, 'rgba(180, 83, 9, 0.03)')
        grad.addColorStop(1, 'rgba(11, 14, 20, 0)')
      } else if (currentLightMode === 'spotlight') {
        // High-contrast Studio Beam
        grad.addColorStop(0, 'rgba(241, 245, 249, 0.18)')
        grad.addColorStop(0.4, 'rgba(203, 213, 225, 0.07)')
        grad.addColorStop(0.8, 'rgba(148, 163, 184, 0.02)')
        grad.addColorStop(1, 'rgba(11, 14, 20, 0)')
      } else {
        // Lantern / Candle with subtle organic flicker
        const flicker = 0.015 * Math.sin(frame * 0.08) + 0.01 * Math.cos(frame * 0.13)
        grad.addColorStop(0, `rgba(245, 158, 11, ${0.18 + flicker})`)
        grad.addColorStop(0.4, `rgba(180, 83, 9, ${0.08 + flicker})`)
        grad.addColorStop(1, 'rgba(11, 14, 20, 0)')
      }

      ctx.fillStyle = grad
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Concentric projector optical rings
      ctx.save()
      ctx.strokeStyle = currentLightMode === 'tungsten' 
        ? 'rgba(217, 119, 6, 0.04)' 
        : 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1
      for (let r = 80; r <= 280; r += 50) {
        ctx.beginPath()
        ctx.arc(lightX, lightY, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.restore()

      // Target Ghost Guide Outline (if ghost gesture active and no match yet)
      if (currentGhost && SHADOW_DRAWERS[currentGhost] && currentGesture !== currentGhost) {
        ctx.save()
        ctx.globalAlpha = 0.22
        ctx.strokeStyle = '#d97706'
        ctx.setLineDash([4, 6])
        ctx.lineWidth = 1.5
        // Draw centered target guide
        SHADOW_DRAWERS[currentGhost](ctx, CANVAS_W / 2, CANVAS_H / 2, 1.25)
        ctx.restore()
      }

      // Draw Shadow Silhouette when hand is recognized
      if (currentGesture && currentCenter && SHADOW_DRAWERS[currentGesture]) {
        // Project with optical light parallax offset
        const mirroredX = 1 - currentCenter.x
        const px = mirroredX * CANVAS_W + currentLightAngle * 35
        const py = currentCenter.y * CANVAS_H
        const scale = 1.35

        ctx.save()
        ctx.shadowBlur = currentSoftness
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)'
        ctx.shadowOffsetX = currentLightAngle * 6
        ctx.shadowOffsetY = 4

        // Deep analog silhouette
        ctx.fillStyle = '#0a0d14'
        SHADOW_DRAWERS[currentGesture](ctx, px, py, scale)
        ctx.restore()

        // Flash feedback on successful gesture change
        if (flashRef.current) {
          ctx.save()
          ctx.globalAlpha = 0.18
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
          ctx.restore()
        }
      } else {
        // Idle guidance prompt
        ctx.save()
        ctx.fillStyle = 'rgba(226, 232, 240, 0.45)'
        ctx.font = '500 13px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Position hand in camera frame to cast shadow', CANVAS_W / 2, CANVAS_H / 2 + 30)

        // Subtle guide frame
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
        ctx.lineWidth = 1
        ctx.setLineDash([6, 6])
        ctx.strokeRect(CANVAS_W * 0.2, CANVAS_H * 0.18, CANVAS_W * 0.6, CANVAS_H * 0.64)
        ctx.restore()
      }

      animRef.current = requestAnimationFrame(render)
    }

    animRef.current = requestAnimationFrame(render)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  // Flash trigger
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
        height: 'auto',
        aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
        display: 'block',
        background: '#0f121a',
      }}
      aria-label={gesture ? `Shadow projection: ${gesture}` : 'Shadow projection: waiting for gesture'}
    />
  )
}
