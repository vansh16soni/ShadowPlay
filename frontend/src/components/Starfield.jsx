import React, { useMemo } from 'react'

export default function Starfield({ theme }) {
  // Only render when the dark theme is active
  if (theme !== 'dark') return null

  // Generate a list of stars with random positions, animation delays, durations, and sizes
  const stars = useMemo(() => {
    return Array.from({ length: 80 }).map((_, idx) => ({
      id: idx,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1, // 1px to 3px
      delay: `${Math.random() * 6}s`,
      duration: `${Math.random() * 4 + 2}s`, // 2s to 6s
      opacity: Math.random() * 0.7 + 0.3
    }))
  }, [])

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
      width: '100%',
      height: '100%',
      transition: 'opacity 1s ease',
    }}>
      {/* Twinkling Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            backgroundColor: '#fff',
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
            opacity: star.opacity,
            animation: `twinkle ${star.duration} infinite ease-in-out`,
            animationDelay: star.delay,
          }}
        />
      ))}

      {/* Shooting Star 1 */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: '80%',
          width: 2,
          height: 100,
          background: 'linear-gradient(to bottom, rgba(167, 139, 250, 0), rgba(34, 211, 238, 0.8))',
          transform: 'rotate(-45deg)',
          opacity: 0,
          animation: 'shootingStar1 14s infinite ease-in-out',
          animationDelay: '2s'
        }}
      />

      {/* Shooting Star 2 */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: '40%',
          width: 2,
          height: 120,
          background: 'linear-gradient(to bottom, rgba(236, 72, 153, 0), rgba(167, 139, 250, 0.8))',
          transform: 'rotate(-45deg)',
          opacity: 0,
          animation: 'shootingStar2 20s infinite ease-in-out',
          animationDelay: '8s'
        }}
      />

      {/* Gravity Orbit 1 */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '650px',
          height: '650px',
          border: '1px dashed rgba(167, 139, 250, 0.08)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'spin 120s linear infinite',
        }}
      />

      {/* Gravity Orbit 2 */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '950px',
          height: '950px',
          border: '1px dashed rgba(34, 211, 238, 0.04)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'spin-reverse 180s linear infinite',
        }}
      />
    </div>
  )
}
