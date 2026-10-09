import React, { useState, useEffect } from 'react'

export default function CookieBanner({ onNavigate }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('shadowplay_cookie_consent')
      if (!consent) {
        setVisible(true)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem('shadowplay_cookie_consent', 'acknowledged')
    } catch (e) {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside
      role="region"
      aria-label="Storage and privacy notice"
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        maxWidth: 720,
        margin: '0 auto',
        zIndex: 9999,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '16px 20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <div style={{ flex: '1 1 320px', fontSize: 13, lineHeight: 1.5, color: 'var(--text-dim)' }}>
        <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 2 }}>Storage and Privacy Notice</strong>
        ShadowPlay uses strictly necessary local storage to remember your guest records and theme settings. We use zero third-party advertising cookies and process all camera feeds strictly on your device.
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          onClick={() => onNavigate('/cookies')}
          className="link-button"
          style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            padding: '8px 14px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          View Storage Policy
        </button>
        <button
          onClick={handleAccept}
          style={{
            background: 'var(--accent)',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Acknowledge
        </button>
      </div>
    </aside>
  )
}
