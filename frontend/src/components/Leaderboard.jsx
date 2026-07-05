import { useState, useEffect } from 'react'
import { getLeaderboard } from '../utils/api'

export default function Leaderboard({ guestId }) {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchScores = () => {
    setLoading(true)
    getLeaderboard(10).then(data => {
      setScores(Array.isArray(data) ? data : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchScores()
  }, []) // eslint-disable-line

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 24, color: 'var(--accent-cyan)', fontFamily: 'var(--font-title)' }}>🏆 Global Leaders</h2>
        <button 
          onClick={fetchScores} 
          disabled={loading}
          style={{
            background: 'rgba(255,255,255,0.03)', 
            color: 'var(--text-dim)',
            padding: '6px 12px', 
            borderRadius: 8, 
            fontWeight: 600,
            fontSize: 12,
            border: '1px solid var(--border)',
          }}
        >
          {loading ? '...' : '↻ Refresh'}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>
          <div style={{ 
            fontSize: 24, 
            animation: 'spin 1s linear infinite', 
            display: 'inline-block',
            color: 'var(--accent-purple)'
          }}>⟳</div>
          <p style={{ marginTop: 12, fontSize: 13 }}>Retrieving high scores...</p>
        </div>
      ) : scores.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 36, opacity: 0.3 }}>🎮</div>
          <p style={{ color: 'var(--text-dim)', marginTop: 12, fontSize: 13 }}>
            No scores registered yet.<br />Play Speedrun or Quest Mode to claim #1!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {scores.map((entry, i) => {
            const isMe = entry.guestId === guestId
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px', 
                borderRadius: 12,
                background: isMe ? 'rgba(6, 182, 212, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                border: `1px solid ${isMe ? 'rgba(6, 182, 212, 0.25)' : 'var(--border)'}`,
                boxShadow: isMe ? '0 0 15px rgba(6, 182, 212, 0.1)' : 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                if (!isMe) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              onMouseLeave={e => {
                if (!isMe) e.currentTarget.style.borderColor = 'var(--border)'
              }}
              >
                <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>
                  {medals[i] || `#${i + 1}`}
                </span>
                <span style={{
                  flex: 1, 
                  fontSize: 14,
                  color: isMe ? 'var(--accent-cyan)' : 'var(--text)',
                  fontWeight: isMe ? 700 : 500,
                }}>
                  {isMe ? 'You (Current Player)' : `Player ${entry.guestId?.slice(-4).toUpperCase() || 'ANON'}`}
                </span>
                <span style={{
                  fontFamily: 'var(--font-title)', 
                  fontSize: 20,
                  fontWeight: 700,
                  color: i === 0 ? 'var(--accent-cyan)' : i === 1 ? 'var(--accent-purple)' : i === 2 ? 'var(--accent-pink)' : 'var(--text-dim)',
                  textShadow: i < 3 ? '0 0 10px rgba(255,255,255,0.05)' : 'none'
                }}>
                  {entry.totalScore ?? entry.score ?? 0}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
