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
    <div>
      {battleState === 'ready' && (
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
            <QuestIcon size={24} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Shadow Quest Challenge</h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: 520, lineHeight: 1.6, fontSize: 14 }}>
            Test your hand gesture speed across three progressive rounds. Form the requested shadow silhouette before each attack countdown expires.
          </p>
          <button 
            onClick={startBattle} 
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
            Start Challenge
          </button>
        </div>
      )}

      {battleState === 'playing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className={shakePlayer ? 'combat-shake' : ''}>
          {/* Battle Arena HUD */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 13,
            color: 'var(--text-muted)'
          }}>
            <span style={{ fontWeight: 600 }}>Round {bossIndex + 1} of 3</span>
            <span style={{ color: 'var(--text)', fontWeight: 700 }}>Score: {battleScore}</span>
          </div>

          {/* Monster Area */}
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
            {/* Boss Card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, color: 'var(--text)' }}>{currentBoss.name}</h3>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Opponent HP: {bossHp} / {currentBoss.maxHp}
                </div>
                {/* HP Bar */}
                <div style={{ width: 140, height: 6, background: 'var(--border)', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${(bossHp / currentBoss.maxHp) * 100}%`, 
                    background: 'var(--accent-red)',
                    transition: 'width 0.2s ease-out' 
                  }} />
                </div>
              </div>
            </div>

            {/* Action Prompt */}
            <div style={{ 
              textAlign: 'center',
              padding: '10px 16px',
              background: 'var(--bg)',
              borderRadius: 4,
              border: '1px solid var(--border)',
              minWidth: 160
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Sign</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-gold)', marginTop: 2 }}>
                {GESTURE_INFO[battleVulnerability]?.label}
              </div>
            </div>

            {/* Countdown Timer */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Remaining</div>
              <div style={{ 
                fontSize: 28, 
                fontWeight: 700,
                color: battleTimer <= 2 ? 'var(--accent-red)' : 'var(--text)' 
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
            background: 'var(--surface)',
            padding: 12,
            borderRadius: 4,
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldIcon size={18} color="var(--accent)" />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>Player Health: {playerHp}%</div>
                <div style={{ width: 140, height: 6, background: 'var(--border)', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${playerHp}%`, 
                    background: 'var(--accent-green)',
                    transition: 'width 0.3s ease-out' 
                  }} />
                </div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {battleFeedback}
            </div>
          </div>
        </div>
      )}

      {/* Quest Victory Screen */}
      {battleState === 'victory' && (
        <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <TrophyIcon size={40} color="var(--accent-gold)" />
          <h2 style={{ fontSize: 24, color: 'var(--text)' }}>Challenge Completed</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>All three rounds cleared successfully.</p>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)' }}>
            Score: {battleScore}
          </div>
          <button 
            onClick={startBattle} 
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

      {/* Game Over Screen */}
      {battleState === 'gameover' && (
        <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <WarningIcon size={40} color="var(--accent-red)" />
          <h2 style={{ fontSize: 24, color: 'var(--text)' }}>Round Failed</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Player health depleted before completing the sequence.</p>
          <div style={{ fontSize: 20, color: 'var(--text)' }}>Final Score: {battleScore}</div>
          <button 
            onClick={startBattle} 
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
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
