import React from 'react'
import { PracticeIcon, QuestIcon, TimerIcon, ShieldIcon } from './Icons'

export default function SplashScreen({ onPlayClick }) {
  return (
    <div style={{
      position: 'relative',
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      maxWidth: 880,
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--text-dim)',
        marginBottom: 20
      }}>
        <ShieldIcon size={14} color="var(--accent-orange)" />
        <span>Client-side tracking | Zero remote video storage</span>
      </div>

      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.25rem)',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        lineHeight: 1.15,
        color: 'var(--text)',
        margin: '0 0 16px 0',
      }}>
        Browser Hand Shadow Puppet Studio
      </h1>

      <p style={{
        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
        color: 'var(--text-dim)',
        lineHeight: 1.6,
        margin: '0 0 28px 0',
        maxWidth: 620,
      }}>
        Real-time hand shadow puppetry powered by client-side computer vision.
        Position your hands in front of your camera to form recognized silhouettes in your browser.
      </p>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={onPlayClick}
          className="btn btn-primary"
          style={{ padding: '12px 28px', fontSize: 15 }}
        >
          Open Studio
        </button>
        <a
          href="/guide"
          onClick={(e) => {
            e.preventDefault()
            window.history.pushState({}, '', '/guide')
            window.dispatchEvent(new PopStateEvent('popstate'))
          }}
          className="btn btn-secondary"
          style={{ padding: '12px 24px', fontSize: 15, textDecoration: 'none' }}
        >
          View Gesture Library
        </a>
      </div>

      {/* Feature capabilities grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        marginTop: 48,
        width: '100%',
        textAlign: 'left'
      }}>
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ color: 'var(--accent-orange)', marginBottom: 10 }}>
            <PracticeIcon size={22} />
          </div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px 0' }}>
            Free Practice Mode
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', margin: 0, lineHeight: 1.5 }}>
            Learn 20 hand shapes at your own speed with live geometric classification.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ color: 'var(--accent-orange)', marginBottom: 10 }}>
            <QuestIcon size={22} />
          </div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px 0' }}>
            Adversarial Scenarios
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', margin: 0, lineHeight: 1.5 }}>
            Match counter-shadows under timed intervals to test manual dexterity and speed.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ color: 'var(--accent-orange)', marginBottom: 10 }}>
            <TimerIcon size={22} />
          </div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px 0' }}>
            Time Attack Challenges
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', margin: 0, lineHeight: 1.5 }}>
            Complete sequential hand formations to maintain score streaks and earn bonus seconds.
          </p>
        </div>
      </div>
    </div>
  )
}
