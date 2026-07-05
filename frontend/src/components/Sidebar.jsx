import React from 'react'

function SidebarButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick} 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        width: '100%',
        textAlign: 'left',
        borderLeft: active ? '4px solid var(--accent-orange)' : '4px solid transparent',
        background: active ? 'linear-gradient(90deg, rgba(249, 115, 22, 0.08) 0%, transparent 100%)' : 'transparent',
        color: active ? 'var(--accent-orange)' : 'var(--text-dim)',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = 'var(--surface-hover)'
          e.currentTarget.style.color = 'var(--text)'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--text-dim)'
        }
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {label}
    </button>
  )
}

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <nav style={{
      flex: '0 0 240px',
      padding: '24px 16px',
      borderRight: '1px solid var(--border)',
      background: 'var(--sidebar-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <SidebarButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="🎮" label="Game Arcade" />
      <SidebarButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon="📖" label="Gesture Guide" />
      <SidebarButton active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} icon="🏆" label="Leaderboards" />
      <SidebarButton active={activeTab === 'about'} onClick={() => setActiveTab('about')} icon="ℹ️" label="How it Works" />
    </nav>
  )
}
