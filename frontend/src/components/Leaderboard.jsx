import React, { useState, useEffect } from 'react'
import { getLeaderboard } from '../utils/api'
import { TrophyIcon, RefreshIcon } from './Icons'

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
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrophyIcon size={20} color="var(--accent-gold)" />
          <h2 style={{ fontSize: 20, color: 'var(--text)' }}>Leaderboard Records</h2>
        </div>
        <button 
          onClick={fetchScores} 
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            fontSize: 12,
          }}
          aria-label="Refresh leaderboard scores"
        >
          <RefreshIcon size={14} />
          <span>{loading ? 'Fetching...' : 'Refresh'}</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)', fontSize: 14 }}>
          Retrieving leaderboard records...
        </div>
      ) : scores.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 16px', border: '1px dashed var(--border)', borderRadius: 4 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            No scores registered yet. Complete a Time Attack or Shadow Quest challenge to rank.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {scores.map((entry, i) => {
            const isMe = entry.guestId === guestId
            return (
              <div 
                key={entry.guestId || i} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 4,
                  background: isMe ? 'var(--surface-hover)' : 'var(--surface)',
                  border: '1px solid',
                  borderColor: isMe ? 'var(--border-focus)' : 'var(--border)',
                }}
              >
                <span style={{ 
                  fontSize: 13, 
                  fontWeight: 700, 
                  width: 28, 
                  color: i < 3 ? 'var(--accent-gold)' : 'var(--text-muted)' 
                }}>
                  #{i + 1}
                </span>
                <span style={{
                  flex: 1, 
                  fontSize: 13,
                  color: isMe ? 'var(--text)' : 'var(--text-dim)',
                  fontWeight: isMe ? 700 : 500,
                  fontFamily: 'var(--font-mono)'
                }}>
                  {isMe ? 'You (Current Session)' : `Player #${entry.guestId?.slice(-4).toUpperCase() || 'ANON'}`}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', 
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--text)',
                }}>
                  {entry.totalScore ?? entry.score ?? 0} pts
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
