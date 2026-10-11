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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%', perspective: 1000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 3,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderTop: '1px solid var(--border-light)',
            boxShadow: '0 2px 0 var(--border-dark), 0 4px 8px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TrophyIcon size={18} color="var(--accent-orange)" />
          </div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', margin: 0, fontWeight: 700 }}>
            Global Operative Registry
          </h2>
        </div>
        <button 
          type="button"
          onClick={fetchScores} 
          disabled={loading}
          className="btn btn-secondary"
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
          <span>{loading ? 'Polling...' : 'Refresh'}</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)', fontSize: 13 }}>
          Polling optical records from registry...
        </div>
      ) : scores.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '36px 16px', border: '1px dashed var(--border)', borderRadius: 4, background: 'var(--bg)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>
            No scores registered yet. Complete a Time Attack or Shadow Quest challenge to rank.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {scores.map((entry, i) => {
            const isMe = entry.guestId === guestId
            const isTop3 = i < 3
            return (
              <div 
                key={entry.guestId || i} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  borderRadius: 4,
                  background: isMe ? 'var(--surface-hover)' : 'var(--surface)',
                  border: '1px solid',
                  borderColor: isMe ? 'var(--accent-orange)' : 'var(--border)',
                  borderTopColor: isMe ? 'var(--accent-orange)' : 'var(--border-light)',
                  borderBottomColor: 'var(--border-dark)',
                  borderLeft: isTop3 ? '4px solid var(--accent-orange)' : '1px solid var(--border)',
                  boxShadow: '0 3px 0 var(--border-dark), 0 4px 8px rgba(0,0,0,0.3)',
                  transition: 'transform 0.08s ease',
                }}
              >
                <span style={{ 
                  fontSize: 14, 
                  fontWeight: 800, 
                  width: 32, 
                  color: isTop3 ? 'var(--accent-orange)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
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
                  {isMe ? 'OPERATIVE (CURRENT SESSION)' : `OPERATIVE #${entry.guestId?.slice(-4).toUpperCase() || 'ANON'}`}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', 
                  fontSize: 16,
                  fontWeight: 800,
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
