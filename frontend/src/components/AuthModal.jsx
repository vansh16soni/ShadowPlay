import { useState, useRef, useEffect } from 'react'
import { loginUser, registerUser } from '../utils/api'
import { playSuccess, playError, playGestureChange, resumeAudio } from '../utils/sounds'

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [identifier, setIdentifier] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // 3D Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('')
      setSuccessMessage('')
    }
  }, [isOpen])

  if (!isOpen) return null

  function handleMouseMove(e) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const rotX = -(y / (rect.height / 2)) * 6
    const rotY = (x / (rect.width / 2)) * 6
    setTilt({ x: rotX, y: rotY })
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    resumeAudio()
    setErrorMessage('')
    setSuccessMessage('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const cleanIdent = identifier.trim()
        if (!cleanIdent || !password) {
          throw new Error('Please enter your callsign or email and password.')
        }
        const res = await loginUser({ name: cleanIdent, email: cleanIdent, password })
        if (res.ok && res.user) {
          playSuccess()
          localStorage.setItem('shadowplay_auth_token', res.token)
          if (res.adminKey) {
            localStorage.setItem('shadowplay_admin_key', res.adminKey)
          } else {
            localStorage.removeItem('shadowplay_admin_key')
          }
          localStorage.setItem('shadowplay_guest_id', res.user.guestId)
          setSuccessMessage(res.user.role === 'admin' ? 'Administrative authorization verified. Unlocking root console...' : 'Operative verified. Welcome back!')
          setTimeout(() => {
            onAuthSuccess(res.user)
            onClose()
          }, 600)
        }
      } else {
        const cleanName = name.trim()
        const cleanEmail = email.trim()
        if (cleanName.length < 2) {
          throw new Error('Callsign must be at least 2 characters.')
        }
        if (!cleanEmail.includes('@')) {
          throw new Error('Please provide a valid email address.')
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.')
        }
        const res = await registerUser({ name: cleanName, email: cleanEmail, password })
        if (res.ok && res.user) {
          playSuccess()
          localStorage.setItem('shadowplay_auth_token', res.token)
          localStorage.setItem('shadowplay_guest_id', res.user.guestId)
          setSuccessMessage('Operative registered successfully! Authorizing terminal session...')
          setTimeout(() => {
            onAuthSuccess(res.user)
            onClose()
          }, 800)
        }
      }
    } catch (err) {
      playError()
      setErrorMessage(err.message || 'Authentication failed. Please verify operative credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 12, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        perspective: '1200px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="depth-plate"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'linear-gradient(165deg, #161c2a 0%, #0d121c 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          boxShadow: `
            0 30px 80px rgba(0, 0, 0, 0.9),
            0 0 0 1px rgba(255, 255, 255, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -2px 0 rgba(0, 0, 0, 0.8)
          `,
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out, box-shadow 0.2s ease',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Dynamic Specular Light Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(217, 119, 6, 0.8), rgba(255, 255, 255, 0.9), rgba(217, 119, 6, 0.8), transparent)',
            pointerEvents: 'none',
          }}
        />

        {/* Header Bar */}
        <div
          style={{
            padding: '24px 28px 18px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            background: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 10px #10b981',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: '11px', letterSpacing: '0.14em', color: 'var(--accent-orange)', fontWeight: 800 }}>
                CIPHER GATEWAY
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              {mode === 'login' ? 'OPERATIVE VERIFICATION' : 'REGISTER OPERATIVE'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="depth-button"
            style={{
              padding: '6px 14px',
              fontSize: '11px',
              fontWeight: 800,
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
            }}
          >
            ESC
          </button>
        </div>

        {/* 3D Rocker Switch Mode Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(5, 8, 14, 0.6)',
            padding: '6px 12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={() => {
              playGestureChange()
              setMode('login')
              setErrorMessage('')
            }}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: mode === 'login' ? 'linear-gradient(180deg, #242e42 0%, #161c2a 100%)' : 'transparent',
              border: '1px solid',
              borderColor: mode === 'login' ? 'rgba(217, 119, 6, 0.5)' : 'transparent',
              borderRadius: '8px',
              color: mode === 'login' ? '#ffffff' : '#94a3b8',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? '0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: mode === 'login' ? 'var(--accent-orange)' : 'transparent' }} />
            SIGN IN
          </button>

          <button
            type="button"
            onClick={() => {
              playGestureChange()
              setMode('register')
              setErrorMessage('')
            }}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: mode === 'register' ? 'linear-gradient(180deg, #242e42 0%, #161c2a 100%)' : 'transparent',
              border: '1px solid',
              borderColor: mode === 'register' ? 'rgba(217, 119, 6, 0.5)' : 'transparent',
              borderRadius: '8px',
              color: mode === 'register' ? '#ffffff' : '#94a3b8',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              boxShadow: mode === 'register' ? '0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: mode === 'register' ? 'var(--accent-orange)' : 'transparent' }} />
            NEW OPERATIVE
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {errorMessage && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '10px',
                color: '#fca5a5',
                fontSize: '13px',
                lineHeight: '1.4',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.2)',
                animation: 'shake 0.3s ease',
              }}
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '10px',
                color: '#6ee7b7',
                fontSize: '13px',
                lineHeight: '1.4',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)',
              }}
            >
              {successMessage}
            </div>
          )}

          {mode === 'login' ? (
            <div>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: '#cbd5e1' }}>
                  OPERATIVE CALLSIGN OR EMAIL
                </label>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter operative callsign or email"
                  autoComplete="username"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '14px 16px',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 600,
                    outline: 'none',
                    boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06)',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-orange)'
                    e.target.style.boxShadow = 'inset 0 3px 6px rgba(0,0,0,0.7), 0 0 12px rgba(217, 119, 6, 0.4)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.18)'
                    e.target.style.boxShadow = 'inset 0 3px 6px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06)'
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: '#cbd5e1', marginBottom: '8px' }}>
                  OPERATIVE NAME / CALLSIGN
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. ShadowHunter"
                  autoComplete="name"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '14px 16px',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 600,
                    outline: 'none',
                    boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.7)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: '#cbd5e1', marginBottom: '8px' }}>
                  COMMUNICATION EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operative@shadowplay.net"
                  autoComplete="email"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '14px 16px',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 600,
                    outline: 'none',
                    boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.7)',
                  }}
                />
              </div>
            </>
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: '#cbd5e1' }}>
                ACCESS CIPHER / PASSWORD
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {showPassword ? 'HIDE' : 'REVEAL'}
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '14px 16px',
                  paddingRight: '60px',
                  background: '#090d16',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 600,
                  outline: 'none',
                  boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06)',
                  letterSpacing: showPassword ? 'normal' : '0.15em',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-orange)'
                  e.target.style.boxShadow = 'inset 0 3px 6px rgba(0,0,0,0.7), 0 0 12px rgba(217, 119, 6, 0.4)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.18)'
                  e.target.style.boxShadow = 'inset 0 3px 6px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06)'
                }}
              />
              <span
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#94a3b8',
                  cursor: 'pointer',
                  userSelect: 'none',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                {showPassword ? 'KEY' : 'CIPHER'}
              </span>
            </div>
          </div>

          {/* 3D Master Verification Button */}
          <button
            type="submit"
            disabled={loading}
            className="depth-button"
            style={{
              marginTop: '6px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: 900,
              letterSpacing: '0.1em',
              color: '#ffffff',
              background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.75 : 1,
              boxShadow: '0 5px 0 #78350f, 0 10px 25px rgba(217, 119, 6, 0.45)',
              transform: loading ? 'translateY(2px)' : 'none',
              transition: 'transform 0.08s ease, box-shadow 0.08s ease, filter 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
            onMouseDown={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(4px)'
                e.currentTarget.style.boxShadow = '0 1px 0 #78350f, 0 4px 10px rgba(217, 119, 6, 0.3)'
              }
            }}
            onMouseUp={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 5px 0 #78350f, 0 10px 25px rgba(217, 119, 6, 0.45)'
              }
            }}
          >
            {loading && (
              <span
                style={{
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                  display: 'inline-block',
                }}
              />
            )}
            <span>
              {loading ? 'VERIFYING...' : mode === 'login' ? 'VERIFY CREDENTIALS' : 'INITIALIZE ACCOUNT'}
            </span>
          </button>
        </form>

        {/* Dynamic Telemetry Status Footer */}
        <div
          style={{
            padding: '14px 28px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: '#94a3b8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
            <span>NODE CIPHER: SCRYPT-64</span>
          </div>
          <div style={{ color: '#cbd5e1', fontWeight: 700 }}>
            ATLAS CLUSTER: READY
          </div>
        </div>
      </div>
    </div>
  )
}
