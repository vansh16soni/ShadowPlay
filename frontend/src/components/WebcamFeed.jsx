import { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { useMediaPipe } from '../hooks/useMediaPipe'

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
      <div className="cam-error">
        <span style={{ fontSize: 40 }}>📷</span>
        <p>Camera access denied or unavailable.</p>
        <p style={{ fontSize: 13, opacity: 0.6 }}>Allow camera permission and refresh.</p>
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
          borderRadius: 16,
          opacity: loading ? 0.4 : 1,
          transition: 'opacity 0.3s',
          border: '2px solid var(--border)',
          display: 'block',
        }}
        aria-label="Webcam feed"
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
          borderRadius: 16,
        }}
      />

      {loading && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(10,10,15,0.7)',
          borderRadius: 16, gap: 12,
        }}>
          <div style={{ color: 'var(--accent-orange)', fontFamily: 'var(--font-title)', fontSize: 20 }}>
            Loading AI...
          </div>
          <div style={{
            width: 200, height: 8, background: 'rgba(255,255,255,0.1)',
            borderRadius: 4, overflow: 'hidden',
          }}>
            <div style={{
              width: `${loadProgress}%`, height: '100%',
              background: 'var(--accent-orange)', borderRadius: 4,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{loadProgress}%</div>
        </div>
      )}

      {error && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(10,10,15,0.85)',
          borderRadius: 16, gap: 8, padding: 16,
        }}>
          <span style={{ fontSize: 32 }}>⚠️</span>
          <p style={{ textAlign: 'center', color: 'var(--wrong)', fontSize: 14 }}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(74,222,128,0.2)',
          border: '1px solid rgba(74,222,128,0.4)',
          color: '#4ade80', fontSize: 11, padding: '3px 8px',
          borderRadius: 20, fontWeight: 600,
          zIndex: 10,
        }}>
          ● LIVE
        </div>
      )}
    </div>
  )
}
