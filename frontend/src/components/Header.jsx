import React from 'react'
import { StudioIcon, SunIcon, MoonIcon, VolumeIcon, VolumeMuteIcon } from './Icons'

export default function Header({ guestId, theme, setTheme, voiceEnabled, setVoiceEnabled, speak, onNavigate }) {
  return (
    <header style={{
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border)',
      background: 'var(--nav-bg)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => onNavigate('/')}
          className="link-button"
          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}
          aria-label="ShadowPlay Studio Home"
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 4,
            background: 'var(--accent)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <StudioIcon size={18} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              ShadowPlay
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Hand Silhouette Studio
            </span>
          </div>
        </button>

        <span style={{
          fontSize: 11,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 4,
          background: 'var(--surface-hover)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
        }}>
          v1.0 (On-Device)
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Guest Identifier badge */}
        <div style={{
          fontSize: 12,
          color: 'var(--text-dim)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: '6px 10px',
          borderRadius: 4,
          fontFamily: 'var(--font-mono)',
        }}>
          Player: <strong style={{ color: 'var(--text)' }}>#{guestId.slice(-4).toUpperCase()}</strong>
        </div>

        {/* Theme Switcher Toggle */}
        <button 
          onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          style={{
            padding: '6px 10px',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
          }}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <SunIcon size={14} /> : <MoonIcon size={14} />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* Voice Speech Toggle */}
        <button 
          onClick={() => {
            const nextVal = !voiceEnabled
            setVoiceEnabled(nextVal)
            if (nextVal) speak("Voice guidance enabled")
          }} 
          style={{
            padding: '6px 10px',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            borderColor: voiceEnabled ? 'var(--border-focus)' : 'var(--border)',
          }}
          title={voiceEnabled ? "Mute Voice Guidance" : "Enable Voice Guidance"}
          aria-label={voiceEnabled ? "Mute Voice Guidance" : "Enable Voice Guidance"}
        >
          {voiceEnabled ? <VolumeIcon size={14} color="var(--accent)" /> : <VolumeMuteIcon size={14} />}
          <span>{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
        </button>
      </div>
    </header>
  )
}
