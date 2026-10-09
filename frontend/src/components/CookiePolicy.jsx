import React from 'react'

export default function CookiePolicy({ onNavigate }) {
  return (
    <article className="legal-article" style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      <nav aria-label="Breadcrumb" style={{ marginBottom: 20, fontSize: 13, color: 'var(--text-muted)' }}>
        <button onClick={() => onNavigate('/')} className="link-button" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Studio</button>
        {' / '}
        <span>Cookie and Local Storage Policy</span>
      </nav>

      <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, marginBottom: 8, color: 'var(--text)' }}>Cookie and Local Storage Policy</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Transparency Audit: ShadowPlay uses zero third-party advertising cookies.
        </p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: 15, lineHeight: 1.7, color: 'var(--text-dim)' }}>
        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>1. What Are Cookies and Local Storage?</h2>
          <p>
            Cookies and Web Local Storage (HTML5 localStorage) are technologies used by websites to store small amounts of operational information locally within your web browser. Local storage stays on your personal device and is not automatically transmitted with every network request, making it more private and bandwidth-efficient.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>2. Our Storage Inventory</h2>
          <p>
            ShadowPlay uses strictly necessary client-side storage keys to maintain core functionality. Below is a comprehensive breakdown:
          </p>

          <div style={{ overflowX: 'auto', marginTop: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Key Name</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Type</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Purpose</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Category</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>shadowplay_guest_id</td>
                  <td style={{ padding: '10px 12px' }}>localStorage</td>
                  <td style={{ padding: '10px 12px' }}>Associates your challenge records anonymously without requiring a login account.</td>
                  <td style={{ padding: '10px 12px' }}>Strictly Necessary</td>
                  <td style={{ padding: '10px 12px' }}>Persistent until cleared</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>shadowplay_theme</td>
                  <td style={{ padding: '10px 12px' }}>localStorage</td>
                  <td style={{ padding: '10px 12px' }}>Remembers your interface visual theme preference (Dark or Light).</td>
                  <td style={{ padding: '10px 12px' }}>Preferences</td>
                  <td style={{ padding: '10px 12px' }}>Persistent until cleared</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>shadowplay_scores</td>
                  <td style={{ padding: '10px 12px' }}>localStorage</td>
                  <td style={{ padding: '10px 12px' }}>Caches your top high scores locally so you can play offline without network connectivity.</td>
                  <td style={{ padding: '10px 12px' }}>Strictly Necessary</td>
                  <td style={{ padding: '10px 12px' }}>Persistent until cleared</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>shadowplay_cookie_consent</td>
                  <td style={{ padding: '10px 12px' }}>localStorage</td>
                  <td style={{ padding: '10px 12px' }}>Records your acknowledgement of our storage policy so the notice banner does not repeatedly appear.</td>
                  <td style={{ padding: '10px 12px' }}>Strictly Necessary</td>
                  <td style={{ padding: '10px 12px' }}>Persistent until cleared</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>3. Third-Party Tracking Statement</h2>
          <p>
            ShadowPlay deploys <strong>zero third-party advertising cookies, zero social media trackers, and zero marketing telemetry scripts</strong>. No behavioral tracking or profile building occurs across websites.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>4. How to Control and Clear Storage</h2>
          <p>
            You can delete stored data at any time either via the one-click erasure button on our <button onClick={() => onNavigate('/privacy')} className="link-button" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Privacy Policy page</button> or through your browser settings (under Clear Browsing Data &gt; Cookies and Site Data).
          </p>
        </div>
      </section>
    </article>
  )
}
