import { useState, useEffect, useCallback } from 'react'
import { getAdminUsers, getAdminUserSessions, toggleUserSuspension, getAdminHealth } from '../utils/api'

export default function AdminDashboard({ onClose, currentUser }) {
  const [users, setUsers] = useState([])
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [userSessions, setUserSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [actionInProgress, setActionInProgress] = useState(null)

  const loadData = useCallback(async () => {
    try {
      setError('')
      const [usersData, healthData] = await Promise.all([
        getAdminUsers(),
        getAdminHealth().catch(() => null),
      ])
      setUsers(Array.isArray(usersData) ? usersData : [])
      if (healthData) setHealth(healthData)
    } catch (err) {
      setError(err.message || 'Failed to communicate with administrative subsystem.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch and 10s real-time live sync polling
  useEffect(() => {
    loadData()
    const timer = setInterval(() => {
      loadData()
    }, 10000)
    return () => clearInterval(timer)
  }, [loadData])

  async function handleToggleSuspend(targetUser) {
    if (targetUser.role === 'admin') {
      alert('Administrative account cannot be suspended.')
      return
    }

    const nextState = !targetUser.isSuspended
    setActionInProgress(targetUser.guestId)

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.guestId === targetUser.guestId ? { ...u, isSuspended: nextState } : u))
    )

    try {
      await toggleUserSuspension(targetUser.guestId, nextState)
      await loadData()
    } catch (err) {
      // Rollback on error
      setUsers((prev) =>
        prev.map((u) => (u.guestId === targetUser.guestId ? { ...u, isSuspended: !nextState } : u))
      )
      alert(err.message || 'Failed to update operative state.')
    } finally {
      setActionInProgress(null)
    }
  }

  async function handleInspectUser(targetUser) {
    setSelectedUser(targetUser)
    setSessionsLoading(true)
    try {
      const data = await getAdminUserSessions(targetUser.guestId)
      setUserSessions(data.sessions || [])
    } catch (err) {
      alert(err.message || 'Failed to load session details.')
    } finally {
      setSessionsLoading(false)
    }
  }

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase()
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.guestId && u.guestId.toLowerCase().includes(q))
    )
  })

  const totalOperatives = users.length
  const suspendedCount = users.filter((u) => u.isSuspended).length
  const activeCount = totalOperatives - suspendedCount
  const totalRoundsPlayed = users.reduce((acc, u) => acc + (u.roundsPlayed || 0), 0)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        background: '#070a12',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'var(--font-family)',
      }}
    >
      {/* Top Console Navigation Bar */}
      <header
        style={{
          padding: '16px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          background: 'linear-gradient(180deg, #161c2a 0%, #0d121c 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', color: '#f59e0b', fontWeight: 800 }}>
              ROOT CONTROL FACILITY
            </div>
            <h1 style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em' }}>
              ADMINISTRATION PORTAL
            </h1>
          </div>
          <span
            style={{
              fontSize: '11px',
              padding: '5px 12px',
              borderRadius: '20px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              background: health?.database?.status === 'connected' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${health?.database?.status === 'connected' ? '#10b981' : '#ef4444'}`,
              color: health?.database?.status === 'connected' ? '#34d399' : '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: health?.database?.status === 'connected' ? '#10b981' : '#ef4444',
                boxShadow: health?.database?.status === 'connected' ? '0 0 8px #10b981' : '0 0 8px #ef4444',
              }}
            />
            ATLAS DB: {health?.database?.status ? health.database.status.toUpperCase() : 'CONNECTED'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="depth-button"
            style={{
              padding: '9px 18px',
              fontSize: '12px',
              fontWeight: 800,
              background: '#1c2436',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 3px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }} />
            {loading ? 'SYNCING...' : 'LIVE REFRESH'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="depth-button primary-depth"
            style={{
              padding: '9px 20px',
              fontSize: '12px',
              fontWeight: 900,
              background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #92400e, 0 6px 16px rgba(217, 119, 6, 0.4)',
              letterSpacing: '0.04em',
            }}
          >
            EXIT TO STUDIO
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
        {/* Overview Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              padding: '20px 22px',
              borderRadius: '14px',
              background: 'linear-gradient(165deg, #141b29 0%, #0c101a 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em' }}>TOTAL OPERATIVES</div>
            <div style={{ fontSize: '32px', fontWeight: 900, marginTop: '8px', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {totalOperatives}
            </div>
          </div>

          <div
            style={{
              padding: '20px 22px',
              borderRadius: '14px',
              background: 'linear-gradient(165deg, #141b29 0%, #0c101a 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em' }}>ACTIVE OPERATIVES</div>
            <div style={{ fontSize: '32px', fontWeight: 900, marginTop: '8px', color: '#34d399', textShadow: '0 0 16px rgba(16, 185, 129, 0.4)' }}>
              {activeCount}
            </div>
          </div>

          <div
            style={{
              padding: '20px 22px',
              borderRadius: '14px',
              background: 'linear-gradient(165deg, #141b29 0%, #0c101a 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em' }}>SUSPENDED ACCOUNTS</div>
            <div style={{ fontSize: '32px', fontWeight: 900, marginTop: '8px', color: suspendedCount > 0 ? '#f87171' : '#94a3b8' }}>
              {suspendedCount}
            </div>
          </div>

          <div
            style={{
              padding: '20px 22px',
              borderRadius: '14px',
              background: 'linear-gradient(165deg, #141b29 0%, #0c101a 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em' }}>ROUNDS RECORDED</div>
            <div style={{ fontSize: '32px', fontWeight: 900, marginTop: '8px', color: '#fbbf24', textShadow: '0 0 16px rgba(245, 158, 11, 0.3)' }}>
              {totalRoundsPlayed}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ padding: '14px 20px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '10px', color: '#fca5a5', marginBottom: '20px', fontSize: '13px', fontWeight: 700 }}>
            {error}
          </div>
        )}

        {/* Search Filter Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 900, margin: 0, letterSpacing: '0.04em', color: '#ffffff' }}>
              REGISTERED OPERATIVES ROSTER
            </h2>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Total operatives in database: {filteredUsers.length}
            </div>
          </div>

          <input
            type="text"
            placeholder="Search by operative name, email, or guest ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '11px 18px',
              width: '360px',
              maxWidth: '100%',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: '#090e18',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
            }}
          />
        </div>

        {/* Operatives Table Plate */}
        <div
          style={{
            background: 'linear-gradient(180deg, #101624 0%, #090d16 100%)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '14px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            overflowX: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.14)', background: '#131929', color: '#cbd5e1', fontSize: '11px', letterSpacing: '0.08em' }}>
                <th style={{ padding: '16px 20px' }}>OPERATIVE IDENTITY</th>
                <th style={{ padding: '16px 20px' }}>ROLE</th>
                <th style={{ padding: '16px 20px' }}>BEST SCORE</th>
                <th style={{ padding: '16px 20px' }}>ROUNDS PLAYED</th>
                <th style={{ padding: '16px 20px' }}>STATUS</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    No operatives found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => {
                  const isCurrentAdmin = u.role === 'admin'
                  return (
                    <tr
                      key={u.guestId}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        background: u.isSuspended ? 'rgba(239, 68, 68, 0.06)' : idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '14px' }}>
                          {u.name || 'Anonymous Guest'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>
                          {u.email || `GUEST ID: ${u.guestId.slice(0, 16)}...`}
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 900,
                            padding: '4px 10px',
                            borderRadius: '6px',
                            letterSpacing: '0.08em',
                            background: isCurrentAdmin ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                            color: isCurrentAdmin ? '#fbbf24' : '#cbd5e1',
                            border: `1px solid ${isCurrentAdmin ? '#f59e0b' : 'rgba(255, 255, 255, 0.18)'}`,
                          }}
                        >
                          {u.role ? u.role.toUpperCase() : 'USER'}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', fontWeight: 900, color: '#ffffff', fontSize: '14px' }}>
                        {u.totalScore || 0} PTS
                      </td>

                      <td style={{ padding: '16px 20px', fontWeight: 800, color: '#cbd5e1', fontSize: '14px' }}>
                        {u.roundsPlayed || 0}
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 900,
                            padding: '4px 12px',
                            borderRadius: '20px',
                            background: u.isSuspended ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            color: u.isSuspended ? '#f87171' : '#34d399',
                            border: `1px solid ${u.isSuspended ? '#ef4444' : '#10b981'}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: u.isSuspended ? '#ef4444' : '#10b981',
                            }}
                          />
                          {u.isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '10px' }}>
                          <button
                            type="button"
                            onClick={() => handleInspectUser(u)}
                            className="depth-button"
                            style={{
                              padding: '8px 14px',
                              fontSize: '11px',
                              fontWeight: 800,
                              background: '#1a2233',
                              border: '1px solid rgba(255, 255, 255, 0.25)',
                              borderRadius: '6px',
                              color: '#ffffff',
                              cursor: 'pointer',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            }}
                          >
                            INSPECT ROUNDS
                          </button>

                          {!isCurrentAdmin && (
                            <button
                              type="button"
                              onClick={() => handleToggleSuspend(u)}
                              disabled={actionInProgress === u.guestId}
                              className="depth-button"
                              style={{
                                padding: '8px 14px',
                                fontSize: '11px',
                                fontWeight: 900,
                                background: u.isSuspended ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                                border: `1px solid ${u.isSuspended ? '#10b981' : '#ef4444'}`,
                                color: u.isSuspended ? '#34d399' : '#f87171',
                                borderRadius: '6px',
                                cursor: 'pointer',
                              }}
                            >
                              {actionInProgress === u.guestId
                                ? 'UPDATING...'
                                : u.isSuspended
                                ? 'UNBLOCK'
                                : 'SUSPEND'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rounds / Sessions Detail Drawer */}
      {selectedUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9995,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedUser(null)
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '720px',
              maxHeight: '85vh',
              background: '#0d131f',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255,255,255,0.15)',
              overflow: 'hidden',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                background: '#131929',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#f59e0b', fontWeight: 800 }}>
                  OPERATIVE ROUNDS AUDIT
                </div>
                <h3 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                  {selectedUser.name || 'Anonymous Operative'}
                </h3>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {selectedUser.email || `GUEST ID: ${selectedUser.guestId}`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="depth-button"
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 800,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#cbd5e1',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                ESC
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {sessionsLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  Loading recorded sessions from database...
                </div>
              ) : userSessions.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  No challenge rounds recorded yet for this operative.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {userSessions.map((session, index) => (
                    <div
                      key={session.sessionId || index}
                      style={{
                        padding: '16px 20px',
                        background: '#131a29',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: 900, color: '#fbbf24' }}>
                            ROUND #{userSessions.length - index}
                          </span>
                          <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '12px' }}>
                            {session.startTime ? new Date(session.startTime).toLocaleString() : 'Recent'}
                          </span>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 900, color: '#34d399' }}>
                          SCORE: {session.finalScore || 0} PTS
                        </div>
                      </div>

                      {session.attempts && session.attempts.length > 0 && (
                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: '8px' }}>
                            VERIFIED ATTEMPTS ({session.attempts.length}):
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {session.attempts.map((att, i) => (
                              <span
                                key={i}
                                style={{
                                  fontSize: '11px',
                                  padding: '3px 10px',
                                  borderRadius: '6px',
                                  background: att.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                  border: `1px solid ${att.isCorrect ? '#10b981' : '#ef4444'}`,
                                  color: att.isCorrect ? '#34d399' : '#f87171',
                                  fontWeight: 800,
                                }}
                              >
                                {att.gesturePrompt.toUpperCase()} ({att.isCorrect ? 'MATCH' : 'MISS'})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
