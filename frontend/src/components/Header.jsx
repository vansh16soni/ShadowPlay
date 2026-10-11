import React from 'react'
import { StudioIcon, SunIcon, MoonIcon, VolumeIcon, VolumeMuteIcon } from './Icons'

export default function Header({
  guestId,
  user,
  onOpenAuth,
  onOpenAdmin,
  onLogout,
  theme,
  setTheme,
  voiceEnabled,
  setVoiceEnabled,
  speak,
  onNavigate,
}) {
  return (
    <header style={{
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '2px solid var(--border-dark)',
      borderTop: '1px solid var(--border-light)',
      background: 'var(--nav-bg)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* 3D Brand Plaque */}
        <button
          onClick={() => onNavigate ? onNavigate('/') : (window.location.href = '/')}
          className="link-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textDecoration: 'none',
            color: 'inherit',
            background: 'var(--surface)',
            padding: '6px 12px',
            borderRadius: 4,
            border: '1px solid var(--border)',
            borderTop: '1px solid var(--border-light)',
            boxShadow: '0 3px 0 var(--border-dark), 0 4px 10px rgba(0,0,0,0.4)',
            transition: 'transform 0.08s ease, box-shadow 0.08s ease',
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = 'translateY(2px)'
            e.currentTarget.style.boxShadow = '0 1px 0 var(--border-dark), 0 2px 4px rgba(0,0,0,0.3)'
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = '0 3px 0 var(--border-dark), 0 4px 10px rgba(0,0,0,0.4)'
          }}
          aria-label="ShadowPlay Studio Home"
        >
          <div style={{
            width: 30,
            height: 30,
            borderRadius: 3,
            background: 'var(--accent-orange)',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.4)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <StudioIcon size={18} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--text)' }}>
              ShadowPlay
            </span>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Optical Hand Studio
            </span>
          </div>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* User Identity / Authentication Plaque */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              fontSize: 11,
              color: 'var(--text)',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              padding: '6px 12px',
              borderRadius: 3,
              fontFamily: 'var(--font-mono)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              <strong style={{ color: 'var(--accent-orange)' }}>
                {user.name ? user.name.toUpperCase() : `#${guestId.slice(-4).toUpperCase()}`}
              </strong>
            </div>

            {/* Admin Console shortcut if role is admin */}
            {user.role === 'admin' && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="depth-button primary-depth"
                style={{
                  padding: '6px 12px',
                  fontSize: 11,
                  fontWeight: 800,
                  background: 'var(--accent-orange)',
                  border: 'none',
                  borderRadius: 4,
                  color: '#ffffff',
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                }}
              >
                ADMIN CONSOLE
              </button>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="btn btn-secondary"
              style={{ padding: '6px 10px', fontSize: 11, color: 'var(--text-muted)' }}
              title="Sign out operative"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              fontSize: 11,
              color: 'var(--text-dim)',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              padding: '6px 12px',
              borderRadius: 3,
              fontFamily: 'var(--font-mono)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>TERMINAL:</span>
              <strong style={{ color: 'var(--accent-orange)' }}>#{guestId.slice(-4).toUpperCase()}</strong>
            </div>

            <button
              type="button"
              onClick={onOpenAuth}
              className="depth-button"
              style={{
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 800,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                color: 'var(--text)',
                cursor: 'pointer',
                letterSpacing: '0.06em',
              }}
            >
              SIGN IN / REGISTER
            </button>
          </div>
        )}

        {/* 3D Theme Switcher Toggle */}
        <button 
          type="button"
          onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          className="btn btn-secondary"
          style={{
            padding: '6px 12px',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <SunIcon size={14} /> : <MoonIcon size={14} />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* 3D Voice Speech Toggle with Physical Diode */}
        <button 
          type="button"
          onClick={() => {
            const nextVal = !voiceEnabled
            setVoiceEnabled(nextVal)
            if (nextVal) speak("Voice guidance enabled")
          }} 
          className="btn btn-secondary"
          style={{
            padding: '6px 12px',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderColor: voiceEnabled ? 'var(--accent-orange)' : 'var(--border)',
          }}
          title={voiceEnabled ? "Mute Voice Guidance" : "Enable Voice Guidance"}
          aria-label={voiceEnabled ? "Mute Voice Guidance" : "Enable Voice Guidance"}
        >
          <span 
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: voiceEnabled ? 'var(--accent-green)' : 'var(--text-muted)',
              boxShadow: voiceEnabled ? '0 0 6px rgba(16, 185, 129, 0.8)' : 'none',
            }}
            aria-hidden="true"
          />
          {voiceEnabled ? <VolumeIcon size={14} color="var(--accent-orange)" /> : <VolumeMuteIcon size={14} />}
          <span>{voiceEnabled ? 'Voice Active' : 'Voice Muted'}</span>
        </button>
      </div>
    </header>
  )
}
