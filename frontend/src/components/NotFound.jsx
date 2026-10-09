import React from 'react'

export default function NotFound({ onNavigate }) {
  return (
    <main style={{ maxWidth: 600, margin: '80px auto', padding: '32px 16px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 40, color: 'var(--text)', marginBottom: 12 }}>404: Page Not Found</h1>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 28 }}>
        The requested path does not exist or has moved. Return to the main hand shadow puppet studio below.
      </p>
      <button
        onClick={() => onNavigate('/')}
        style={{
          background: 'var(--accent)',
          color: '#ffffff',
          padding: '10px 24px',
          borderRadius: 4,
          fontSize: 14,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Return to Studio
      </button>
    </main>
  )
}
