import React from 'react'
import { TimerIcon, TrophyIcon, WarningIcon } from './Icons'

export default function SpeedrunPanel({
  speedState,
  startSpeedrun,
  speedTimer,
  speedScore,
  speedStreak,
  speedTarget,
  speedFeedback,
  GESTURE_INFO,
}) {
  return (
    <div style={{ transformStyle: 'preserve-3d' }}>
      {speedState === 'ready' && (
        <div style={{ textAlign: 'center', padding: '36px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 4,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderTop: '1px solid var(--border-light)',
            boxShadow: '0 4px 0 var(--border-dark), 0 8px 16px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-orange)'
          }}>
            <TimerIcon size={26} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            Chronograph Time Attack
          </h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: 500, lineHeight: 1.6, fontSize: 14, margin: 0 }}>
            Execute consecutive hand formations under clock pressure. 30 seconds initial runway. Valid detections grant combo multiplier points and +2s bonus extension.
          </p>
          <button 
            type="button"
            onClick={startSpeedrun} 
            className="btn btn-primary"
            style={{ padding: '12px 28px', fontSize: 14 }}
          >
            Start Chronograph
          </button>
        </div>
      )}

      {speedState === 'playing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 3D HUD Deck */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--text-muted)',
            padding: '4px 8px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 3,
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
          }}>
            <span>OPTICAL STREAK: {speedStreak}X MULTIPLIER</span>
            <span style={{ color: 'var(--accent-orange)' }}>SCORE: {speedScore} PTS</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}>
            {/* 3D Timer Gauge Card */}
            <div className="card-3d" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>
                <span>REMAINING INTERVAL</span>
                <span style={{ color: speedTimer <= 8 ? 'var(--accent-red)' : 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
                  {speedTimer}s
                </span>
              </div>
              <div className="meter-3d">
                <div 
                  className="meter-3d-fill"
                  style={{
                    width: `${(speedTimer / 30) * 100}%`,
                    background: speedTimer <= 8 ? 'var(--accent-red)' : 'var(--accent-orange)',
                    boxShadow: speedTimer <= 8 ? '0 0 8px rgba(239, 68, 68, 0.7)' : '0 0 8px rgba(217, 119, 6, 0.7)',
                  }}
                />
              </div>
            </div>

            {/* 3D Target Gesture Plaque */}
            <div className="card-3d" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Form Target Formation
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-orange)', marginTop: 4 }}>
                {GESTURE_INFO[speedTarget]?.label || 'Loading...'}
              </div>
            </div>
          </div>

          {/* Feedback Ticker */}
          {speedFeedback && (
            <div style={{
              fontSize: 12,
              color: 'var(--text)',
              textAlign: 'center',
              padding: '6px 12px',
              background: 'rgba(217, 119, 6, 0.08)',
              border: '1px solid rgba(217, 119, 6, 0.2)',
              borderRadius: 3,
            }}>
              {speedFeedback}
            </div>
          )}
        </div>
      )}

      {speedState === 'gameover' && (
        <div style={{ textAlign: 'center', padding: '36px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 4,
            background: 'rgba(217, 119, 6, 0.15)',
            border: '1px solid var(--accent-orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-orange)',
          }}>
            <TrophyIcon size={24} />
          </div>
          <h3 style={{ fontSize: 20, color: 'var(--text)', margin: 0 }}>Interval Elapsed</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, margin: 0 }}>
            Session finalized. Total score: <strong>{speedScore} points</strong> ({speedStreak}x peak streak).
          </p>
          <button 
            type="button"
            onClick={startSpeedrun} 
            className="btn btn-primary"
            style={{ marginTop: 8 }}
          >
            Retry Time Attack
          </button>
        </div>
      )}
    </div>
  )
}
