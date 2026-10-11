import React from 'react'
import { QuestIcon, ShieldIcon, TrophyIcon, WarningIcon } from './Icons'

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
    <div style={{ transformStyle: 'preserve-3d' }}>
      {battleState === 'ready' && (
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
            <QuestIcon size={26} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            Shadow Quest Arena
          </h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: 520, lineHeight: 1.6, fontSize: 14, margin: 0 }}>
            Adversarial pattern trial across three progressive rounds. Cast the requested counter-silhouette before each optical timer interval expires.
          </p>
          <button 
            type="button"
            onClick={startBattle} 
            className="btn btn-primary"
            style={{ padding: '12px 28px', fontSize: 14 }}
          >
            Engage Quest
          </button>
        </div>
      )}

      {battleState === 'playing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 3D Round Telemetry Strip */}
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
            <span>ROUND {bossIndex + 1} OF 3</span>
            <span style={{ color: 'var(--accent-orange)' }}>SCORE: {battleScore} PTS</span>
          </div>

          {/* 3D Combatant Deck */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}>
            {/* Opponent Card (3D Extruded) */}
            <div 
              className="card-3d" 
              style={{ 
                padding: 16,
                transform: hitBoss ? 'scale(0.98) translateZ(-4px)' : 'none',
                borderColor: hitBoss ? 'var(--accent-orange)' : 'var(--border)',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{currentBoss.name}</span>
                <span style={{ fontSize: 11, color: 'var(--accent-red)', fontWeight: 700 }}>
                  {bossHp} / {currentBoss.maxHp} HP
                </span>
              </div>
              <div className="meter-3d">
                <div 
                  className="meter-3d-fill"
                  style={{
                    width: `${(bossHp / currentBoss.maxHp) * 100}%`,
                    background: 'var(--accent-red)',
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
                  }}
                />
              </div>
            </div>

            {/* Player Card (3D Extruded) */}
            <div 
              className="card-3d" 
              style={{ 
                padding: 16,
                transform: shakePlayer ? 'translateX(4px)' : 'none',
                borderColor: shakePlayer ? 'var(--accent-red)' : 'var(--border)',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Optical Operative</span>
                <span style={{ fontSize: 11, color: 'var(--accent-green)', fontWeight: 700 }}>
                  {playerHp} / 100 HP
                </span>
              </div>
              <div className="meter-3d">
                <div 
                  className="meter-3d-fill"
                  style={{
                    width: `${playerHp}%`,
                    background: 'var(--accent-green)',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 3D Action Guidance Plaque */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderTop: '1px solid var(--border-light)',
            borderBottom: '2px solid var(--border-dark)',
            borderRadius: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Required Counter-Sign
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-orange)', marginTop: 2 }}>
                {GESTURE_INFO[battleVulnerability]?.label}
              </div>
            </div>

            {/* Countdown Bezel */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 3,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
            }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>TIME REMAINING:</span>
              <span style={{
                fontSize: 16,
                fontWeight: 800,
                color: battleTimer <= 2 ? 'var(--accent-red)' : 'var(--text)',
                fontFamily: 'var(--font-mono)',
              }}>
                {battleTimer}s
              </span>
            </div>
          </div>

          {/* Feedback ticker */}
          {battleFeedback && (
            <div style={{
              fontSize: 12,
              color: 'var(--text-dim)',
              textAlign: 'center',
              padding: '6px 12px',
              background: 'rgba(217, 119, 6, 0.08)',
              border: '1px solid rgba(217, 119, 6, 0.2)',
              borderRadius: 3,
            }}>
              {battleFeedback}
            </div>
          )}
        </div>
      )}

      {battleState === 'victory' && (
        <div style={{ textAlign: 'center', padding: '36px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 4,
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--accent-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-green)',
          }}>
            <TrophyIcon size={24} />
          </div>
          <h3 style={{ fontSize: 20, color: 'var(--accent-green)', margin: 0 }}>Trial Victorious</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, margin: 0 }}>
            All adversarial stages cleared. Final record: <strong>{battleScore} points</strong>.
          </p>
          <button 
            type="button"
            onClick={startBattle} 
            className="btn btn-primary"
            style={{ marginTop: 8 }}
          >
            Play Again
          </button>
        </div>
      )}

      {battleState === 'gameover' && (
        <div style={{ textAlign: 'center', padding: '36px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 4,
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--accent-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-red)',
          }}>
            <WarningIcon size={24} />
          </div>
          <h3 style={{ fontSize: 20, color: 'var(--accent-red)', margin: 0 }}>Session Terminated</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, margin: 0 }}>
            Health exhausted. Final Score: <strong>{battleScore} points</strong>.
          </p>
          <button 
            type="button"
            onClick={startBattle} 
            className="btn btn-primary"
            style={{ marginTop: 8 }}
          >
            Retry Challenge
          </button>
        </div>
      )}
    </div>
  )
}
