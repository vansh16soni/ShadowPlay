import React, { useState } from 'react'

export default function PrivacyPolicy({ onNavigate }) {
  const [cleared, setCleared] = useState(false)

  const handleClearData = () => {
    try {
      localStorage.removeItem('shadowplay_guest_id')
      localStorage.removeItem('shadowplay_scores')
      localStorage.removeItem('shadowplay_theme')
      localStorage.removeItem('shadowplay_cookie_consent')
      setCleared(true)
      setTimeout(() => {
        window.location.reload()
      }, 1200)
    } catch (e) {
      // ignore
    }
  }

  return (
    <article className="legal-article" style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      <nav aria-label="Breadcrumb" style={{ marginBottom: 20, fontSize: 13, color: 'var(--text-muted)' }}>
        <button onClick={() => onNavigate('/')} className="link-button" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Studio</button>
        {' / '}
        <span>Privacy Policy</span>
      </nav>

      <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, marginBottom: 8, color: 'var(--text)' }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Effective Date: October 9, 2026 | Compliant with India Digital Personal Data Protection Act (DPDP Act, 2023) and GDPR
        </p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: 15, lineHeight: 1.7, color: 'var(--text-dim)' }}>
        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>1. Introduction and Data Fiduciary</h2>
          <p>
            This Privacy Policy governs your use of <strong>ShadowPlay</strong> (&quot;the Service&quot;), operated by ShadowPlay Technologies (&quot;Data Fiduciary&quot;, &quot;we&quot;, &quot;us&quot;). We are committed to transparency, data minimization, and protecting your personal data in compliance with the Digital Personal Data Protection Act, 2023 of India and international standards including the General Data Protection Regulation (GDPR).
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>2. On-Device Camera Processing (Zero Video Transmission)</h2>
          <p>
            Your privacy is our core engineering priority. ShadowPlay utilizes Google MediaPipe Hands computer vision running entirely on your local device through WebAssembly inside your browser.
          </p>
          <ul style={{ paddingLeft: 24, marginTop: 8 }}>
            <li><strong>No Cloud Video Streaming:</strong> Video frames from your webcam are processed directly in client-side volatile memory (RAM).</li>
            <li><strong>No Facial or Biometric Storage:</strong> Raw image frames and hand coordinate points are never recorded, saved to disk, or transmitted to any external server.</li>
            <li><strong>Instant Evaporation:</strong> Once coordinate calculations are rendered on your display canvas, image frames are immediately discarded by your browser garbage collector.</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>3. What Information We Collect</h2>
          <p>We practice strict data minimization. We only handle the following minimal technical items:</p>
          <ul style={{ paddingLeft: 24, marginTop: 8 }}>
            <li><strong>Anonymous Guest Identifier:</strong> A randomly generated client UUID stored in your browser local storage to track your optional high scores. No name, email, phone number, or government identifier is requested or linked.</li>
            <li><strong>Challenge Performance Metrics:</strong> When you complete timed challenges, only numeric score tallies, completion timestamps, and gesture prompt names are recorded on our backend database if online.</li>
            <li><strong>Technical Diagnostics:</strong> Standard web server connection logs (IP address, user-agent) retained temporarily for security and DDoS mitigation by our hosting provider.</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>4. Third-Party Embeds and Trackers</h2>
          <p>
            ShadowPlay contains <strong>zero third-party advertising trackers</strong>, no cross-site profiling cookies, and no marketing pixel beacons. We do not sell, rent, or monetize user data.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>5. Your Rights as a Data Principal (India DPDP Act 2023)</h2>
          <p>Under the Digital Personal Data Protection Act, you possess clear rights regarding your data:</p>
          <ul style={{ paddingLeft: 24, marginTop: 8 }}>
            <li><strong>Right to Access and Correction:</strong> You may request confirmation of any data processed.</li>
            <li><strong>Right to Erasure:</strong> You can purge all local identifiers and stored game scores at any time.</li>
            <li><strong>Right of Grievance Redressal:</strong> You may contact our designated Grievance Officer regarding any privacy concern.</li>
          </ul>

          <div style={{ marginTop: 16, padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6 }}>
            <h3 style={{ fontSize: 16, color: 'var(--text)', marginBottom: 6 }}>Exercise Your Right to Erasure</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
              Clicking below immediately deletes your anonymous guest ID, offline challenge history, and local preferences from this browser.
            </p>
            <button
              onClick={handleClearData}
              disabled={cleared}
              style={{
                padding: '8px 16px',
                borderRadius: 4,
                background: cleared ? 'var(--accent-green)' : 'var(--accent-red)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: 13,
                cursor: cleared ? 'default' : 'pointer'
              }}
            >
              {cleared ? 'Local Data Erased (Reloading...)' : 'Clear All My Local Data & Reset ID'}
            </button>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>6. Grievance Officer and Contact Details</h2>
          <p>
            In accordance with the Information Technology Act and the DPDP Act 2023, the details of our Grievance Redressal Officer are published below:
          </p>
          <div style={{ marginTop: 8, padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6 }}>
            <p><strong>Designation:</strong> Grievance Redressal Officer</p>
            <p><strong>Entity:</strong> ShadowPlay Technologies</p>
            <p><strong>Email:</strong> grievance@shadowplay.app</p>
            <p><strong>Jurisdiction:</strong> New Delhi, India</p>
            <p><strong>Response Timeframe:</strong> Acknowledgement within 24 hours; resolution within 15 business days.</p>
          </div>
        </div>
      </section>
    </article>
  )
}
