import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { useMediaPipe } from '../hooks/useMediaPipe'
import { CameraIcon, WarningIcon } from './Icons'

const VIDEO_CONSTRAINTS = {
  width: 640,
  height: 480,
  facingMode: 'user',
}

export default function WebcamFeed({ onHandResult }) {
  const webcamRef = useRef(null)
  const overlayCanvasRef = useRef(null)
  const [camError, setCamError] = useState(null)

  const { loading, loadProgress, error } = useMediaPipe(webcamRef, onHandResult, overlayCanvasRef)

  if (camError) {
    return (
      <div 
        role="alert"
        style={{
          padding: '32px 16px',
          textAlign: 'center',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <CameraIcon size={32} color="var(--accent-red)" />
        <h3 style={{ fontSize: 16, color: 'var(--text)' }}>Camera Access Required</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 360 }}>
          Camera access was blocked or is unavailable. Please grant browser camera permissions and reload to start tracking.
        </p>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 500 }}>
      <Webcam
        ref={webcamRef}
        videoConstraints={VIDEO_CONSTRAINTS}
        mirrored
        onUserMediaError={() => setCamError(true)}
        style={{
          width: '100%',
          borderRadius: 4,
          opacity: loading ? 0.4 : 1,
          transition: 'opacity 0.2s',
          border: '1px solid var(--border)',
          display: 'block',
          background: '#000000',
        }}
        aria-label="Real-time webcam video feed"
      />

      {/* Hand landmarks skeleton overlay */}
      <canvas
        ref={overlayCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          transform: 'scaleX(-1)', // Match webcam mirroring
          borderRadius: 4,
        }}
        aria-hidden="true"
      />

      {loading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.85)',
          borderRadius: 4,
          gap: 12,
          padding: 16,
        }}>
          <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600 }}>
            Initializing Tracking Models
          </div>
          <div style={{
            width: 180,
            height: 6,
            background: 'var(--border)',
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${loadProgress}%`,
              height: '100%',
              background: 'var(--accent)',
              transition: 'width 0.2s ease',
            }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{loadProgress}% loaded</div>
        </div>
      )}

      {error && (
        <div 
          role="alert"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.95)',
            borderRadius: 4,
            gap: 8,
            padding: 16,
          }}
        >
          <WarningIcon size={24} color="var(--accent-red)" />
          <p style={{ textAlign: 'center', color: 'var(--accent-red)', fontSize: 13 }}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          fontSize: 11,
          padding: '2px 8px',
          borderRadius: 4,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          zIndex: 10,
        }}>
          <span className="live-status-dot" aria-hidden="true" />
          <span>Camera Active</span>
        </div>
      )}
    </div>
  )
}
