import React, { useState } from 'react'
import { PracticeIcon, QuestIcon, TimerIcon, CloseIcon } from './Icons'

export default function PlaySetupModal({ isOpen, onClose, onStartGame }) {
  const [mode, setMode] = useState('free') // free | battle | speedrun
  const [category, setCategory] = useState('animals') // animals | things | all

  if (!isOpen) return null

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 7, 12, 0.82)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
        perspective: 1200,
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '30px',
          position: 'relative',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '4px solid var(--border-dark)',
          borderRadius: 6,
          boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.95), 0 8px 24px rgba(0,0,0,0.6)',
          transform: 'translateZ(40px)',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          aria-label="Close configuration modal"
          className="btn btn-secondary"
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            padding: 6,
            width: 32,
            height: 32,
          }}
        >
          <CloseIcon size={14} />
        </button>

        <h2 
          id="modal-title"
          style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: 'var(--text)',
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}
        >
          Configure Optical Session
        </h2>

        {/* STEP 1: SELECT MODE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            1. Select Session Mode
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {/* Mode Option: Free Play */}
            <button
              type="button"
              onClick={() => setMode('free')}
              style={{
                border: `1px solid ${mode === 'free' ? 'var(--accent-orange)' : 'var(--border)'}`,
                borderTop: `1px solid ${mode === 'free' ? 'var(--accent-gold)' : 'var(--border-light)'}`,
                borderBottom: `3px solid ${mode === 'free' ? '#8c4c06' : 'var(--border-dark)'}`,
                background: mode === 'free' ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg)',
                padding: '16px 12px',
                borderRadius: 4,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                boxShadow: mode === 'free' 
                  ? '0 6px 16px rgba(217, 119, 6, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)' 
                  : '0 3px 0 var(--border-dark), 0 4px 8px rgba(0,0,0,0.3)',
                transform: mode === 'free' ? 'translateY(-2px)' : 'none',
                transition: 'all 0.1s ease',
              }}
            >
              <div style={{ color: mode === 'free' ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                <PracticeIcon size={22} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Free Practice</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3 }}>Untimed training & geometric classification.</span>
            </button>

            {/* Mode Option: Shadow Quest */}
            <button
              type="button"
              onClick={() => setMode('battle')}
              style={{
                border: `1px solid ${mode === 'battle' ? 'var(--accent-orange)' : 'var(--border)'}`,
                borderTop: `1px solid ${mode === 'battle' ? 'var(--accent-gold)' : 'var(--border-light)'}`,
                borderBottom: `3px solid ${mode === 'battle' ? '#8c4c06' : 'var(--border-dark)'}`,
                background: mode === 'battle' ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg)',
                padding: '16px 12px',
                borderRadius: 4,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                boxShadow: mode === 'battle' 
                  ? '0 6px 16px rgba(217, 119, 6, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)' 
                  : '0 3px 0 var(--border-dark), 0 4px 8px rgba(0,0,0,0.3)',
                transform: mode === 'battle' ? 'translateY(-2px)' : 'none',
                transition: 'all 0.1s ease',
              }}
            >
              <div style={{ color: mode === 'battle' ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                <QuestIcon size={22} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Shadow Quest</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3 }}>Match signs against adversarial patterns.</span>
            </button>

            {/* Mode Option: Time Attack */}
            <button
              type="button"
              onClick={() => setMode('speedrun')}
              style={{
                border: `1px solid ${mode === 'speedrun' ? 'var(--accent-orange)' : 'var(--border)'}`,
                borderTop: `1px solid ${mode === 'speedrun' ? 'var(--accent-gold)' : 'var(--border-light)'}`,
                borderBottom: `3px solid ${mode === 'speedrun' ? '#8c4c06' : 'var(--border-dark)'}`,
                background: mode === 'speedrun' ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg)',
                padding: '16px 12px',
                borderRadius: 4,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                boxShadow: mode === 'speedrun' 
                  ? '0 6px 16px rgba(217, 119, 6, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)' 
                  : '0 3px 0 var(--border-dark), 0 4px 8px rgba(0,0,0,0.3)',
                transform: mode === 'speedrun' ? 'translateY(-2px)' : 'none',
                transition: 'all 0.1s ease',
              }}
            >
              <div style={{ color: mode === 'speedrun' ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                <TimerIcon size={22} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Time Attack</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3 }}>Fast sign sequence with streak bonuses.</span>
            </button>
          </div>
        </div>

        {/* STEP 2: SELECT CATEGORY ROCKER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            2. Select Gesture Library
          </span>
          <div className="rocker-switch">
            <button 
              type="button"
              onClick={() => setCategory('animals')}
              className={`rocker-button ${category === 'animals' ? 'active' : ''}`}
            >
              Animals
            </button>
            <button 
              type="button"
              onClick={() => setCategory('things')}
              className={`rocker-button ${category === 'things' ? 'active' : ''}`}
            >
              Objects
            </button>
            <button 
              type="button"
              onClick={() => setCategory('all')}
              className={`rocker-button ${category === 'all' ? 'active' : ''}`}
            >
              All Gestures
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '12px' }}
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={() => onStartGame({ mode, category })}
            className="btn btn-primary"
            style={{ flex: 2, padding: '12px', fontSize: 14 }}
          >
            Start Session
          </button>
        </div>
      </div>
    </div>
  )
}
