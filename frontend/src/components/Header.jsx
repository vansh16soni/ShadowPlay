import React from 'react'

export default function Header({ guestId, theme, setTheme, voiceEnabled, setVoiceEnabled, speak }) {
  return (
    <header style={{
      padding: '16px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid var(--border)',
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent-red), var(--accent-orange), var(--accent-gold))',
            boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
            color: '#fff',
            fontWeight: 'bold',
          }}>
            🎭
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-title)',
              background: 'linear-gradient(90deg, var(--accent-red), var(--accent-orange), var(--accent-gold))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
            }}>
              SHADOWPLAY
            </span>
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.28em',
              color: 'var(--accent-gold)',
              marginTop: 2,
              textTransform: 'uppercase',
              opacity: 0.95
            }}>
              AI.STUDIO
            </span>
          </div>
        </div>
        <span style={{
          fontSize: 10,
          letterSpacing: '0.1em',
          padding: '2px 8px',
          borderRadius: 6,
          background: 'rgba(249, 115, 22, 0.12)',
          border: '1px solid rgba(249, 115, 22, 0.25)',
          color: 'var(--accent-orange)',
          textTransform: 'uppercase',
          fontWeight: 700,
        }}>
          Beta
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Guest ID badge */}
        <div style={{
          fontSize: 12,
          fontFamily: 'var(--font-title)',
          color: 'var(--text-dim)',
          background: 'var(--nav-btn-bg)',
          border: '1px solid var(--border)',
          padding: '6px 12px',
          borderRadius: 8,
        }}>
          🎮 PLAYER: <span style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>#{guestId.slice(-4).toUpperCase()}</span>
        </div>

        {/* Theme Switcher Toggle */}
        <button 
          onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          style={{
            padding: 8,
            borderRadius: 8,
            background: 'var(--nav-btn-bg)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          title={theme === 'dark' ? "Switch to Bright Mode" : "Switch to Dark Mode"}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent-orange)'
            e.currentTarget.style.color = 'var(--accent-orange)'
            e.currentTarget.style.background = 'var(--nav-btn-hover)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-muted)'
            e.currentTarget.style.background = 'var(--nav-btn-bg)'
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Voice Speech Toggle */}
        <button 
          onClick={() => {
            const nextVal = !voiceEnabled
            setVoiceEnabled(nextVal)
            if (nextVal) speak("Voice narration activated")
          }} 
          style={{
            padding: 8,
            borderRadius: 8,
            background: voiceEnabled ? 'rgba(249, 115, 22, 0.12)' : 'var(--nav-btn-bg)',
            border: voiceEnabled ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid var(--border)',
            color: voiceEnabled ? 'var(--accent-orange)' : 'var(--text-muted)',
            fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          title={voiceEnabled ? "Mute Voice Narration" : "Unmute Voice Narration"}
          onMouseEnter={e => {
            if (!voiceEnabled) {
              e.currentTarget.style.borderColor = 'var(--accent-orange)'
              e.currentTarget.style.color = 'var(--accent-orange)'
              e.currentTarget.style.background = 'var(--nav-btn-hover)'
            }
          }}
          onMouseLeave={e => {
            if (!voiceEnabled) {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.background = 'var(--nav-btn-bg)'
            }
          }}
        >
          {voiceEnabled ? '🔊' : '🔇'}
        </button>
      </div>
    </header>
  )
}
