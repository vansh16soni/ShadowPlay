import React, { useState } from 'react'

export default function PlaySetupModal({ isOpen, onClose, onStartGame }) {
  const [mode, setMode] = useState('free') // free | battle | speedrun
  const [category, setCategory] = useState('animals') // animals | things | all

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 3, 8, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.25s ease-out',
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '560px',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'rgba(255,255,255,0.03)',
            color: 'var(--text-dim)',
            border: '1px solid var(--border)',
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent-pink)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-dim)'
          }}
        >
          ✕
        </button>

        <h2 style={{ 
          fontSize: 26, 
          fontFamily: 'var(--font-title)', 
          textAlign: 'center',
          color: 'var(--text)',
          marginBottom: 24,
          background: 'linear-gradient(90deg, var(--accent-orange), var(--accent-gold))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🎮 Configure Play Options
        </h2>

        {/* STEP 1: SELECT GAME MODE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em' }}>1. CHOOSE YOUR CHALLENGE</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {/* Mode Option: Free Play */}
            <div 
              onClick={() => setMode('free')}
              style={{
                border: `1px solid ${mode === 'free' ? 'var(--accent-cyan)' : 'var(--border)'}`,
                background: mode === 'free' ? 'rgba(6, 182, 212, 0.08)' : 'rgba(255,255,255,0.01)',
                padding: '12px 8px',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: mode === 'free' ? '0 0 15px rgba(6, 182, 212, 0.15)' : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>🧘</div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: mode === 'free' ? 'var(--accent-cyan)' : 'var(--text)' }}>Free Practice</h4>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.3 }}>Learn and explore gestures without clock pressure.</p>
            </div>

            {/* Mode Option: Shadow Quest */}
            <div 
              onClick={() => setMode('battle')}
              style={{
                border: `1px solid ${mode === 'battle' ? 'var(--accent-purple)' : 'var(--border)'}`,
                background: mode === 'battle' ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255,255,255,0.01)',
                padding: '12px 8px',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: mode === 'battle' ? '0 0 15px rgba(139, 92, 246, 0.15)' : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>⚔️</div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: mode === 'battle' ? 'var(--accent-purple)' : 'var(--text)' }}>Shadow Quest</h4>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.3 }}>Defeat shadow beasts using vulnerabilities.</p>
            </div>

            {/* Mode Option: Time Attack */}
            <div 
              onClick={() => setMode('speedrun')}
              style={{
                border: `1px solid ${mode === 'speedrun' ? 'var(--accent-pink)' : 'var(--border)'}`,
                background: mode === 'speedrun' ? 'rgba(236, 72, 153, 0.08)' : 'rgba(255,255,255,0.01)',
                padding: '12px 8px',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: mode === 'speedrun' ? '0 0 15px rgba(236, 72, 153, 0.15)' : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>⏱</div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: mode === 'speedrun' ? 'var(--accent-pink)' : 'var(--text)' }}>Time Attack</h4>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.3 }}>Copy signs to build streak and add seconds.</p>
            </div>
          </div>
        </div>

        {/* STEP 2: SELECT CATEGORY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em' }}>2. SELECT GESTURE CATEGORY</span>
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 4,
            gap: 4
          }}>
            <button 
              onClick={() => setCategory('animals')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: category === 'animals' ? 'var(--accent-orange)' : 'transparent',
                color: category === 'animals' ? '#fff' : 'var(--text-dim)',
                transition: 'all 0.2s ease',
              }}
            >
              🐕 Animals
            </button>
            <button 
              onClick={() => setCategory('things')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: category === 'things' ? 'var(--accent-orange)' : 'transparent',
                color: category === 'things' ? '#fff' : 'var(--text-dim)',
                transition: 'all 0.2s ease',
              }}
            >
              ⚙️ Things
            </button>
            <button 
              onClick={() => setCategory('all')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: category === 'all' ? 'var(--accent-orange)' : 'transparent',
                color: category === 'all' ? '#fff' : 'var(--text-dim)',
                transition: 'all 0.2s ease',
              }}
            >
              🌀 All Combined
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => onStartGame({ mode, category })}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            fontWeight: 700,
            background: mode === 'free'
              ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))'
              : mode === 'battle'
                ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))'
                : 'linear-gradient(135deg, var(--accent-pink), var(--accent-orange))',
            color: mode === 'free' ? '#000' : 'var(--text)',
            fontSize: 16,
            boxShadow: mode === 'free'
              ? '0 4px 20px rgba(6, 182, 212, 0.4)'
              : mode === 'battle'
                ? '0 4px 20px rgba(139, 92, 246, 0.4)'
                : '0 4px 20px rgba(236, 72, 153, 0.4)',
            transition: 'all 0.2s',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none'
          }}
        >
          Begin Shadow Trial 🔥
        </button>
      </div>
    </div>
  )
}
