import React from 'react'

export default function TermsAndConditions({ onNavigate }) {
  return (
    <article className="legal-article" style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      <nav aria-label="Breadcrumb" style={{ marginBottom: 20, fontSize: 13, color: 'var(--text-muted)' }}>
        <button onClick={() => onNavigate('/')} className="link-button" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Studio</button>
        {' / '}
        <span>Terms and Conditions</span>
      </nav>

      <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, marginBottom: 8, color: 'var(--text)' }}>Terms and Conditions</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Last Updated: October 9, 2026 | Operator: ShadowPlay Technologies
        </p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: 15, lineHeight: 1.7, color: 'var(--text-dim)' }}>
        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>1. Acceptance of Terms</h2>
          <p>
            By accessing or using ShadowPlay (available at https://shadowplay.app), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please discontinue using the service immediately.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>2. Service Description and Purpose</h2>
          <p>
            ShadowPlay is an interactive, browser-based recreation and educational tool that calculates real-time hand coordinates from user webcam input to project shadow silhouettes. The software is provided free of charge for personal, non-commercial educational and entertainment use.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>3. Hardware and User Responsibilities</h2>
          <p>
            To use ShadowPlay, you require a functional webcam and a compatible browser supporting WebRTC and WebAssembly. You retain full control over granting and revoking camera permissions through your browser settings at all times.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>4. Acceptable Use Policy</h2>
          <p>You agree not to:</p>
          <ul style={{ paddingLeft: 24, marginTop: 8 }}>
            <li>Submit fraudulent, automated, or manipulated score entries to the global leaderboard.</li>
            <li>Attempt to reverse-engineer, decompile, or launch denial-of-service attacks against backend API endpoints.</li>
            <li>Misrepresent scores or engage in abusive activities that impair the experience for other users.</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>5. Intellectual Property Rights</h2>
          <p>
            All vector silhouette artwork, software source code, visual design elements, and documentation associated with ShadowPlay are protected by copyright and intellectual property laws. All trademarks and project assets belong to ShadowPlay Technologies.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>6. Disclaimer of Warranties</h2>
          <p>
            ShadowPlay is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. We do not guarantee uninterrupted availability, error-free computer vision recognition, or compatibility across every hardware configuration.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, ShadowPlay Technologies and its contributors shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of or inability to use this software.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>8. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>9. Contact Information</h2>
          <p>
            For any questions or legal inquiries regarding these Terms, contact us at <strong>legal@shadowplay.app</strong>.
          </p>
        </div>
      </section>
    </article>
  )
}
