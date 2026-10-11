import React from 'react'
import { StudioIcon, GuideIcon, TrophyIcon, InfoIcon, ShieldIcon, FileTextIcon } from './Icons'

function SidebarButton({ active, onClick, icon: Icon, label }) {
  return (
    <button 
      type="button"
      onClick={onClick} 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        borderRadius: 4,
        fontSize: 13,
        fontWeight: 600,
        width: '100%',
        textAlign: 'left',
        border: '1px solid',
        borderColor: active ? 'var(--accent-orange)' : 'var(--border)',
        borderTopColor: active ? 'var(--accent-orange)' : 'var(--border-light)',
        borderBottomColor: active ? 'var(--border-dark)' : 'var(--border-dark)',
        background: active ? 'var(--surface-hover)' : 'var(--surface)',
        color: active ? 'var(--text)' : 'var(--text-dim)',
        boxShadow: active 
          ? 'inset 0 2px 4px rgba(0, 0, 0, 0.7), 0 1px 0 rgba(255,255,255,0.08)' 
          : '0 3px 0 var(--border-dark), 0 4px 8px rgba(0,0,0,0.3)',
        transform: active ? 'translateY(2px)' : 'none',
        transition: 'all 0.1s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon size={16} color={active ? 'var(--accent-orange)' : 'var(--text-muted)'} />
        <span>{label}</span>
      </div>

      {active && (
        <span 
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--accent-orange)',
            boxShadow: '0 0 8px rgba(217, 119, 6, 0.8)',
          }}
          aria-hidden="true"
        />
      )}
    </button>
  )
}

export default function Sidebar({ activeTab, onNavigate, user }) {
  return (
    <nav 
      aria-label="Main Navigation"
      style={{
        flex: '0 0 230px',
        padding: '24px 14px',
        borderRight: '2px solid var(--border-dark)',
        background: 'var(--sidebar-bg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        boxShadow: '6px 0 20px rgba(0, 0, 0, 0.45)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        padding: '0 8px 4px',
        letterSpacing: '0.08em',
      }}>
        Studio Deck
      </div>
      <SidebarButton active={activeTab === 'dashboard'} onClick={() => onNavigate('/')} icon={StudioIcon} label="Shadow Studio" />
      <SidebarButton active={activeTab === 'learn'} onClick={() => onNavigate('/guide')} icon={GuideIcon} label="Gesture Reference" />
      <SidebarButton active={activeTab === 'leaderboard'} onClick={() => onNavigate('/leaderboard')} icon={TrophyIcon} label="Leaderboards" />
      <SidebarButton active={activeTab === 'about'} onClick={() => onNavigate('/about')} icon={InfoIcon} label="How It Works" />

      <div style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        padding: '16px 8px 4px',
        letterSpacing: '0.08em',
      }}>
        Standards & Legal
      </div>
      <SidebarButton active={activeTab === 'privacy'} onClick={() => onNavigate('/privacy')} icon={ShieldIcon} label="Privacy Policy" />
      <SidebarButton active={activeTab === 'terms'} onClick={() => onNavigate('/terms')} icon={FileTextIcon} label="Terms of Service" />
      <SidebarButton active={activeTab === 'cookies'} onClick={() => onNavigate('/cookies')} icon={FileTextIcon} label="Cookie Policy" />

      {/* Admin Portal is strictly restricted to authenticated administrators */}
      {user && user.role === 'admin' && (
        <>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--accent-orange)',
            padding: '16px 8px 4px',
            letterSpacing: '0.08em',
          }}>
            Administration
          </div>
          <SidebarButton active={activeTab === 'admin'} onClick={() => onNavigate('/admin')} icon={ShieldIcon} label="Admin Portal" />
        </>
      )}
    </nav>
  )
}

