import React from 'react'
import { TimerIcon, TrophyIcon } from './Icons'

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
    <div>
      {speedState === 'ready' && (
        <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 4,
            background: 'var(--surface-hover)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)'
          }}>
            <TimerIcon size={24} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Time Attack Mode</h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: 500, lineHeight: 1.6, fontSize: 14 }}>
            Test rapid finger dexterity. You have 30 seconds to replicate as many requested silhouettes as possible. Each valid match adds points and extends the timer by 2 seconds.
          </p>
          <button 
            onClick={startSpeedrun} 
            style={{
              padding: '10px 24px',
              borderRadius: 4,
              fontWeight: 600,
              background: 'var(--accent)',
              color: '#ffffff',
              fontSize: 14,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Start Time Attack
          </button>
        </div>
      )}

      {speedState === 'playing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 13,
            color: 'var(--text-muted)'
          }}>
            <span style={{ fontWeight: 600 }}>Active Session</span>
            <span style={{ color: 'var(--text)', fontWeight: 700 }}>Score: {speedScore}</span>
          </div>

          {/* Speedrun HUD */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            alignItems: 'center',
            background: 'var(--surface)',
            padding: 16,
            borderRadius: 4,
            border: '1px solid var(--border)',
            justifyContent: 'space-between'
          }}>
            {/* Timer Bar */}
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                <span>Remaining Time</span>
                <span style={{ fontWeight: 700, color: 'var(--text)' }}>{speedTimer}s</span>
              </div>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${(speedTimer / 30) * 100}%`, 
                  background: speedTimer <= 8 ? 'var(--accent-red)' : 'var(--accent)',
                  transition: 'width 1s linear'
                }} />
              </div>
            </div>

            {/* Streak */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Consecutive Streak</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{speedStreak}x</div>
            </div>

            {/* Target Gesture */}
            <div style={{ 
              textAlign: 'center',
              padding: '10px 18px',
              background: 'var(--bg)',
              borderRadius: 4,
              border: '1px solid var(--border)',
              minWidth: 160
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Gesture</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-gold)', marginTop: 2 }}>
                {GESTURE_INFO[speedTarget]?.label}
              </div>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--text-muted)',
            minHeight: 20
          }}>
            {speedFeedback}
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {speedState === 'gameover' && (
        <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <TrophyIcon size={40} color="var(--accent-gold)" />
          <h2 style={{ fontSize: 24, color: 'var(--text)' }}>Time Attack Finished</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Session concluded.</p>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)' }}>
            Final Score: {speedScore}
          </div>
          <button 
            onClick={startSpeedrun} 
            style={{
              padding: '10px 24px',
              borderRadius: 4,
              fontWeight: 600,
              background: 'var(--accent)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}
