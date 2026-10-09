import React from 'react'
import { StudioIcon, GuideIcon, TrophyIcon, InfoIcon, ShieldIcon, FileTextIcon } from './Icons'

function SidebarButton({ active, onClick, icon: Icon, label }) {
  return (
    <button 
      onClick={onClick} 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        borderRadius: 4,
        fontSize: 13,
        fontWeight: 600,
        width: '100%',
        textAlign: 'left',
        border: '1px solid',
        borderColor: active ? 'var(--border-focus)' : 'transparent',
        background: active ? 'var(--surface-hover)' : 'transparent',
        color: active ? 'var(--text)' : 'var(--text-dim)',
      }}
    >
      <Icon size={16} color={active ? 'var(--accent)' : 'var(--text-muted)'} />
      <span>{label}</span>
    </button>
  )
}

export default function Sidebar({ activeTab, onNavigate }) {
  return (
    <nav 
      aria-label="Main Navigation"
      style={{
        flex: '0 0 220px',
        padding: '20px 12px',
        borderRight: '1px solid var(--border)',
        background: 'var(--sidebar-bg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 12px 6px', letterSpacing: '0.05em' }}>
        Studio
      </div>
      <SidebarButton active={activeTab === 'dashboard'} onClick={() => onNavigate('/')} icon={StudioIcon} label="Shadow Studio" />
      <SidebarButton active={activeTab === 'learn'} onClick={() => onNavigate('/guide')} icon={GuideIcon} label="Gesture Reference" />
      <SidebarButton active={activeTab === 'leaderboard'} onClick={() => onNavigate('/leaderboard')} icon={TrophyIcon} label="Leaderboards" />
      <SidebarButton active={activeTab === 'about'} onClick={() => onNavigate('/about')} icon={InfoIcon} label="How It Works" />

      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '16px 12px 6px', letterSpacing: '0.05em' }}>
        Compliance & Legal
      </div>
      <SidebarButton active={activeTab === 'privacy'} onClick={() => onNavigate('/privacy')} icon={ShieldIcon} label="Privacy Policy" />
      <SidebarButton active={activeTab === 'terms'} onClick={() => onNavigate('/terms')} icon={FileTextIcon} label="Terms of Service" />
      <SidebarButton active={activeTab === 'cookies'} onClick={() => onNavigate('/cookies')} icon={FileTextIcon} label="Cookie Policy" />
    </nav>
  )
}
