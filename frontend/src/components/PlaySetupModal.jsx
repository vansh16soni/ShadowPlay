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
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16
      }}
    >
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '28px',
          position: 'relative',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          aria-label="Close configuration modal"
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            width: 32,
            height: 32,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
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
            marginBottom: 20
          }}
        >
          Configure Practice Session
        </h2>

        {/* STEP 1: SELECT MODE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            1. Select Session Mode
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {/* Mode Option: Free Play */}
            <button
              type="button"
              onClick={() => setMode('free')}
              style={{
                border: `1px solid ${mode === 'free' ? 'var(--accent-orange)' : 'var(--border)'}`,
                background: mode === 'free' ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-card)',
                padding: '14px 10px',
                borderRadius: 4,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              <div style={{ color: mode === 'free' ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                <PracticeIcon size={20} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Free Practice</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3 }}>Untimed gesture training and recognition.</span>
            </button>

            {/* Mode Option: Shadow Quest */}
            <button
              type="button"
              onClick={() => setMode('battle')}
              style={{
                border: `1px solid ${mode === 'battle' ? 'var(--accent-orange)' : 'var(--border)'}`,
                background: mode === 'battle' ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-card)',
                padding: '14px 10px',
                borderRadius: 4,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              <div style={{ color: mode === 'battle' ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                <QuestIcon size={20} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Shadow Quest</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3 }}>Match signs against adversarial patterns.</span>
            </button>

            {/* Mode Option: Time Attack */}
            <button
              type="button"
              onClick={() => setMode('speedrun')}
              style={{
                border: `1px solid ${mode === 'speedrun' ? 'var(--accent-orange)' : 'var(--border)'}`,
                background: mode === 'speedrun' ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-card)',
                padding: '14px 10px',
                borderRadius: 4,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              <div style={{ color: mode === 'speedrun' ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                <TimerIcon size={20} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Time Attack</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3 }}>Rapid sign completion with streak bonuses.</span>
            </button>
          </div>
        </div>

        {/* STEP 2: SELECT CATEGORY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            2. Select Gesture Library
          </span>
          <div style={{
            display: 'flex',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            padding: 3,
            gap: 4
          }}>
            <button 
              type="button"
              onClick={() => setCategory('animals')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                background: category === 'animals' ? 'var(--accent-orange)' : 'transparent',
                color: category === 'animals' ? '#ffffff' : 'var(--text-dim)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Animals
            </button>
            <button 
              type="button"
              onClick={() => setCategory('things')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                background: category === 'things' ? 'var(--accent-orange)' : 'transparent',
                color: category === 'things' ? '#ffffff' : 'var(--text-dim)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Objects
            </button>
            <button 
              type="button"
              onClick={() => setCategory('all')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                background: category === 'all' ? 'var(--accent-orange)' : 'transparent',
                color: category === 'all' ? '#ffffff' : 'var(--text-dim)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              All Gestures
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={() => onStartGame({ mode, category })}
            className="btn btn-primary"
            style={{ flex: 2 }}
          >
            Start Session
          </button>
        </div>
      </div>
    </div>
  )
}
