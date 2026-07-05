import React from 'react'

export default function BattlePanel({
  battleState,
  startBattle,
  bossIndex,
  bossHp,
  playerHp,
  battleTimer,
  battleVulnerability,
  battleFeedback,
  battleScore,
  shakePlayer,
  hitBoss,
  BOSS_LIST,
  GESTURE_INFO,
}) {
  const currentBoss = BOSS_LIST[bossIndex]

  return (
    <div>
      {battleState === 'ready' && (
        <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 52 }}>⚔️</div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Shadow Battle Quest</h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: 500, lineHeight: 1.6, fontSize: 14 }}>
            Embark on a mystic trial! Cast spells by copying the vulnerability shadow signs to defeat 3 monstrous shadow beasts before they attack!
          </p>
          <button 
            onClick={startBattle} 
            style={{
              padding: '12px 32px',
              borderRadius: 12,
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
              color: 'var(--text)',
              fontSize: 16,
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
            }}
          >
            Enter Shadow Realm
          </button>
        </div>
      )}

      {battleState === 'playing' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }} className={shakePlayer ? 'combat-shake' : ''}>
          {/* Battle Arena HUD */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 13,
            color: 'var(--text-dim)'
          }}>
            <span>QUEST STAGE {bossIndex + 1}/3</span>
            <span style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>SCORE: {battleScore}</span>
          </div>

          {/* Monster Area */}
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
            {/* Boss Card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div 
                className={hitBoss ? 'combat-hit' : ''}
                style={{ 
                  fontSize: 60, 
                  borderRadius: 12,
                  width: 80, height: 80,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.02)',
                  border: `2px solid ${currentBoss.color}44`
                }}
              >
                {currentBoss.emoji}
              </div>
              <div>
                <h3 style={{ fontSize: 18, color: currentBoss.color }}>{currentBoss.name}</h3>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  HP: {bossHp} / {currentBoss.maxHp}
                </div>
                {/* HP Bar */}
                <div style={{ width: 150, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${(bossHp / currentBoss.maxHp) * 100}%`, 
                    background: currentBoss.color,
                    transition: 'width 0.2s ease-out' 
                  }} />
                </div>
              </div>
            </div>

            {/* Action Prompt */}
            <div style={{ 
              textAlign: 'center',
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 12,
              border: '1px solid var(--border)',
              minWidth: 160
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Vulnerable to</div>
              <div style={{ fontSize: 24 }}>{GESTURE_INFO[battleVulnerability]?.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: GESTURE_INFO[battleVulnerability]?.color }}>
                {GESTURE_INFO[battleVulnerability]?.label}
              </div>
            </div>

            {/* Countdown Timer */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>BOSS ATTACK</div>
              <div style={{ 
                fontSize: 32, 
                fontFamily: 'var(--font-title)', 
                color: battleTimer <= 2 ? 'var(--accent-pink)' : 'var(--text)' 
              }}>
                {battleTimer}s
              </div>
            </div>
          </div>

          {/* Player HUD */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.02)',
            padding: 14,
            borderRadius: 12,
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>🛡️</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>PLAYER SHIELD</div>
                <div style={{ width: 140, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${playerHp}%`, 
                    background: 'var(--accent-cyan)',
                    transition: 'width 0.3s ease-out' 
                  }} />
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', fontStyle: 'italic' }}>
              {battleFeedback}
            </div>
          </div>
        </div>
      )}

      {/* Quest Victory Screen */}
      {battleState === 'victory' && (
        <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 60 }}>👑</div>
          <h2 style={{ fontSize: 28, color: 'var(--accent-cyan)' }}>Quest Cleared!</h2>
          <p style={{ color: 'var(--text-dim)' }}>You successfully banished the shadow beasts!</p>
          <div style={{ fontSize: 36, fontFamily: 'var(--font-title)', color: 'var(--accent-purple)' }}>
            {battleScore} PTS
          </div>
          <button 
            onClick={startBattle} 
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

      {/* Game Over Screen */}
      {battleState === 'gameover' && (
        <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 60 }}>💀</div>
          <h2 style={{ fontSize: 28, color: 'var(--accent-pink)' }}>Defeated</h2>
          <p style={{ color: 'var(--text-dim)' }}>The boss shadow defeated your ward shields.</p>
          <div style={{ fontSize: 20 }}>Final Score: {battleScore} PTS</div>
          <button 
            onClick={startBattle} 
            style={{
              padding: '12px 28px',
              borderRadius: 10,
              fontWeight: 600,
              background: 'var(--surface-hover)',
              border: '1px solid var(--border-glow)',
              color: 'var(--text)'
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
