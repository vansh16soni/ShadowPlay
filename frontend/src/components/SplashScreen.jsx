import React from 'react'

export default function SplashScreen({ onPlayClick, theme }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      zIndex: 900,
    }}>
      {/* Candle spotlight flicker background */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120vw',
        height: '120vh',
        background: 'var(--spotlight-gradient)',
        opacity: 0.8,
        pointerEvents: 'none',
      }} />

      {/* Floating glow orbs */}
      <div className="glow-orb" style={{ top: '20%', left: '15%', opacity: 0.15 }}></div>
      <div className="glow-orb glow-orb-cyan" style={{ bottom: '25%', right: '15%', opacity: 0.15 }}></div>

      <div style={{
        textAlign: 'center',
        zIndex: 10,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        maxWidth: 600,
      }}>
        {/* Animated shadow icon */}
        <div style={{ 
          fontSize: 84, 
          animation: 'float 3s ease-in-out infinite',
          filter: 'drop-shadow(0 10px 20px rgba(251, 191, 36, 0.3))'
        }}>
          🕊️
        </div>

        <h1 style={{
          fontSize: 56,
          fontWeight: 900,
          fontFamily: 'var(--font-title)',
          letterSpacing: '-0.03em',
          margin: 0,
          background: 'linear-gradient(135deg, #fff 30%, var(--text-dim) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 40px rgba(255,255,255,0.1)',
        }}>
          ShadowPlay AI
        </h1>

        <p style={{
          fontSize: 16,
          color: 'var(--text-dim)',
          lineHeight: 1.6,
          margin: '0 0 16px 0',
          maxWidth: 460,
        }}>
          Bring hand shadow puppets to life. Harness browser-based AI tracking to cast detailed silhouettes and challenge your manual dexterity.
        </p>

        {/* Pulsing Play Game Button */}
        <button
          onClick={onPlayClick}
          style={{
            padding: '16px 48px',
            borderRadius: 16,
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-gold))',
            color: '#000',
            fontSize: 18,
            border: 'none',
            boxShadow: '0 10px 30px rgba(245, 158, 11, 0.35)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: 'scale(1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(245, 158, 11, 0.5)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(245, 158, 11, 0.35)'
          }}
        >
          🎮 Play Game
        </button>

        {/* Feature quick info row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginTop: 48,
          width: '100%',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '16px 12px',
          }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>🧘</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'block' }}>Free Practice</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Explore shapes at your own pace</span>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '16px 12px',
          }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>⚔️</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'block' }}>Shadow Quest</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Defeat beast vulnerabilities</span>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '16px 12px',
          }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>⏱</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'block' }}>Time Attack</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Beat the clock with combos</span>
          </div>
        </div>

        {/* Privacy reminder */}
        <div style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          marginTop: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <span>🛡️ On-device AI tracking. Your camera stream is kept completely private.</span>
        </div>
      </div>
    </div>
  )
}
