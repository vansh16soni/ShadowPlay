import React from 'react'

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
        <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 52 }}>⏱</div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Time Attack (Speed Run)</h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: 500, lineHeight: 1.6, fontSize: 14 }}>
            Test your dexterity! You have 30 seconds to make as many correct shadows as possible. Correct signs yield points and add +2 seconds!
          </p>
          <button 
            onClick={startSpeedrun} 
            style={{
              padding: '12px 32px',
              borderRadius: 12,
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--accent-pink), var(--accent-orange))',
              color: 'var(--text)',
              fontSize: 16,
              boxShadow: '0 4px 20px rgba(236, 72, 153, 0.3)',
            }}
          >
            Start Speedrun
          </button>
        </div>
      )}

      {speedState === 'playing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 13,
            color: 'var(--text-dim)'
          }}>
            <span>SPEED RUN TIMER</span>
            <span style={{ color: 'var(--accent-pink)', fontWeight: 700 }}>SCORE: {speedScore}</span>
          </div>

          {/* Speedrun HUD */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            alignItems: 'center',
            background: 'rgba(0,0,0,0.2)',
            padding: 16,
            borderRadius: 16,
            border: '1px solid var(--border)',
            justifyContent: 'space-between'
          }}>
            {/* Timer Bar */}
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ display: 'flex', justifycontent: 'space-between', fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>
                <span>TIME LEFT:</span>
                <span style={{ fontWeight: 700 }}>{speedTimer}s</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${(speedTimer / 30) * 100}%`, 
                  background: speedTimer <= 8 ? 'var(--accent-pink)' : 'var(--accent-orange)',
                  transition: 'width 1s linear'
                }} />
              </div>
            </div>

            {/* Streak */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>COMBO STREAK</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-cyan)' }}>{speedStreak}x</div>
            </div>

            {/* Target Gesture */}
            <div style={{ 
              textAlign: 'center',
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 12,
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>MAKE THIS SIGN</div>
              <div style={{ fontSize: 26 }}>{GESTURE_INFO[speedTarget]?.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: GESTURE_INFO[speedTarget]?.color }}>
                {GESTURE_INFO[speedTarget]?.label}
              </div>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--text-dim)',
            fontStyle: 'italic'
          }}>
            {speedFeedback}
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {speedState === 'gameover' && (
        <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 60 }}>🎯</div>
          <h2 style={{ fontSize: 28, color: 'var(--accent-orange)' }}>Speedrun Finished!</h2>
          <p style={{ color: 'var(--text-dim)' }}>Excellent dexterity trial!</p>
          <div style={{ fontSize: 36, fontFamily: 'var(--font-title)', color: 'var(--accent-pink)' }}>
            {speedScore} PTS
          </div>
          <button 
            onClick={startSpeedrun} 
            style={{
              padding: '12px 28px',
              borderRadius: 10,
              fontWeight: 600,
              background: 'var(--surface-hover)',
              border: '1px solid var(--border-glow)',
              color: 'var(--text)'
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}
