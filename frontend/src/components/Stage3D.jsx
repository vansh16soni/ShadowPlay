import React, { useState, useRef, useEffect, useCallback } from 'react'
import ShadowCanvas from './ShadowCanvas'
import WebcamFeed from './WebcamFeed'
import { LightbulbIcon, SlidersIcon, EyeIcon, LayersIcon, CameraIcon } from './Icons'

export default function Stage3D({
  gesture,
  center,
  flash,
  gestureInfo,
  onHandResult,
  targetGesture = null,
}) {
  // 3D Parallax Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [parallaxEnabled, setParallaxEnabled] = useState(true)
  const [layoutMode, setLayoutMode] = useState('stage3d') // 'stage3d' | 'dual'
  const [pipVisible, setPipVisible] = useState(true)
  const [pipExpanded, setPipExpanded] = useState(false)

  // Studio Lighting & Optics State (Authentic analog calibration)
  const [lightMode, setLightMode] = useState('tungsten') // 'tungsten' | 'spotlight' | 'lantern'
  const [softness, setSoftness] = useState(24) // 10 to 40
  const [lightAngle, setLightAngle] = useState(0) // -1 (left), 0 (center), 1 (right)
  const [showConsole, setShowConsole] = useState(true)

  const stageRef = useRef(null)

  // Smooth 3D mouse parallax tracking
  const handleMouseMove = useCallback((e) => {
    if (!parallaxEnabled || layoutMode !== 'stage3d') return
    const stage = stageRef.current
    if (!stage) return
    const rect = stage.getBoundingClientRect()
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5

    // Subtle 3D rotation: max 4.5 degrees
    setTilt({
      x: -yRatio * 5,
      y: xRatio * 6,
    })
  }, [parallaxEnabled, layoutMode])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      {/* ── TOP UTILITY STRIP ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        padding: '8px 14px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        boxShadow: 'var(--panel-shadow)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 700,
            color: gesture ? 'var(--accent-green)' : 'var(--text-muted)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            <span 
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: gesture ? 'var(--accent-green)' : 'var(--text-muted)',
                boxShadow: gesture ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none',
              }}
              aria-hidden="true" 
            />
            <span>{gesture ? 'Tracking Lock' : 'Optical Standby'}</span>
          </div>

          <span style={{ color: 'var(--border)' }}>|</span>

          {gesture ? (
            <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>
              Pattern: <strong style={{ color: gestureInfo?.color || 'var(--accent-orange)' }}>{gestureInfo?.label || gesture}</strong>
            </span>
          ) : (
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>
              Awaiting hand silhouette
            </span>
          )}
        </div>

        {/* View Switchers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => setLayoutMode(m => m === 'stage3d' ? 'dual' : 'stage3d')}
            className="btn btn-secondary"
            style={{ fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}
            title="Toggle between 3D Spatial Theatre Stage and Classic Dual Panels"
          >
            <LayersIcon size={14} color="var(--accent-orange)" />
            <span>{layoutMode === 'stage3d' ? '3D Stage View' : 'Side-by-Side'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConsole(c => !c)}
            className="btn btn-secondary"
            style={{ fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}
            title="Toggle Studio Lighting Controls"
          >
            <SlidersIcon size={14} />
            <span>{showConsole ? 'Hide Optics' : 'Optics Console'}</span>
          </button>
        </div>
      </div>

      {/* ── 3D SPATIAL THEATRE VIEWPORT ── */}
      {layoutMode === 'stage3d' ? (
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            perspective: 1200,
            perspectiveOrigin: '50% 45%',
            position: 'relative',
            width: '100%',
            minHeight: 460,
            background: 'radial-gradient(ellipse at 50% 20%, #171d2b 0%, #0d1017 75%, #080a0f 100%)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: 24,
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 0 20px 40px -10px rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Volumetric Projector Beam (Top-Left Angle) */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -60,
              left: lightAngle === -1 ? '15%' : lightAngle === 1 ? '70%' : '45%',
              width: 320,
              height: 480,
              pointerEvents: 'none',
              background: lightMode === 'tungsten'
                ? 'linear-gradient(170deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.04) 40%, rgba(0,0,0,0) 100%)'
                : lightMode === 'spotlight'
                  ? 'linear-gradient(170deg, rgba(255, 255, 255, 0.14) 0%, rgba(203, 213, 225, 0.03) 40%, rgba(0,0,0,0) 100%)'
                  : 'linear-gradient(170deg, rgba(245, 158, 11, 0.15) 0%, rgba(180, 83, 9, 0.04) 45%, rgba(0,0,0,0) 100%)',
              transform: `rotate(${lightAngle * 12}deg)`,
              transformOrigin: 'top center',
              filter: 'blur(20px)',
              transition: 'left 0.4s ease, transform 0.4s ease',
            }}
          />

          {/* 3D Main Projection Stage Card */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 720,
              transformStyle: 'preserve-3d',
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Stage Screen Frame */}
            <div
              style={{
                position: 'relative',
                background: '#0d1017',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.9), 0 4px 12px rgba(0,0,0,0.5)',
                overflow: 'hidden',
              }}
            >
              {/* Screen Top Bezel Bar */}
              <div style={{
                padding: '8px 14px',
                background: '#121622',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 11,
                color: 'var(--text-muted)',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--text)' }}>PROJECTION CHAMBER</span>
                  <span style={{ color: 'var(--border)' }}>/</span>
                  <span style={{ color: 'var(--accent-orange)' }}>
                    {lightMode.toUpperCase()} ({lightMode === 'tungsten' ? '2800K' : lightMode === 'spotlight' ? '4200K' : 'DIFFUSE'})
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {targetGesture && (
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 3,
                      background: 'rgba(217, 119, 6, 0.12)',
                      border: '1px solid rgba(217, 119, 6, 0.3)',
                      color: 'var(--accent-orange)',
                      fontWeight: 700,
                    }}>
                      TARGET: {targetGesture.toUpperCase()}
                    </span>
                  )}
                  <span>PENUMBRA: {softness}PX</span>
                </div>
              </div>

              {/* High-Resolution Dynamic Canvas */}
              <ShadowCanvas
                gesture={gesture}
                center={center}
                flash={flash}
                lightMode={lightMode}
                softness={softness}
                lightAngle={lightAngle}
                ghostGesture={targetGesture}
              />

              {/* Screen Bottom Floor Shadow */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
              }} />
            </div>

            {/* ── 3D FLOATING PiP WEBCAM MONITOR ── */}
            {pipVisible && (
              <div
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: pipExpanded ? 320 : 180,
                  transform: 'translateZ(45px)',
                  transition: 'width 0.25s ease, transform 0.25s ease',
                  background: '#0d1017',
                  border: '1px solid var(--border)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 4,
                  boxShadow: '0 16px 32px rgba(0, 0, 0, 0.8), 0 2px 6px rgba(0,0,0,0.5)',
                  zIndex: 20,
                  overflow: 'hidden',
                }}
              >
                {/* PiP Monitor Header */}
                <div style={{
                  padding: '4px 8px',
                  background: '#151b27',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: 'var(--text-dim)' }}>
                    <CameraIcon size={12} color="var(--accent-green)" />
                    <span>VISOR HUD</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      type="button"
                      onClick={() => setPipExpanded(e => !e)}
                      style={{
                        padding: '1px 5px',
                        fontSize: 9,
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                        borderRadius: 2,
                        cursor: 'pointer',
                      }}
                      title={pipExpanded ? 'Shrink Visor' : 'Expand Visor'}
                    >
                      {pipExpanded ? 'SHRINK' : 'EXPAND'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPipVisible(false)}
                      style={{
                        padding: '1px 5px',
                        fontSize: 9,
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                        borderRadius: 2,
                        cursor: 'pointer',
                      }}
                      title="Hide Visor"
                    >
                      HIDE
                    </button>
                  </div>
                </div>

                {/* Webcam Stream with Skeleton Overlay */}
                <div style={{ position: 'relative', width: '100%' }}>
                  <WebcamFeed onHandResult={onHandResult} />
                </div>
              </div>
            )}

            {!pipVisible && (
              <button
                type="button"
                onClick={() => setPipVisible(true)}
                className="btn btn-secondary"
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontSize: 11,
                  padding: '4px 10px',
                  zIndex: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(13, 16, 23, 0.9)',
                }}
              >
                <EyeIcon size={14} />
                <span>Show Camera Visor</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ── CLASSIC DUAL MONITOR VIEW ── */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20,
          width: '100%',
        }}>
          {/* Camera Feed Card */}
          <div className="glass-panel" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Camera Video Feed</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="live-dot" />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em', fontWeight: 600 }}>ACTIVE</span>
              </div>
            </div>
            <WebcamFeed onHandResult={onHandResult} />
          </div>

          {/* Shadow Projection Wall Card */}
          <div className="glass-panel" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Shadow Projection Wall</h2>
              <span style={{
                fontSize: 11,
                color: gesture ? gestureInfo?.color : 'var(--text-muted)',
                fontWeight: 600,
                background: 'var(--bg-card)',
                padding: '2px 8px',
                borderRadius: 4,
                border: '1px solid var(--border)',
                letterSpacing: '0.04em',
              }}>
                {gesture ? gestureInfo?.label.toUpperCase() : 'SEARCHING'}
              </span>
            </div>
            <ShadowCanvas
              gesture={gesture}
              center={center}
              flash={flash}
              lightMode={lightMode}
              softness={softness}
              lightAngle={lightAngle}
              ghostGesture={targetGesture}
            />
          </div>
        </div>
      )}

      {/* ── TACTILE 3D OPTICS & LIGHTING CONSOLE ── */}
      {showConsole && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          padding: '14px 18px',
          boxShadow: 'var(--panel-shadow)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Light Spectrum Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Projector Lamp Spectrum
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                type="button"
                onClick={() => setLightMode('tungsten')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${lightMode === 'tungsten' ? 'var(--accent-orange)' : 'var(--border)'}`,
                  background: lightMode === 'tungsten' ? 'rgba(217, 119, 6, 0.15)' : 'var(--bg-card)',
                  color: lightMode === 'tungsten' ? 'var(--accent-orange)' : 'var(--text-dim)',
                  boxShadow: lightMode === 'tungsten' ? '0 2px 4px rgba(217, 119, 6, 0.2)' : 'none',
                }}
              >
                Tungsten (2800K)
              </button>
              <button
                type="button"
                onClick={() => setLightMode('spotlight')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${lightMode === 'spotlight' ? 'var(--accent-orange)' : 'var(--border)'}`,
                  background: lightMode === 'spotlight' ? 'rgba(217, 119, 6, 0.15)' : 'var(--bg-card)',
                  color: lightMode === 'spotlight' ? 'var(--accent-orange)' : 'var(--text-dim)',
                  boxShadow: lightMode === 'spotlight' ? '0 2px 4px rgba(217, 119, 6, 0.2)' : 'none',
                }}
              >
                Studio (4200K)
              </button>
              <button
                type="button"
                onClick={() => setLightMode('lantern')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${lightMode === 'lantern' ? 'var(--accent-orange)' : 'var(--border)'}`,
                  background: lightMode === 'lantern' ? 'rgba(217, 119, 6, 0.15)' : 'var(--bg-card)',
                  color: lightMode === 'lantern' ? 'var(--accent-orange)' : 'var(--text-dim)',
                  boxShadow: lightMode === 'lantern' ? '0 2px 4px rgba(217, 119, 6, 0.2)' : 'none',
                }}
              >
                Lantern Flicker
              </button>
            </div>
          </div>

          {/* Optical Angle Toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Light Cone Vector
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                type="button"
                onClick={() => setLightAngle(-1)}
                style={{
                  padding: '6px 10px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 3,
                  border: `1px solid ${lightAngle === -1 ? 'var(--accent-orange)' : 'var(--border)'}`,
                  background: lightAngle === -1 ? 'rgba(217, 119, 6, 0.15)' : 'var(--bg-card)',
                  color: lightAngle === -1 ? 'var(--accent-orange)' : 'var(--text-dim)',
                }}
              >
                Left Angle
              </button>
              <button
                type="button"
                onClick={() => setLightAngle(0)}
                style={{
                  padding: '6px 10px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 3,
                  border: `1px solid ${lightAngle === 0 ? 'var(--accent-orange)' : 'var(--border)'}`,
                  background: lightAngle === 0 ? 'rgba(217, 119, 6, 0.15)' : 'var(--bg-card)',
                  color: lightAngle === 0 ? 'var(--accent-orange)' : 'var(--text-dim)',
                }}
              >
                Direct Center
              </button>
              <button
                type="button"
                onClick={() => setLightAngle(1)}
                style={{
                  padding: '6px 10px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 3,
                  border: `1px solid ${lightAngle === 1 ? 'var(--accent-orange)' : 'var(--border)'}`,
                  background: lightAngle === 1 ? 'rgba(217, 119, 6, 0.15)' : 'var(--bg-card)',
                  color: lightAngle === 1 ? 'var(--accent-orange)' : 'var(--text-dim)',
                }}
              >
                Right Angle
              </button>
            </div>
          </div>

          {/* Optical Penumbra / Blur Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
              <span>PENUMBRA DIFFUSION</span>
              <span style={{ color: 'var(--text)' }}>{softness}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              value={softness}
              onChange={(e) => setSoftness(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--accent-orange)',
                cursor: 'pointer',
              }}
              aria-label="Adjust shadow penumbra softness"
            />
          </div>

          {/* Parallax Toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              3D Spatial Tilt
            </span>
            <button
              type="button"
              onClick={() => setParallaxEnabled(p => !p)}
              className="btn btn-secondary"
              style={{
                fontSize: 12,
                padding: '6px 12px',
                borderColor: parallaxEnabled ? 'var(--accent-orange)' : 'var(--border)',
                color: parallaxEnabled ? 'var(--accent-orange)' : 'var(--text-muted)',
              }}
            >
              {parallaxEnabled ? 'Parallax Active' : 'Static Lock'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
