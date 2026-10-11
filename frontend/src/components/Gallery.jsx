import React, { useState } from 'react'
import { GESTURE_INFO } from '../utils/gestureClassifier'

const FINGER_GUIDES = {
  rabbit: [
    { finger: 'Index', state: 'UP', desc: 'Extended up (ear 1)' },
    { finger: 'Middle', state: 'UP', desc: 'Extended up (ear 2)' },
    { finger: 'Ring', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Pinky', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Thumb', state: 'DOWN', desc: 'Tucked in' },
  ],
  dog: [
    { finger: 'Index', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Middle', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Ring', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Pinky', state: 'UP', desc: 'Extended (ear)' },
    { finger: 'Thumb', state: 'OUT', desc: 'Extended out (tongue)' },
  ],
  bird: [
    { finger: 'Index', state: 'UP', desc: 'Extended (wing feather)' },
    { finger: 'Middle', state: 'UP', desc: 'Extended (wing feather)' },
    { finger: 'Ring', state: 'UP', desc: 'Extended (wing feather)' },
    { finger: 'Pinky', state: 'UP', desc: 'Extended (wing feather)' },
    { finger: 'Thumb', state: 'OUT', desc: 'Extended out' },
  ],
  butterfly: [
    { finger: 'Index', state: 'UP', desc: 'Extended (wing)' },
    { finger: 'Middle', state: 'UP', desc: 'Extended (wing)' },
    { finger: 'Ring', state: 'UP', desc: 'Extended (wing)' },
    { finger: 'Pinky', state: 'UP', desc: 'Extended (wing)' },
    { finger: 'Thumb', state: 'DOWN', desc: 'Folded in' },
  ],
  snake: [
    { finger: 'Index', state: 'UP', desc: 'Extended (pressed together)' },
    { finger: 'Middle', state: 'UP', desc: 'Extended (pressed together)' },
    { finger: 'Ring', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Pinky', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Thumb', state: 'DOWN', desc: 'Tucked in' },
  ],
  goat: [
    { finger: 'Index', state: 'UP', desc: 'Extended up (horn 1)' },
    { finger: 'Middle', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Ring', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Pinky', state: 'UP', desc: 'Extended up (horn 2)' },
    { finger: 'Thumb', state: 'DOWN', desc: 'Tucked in' },
  ],
  fox: [
    { finger: 'Index', state: 'UP', desc: 'Extended up (ear 1)' },
    { finger: 'Middle', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Ring', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Pinky', state: 'UP', desc: 'Extended up (ear 2)' },
    { finger: 'Thumb', state: 'OUT', desc: 'Extended out (snout)' },
  ],
  horse: [
    { finger: 'Index', state: 'UP', desc: 'Extended (head profile)' },
    { finger: 'Middle', state: 'UP', desc: 'Extended (head profile)' },
    { finger: 'Ring', state: 'UP', desc: 'Extended (head profile)' },
    { finger: 'Pinky', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Thumb', state: 'DOWN', desc: 'Tucked in' },
  ],
  spider: [
    { finger: 'Index', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Middle', state: 'UP', desc: 'Extended (legs)' },
    { finger: 'Ring', state: 'UP', desc: 'Extended (legs)' },
    { finger: 'Pinky', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Thumb', state: 'DOWN', desc: 'Tucked in' },
  ],
  donkey: [
    { finger: 'Index', state: 'UP', desc: 'Extended up (long ear 1)' },
    { finger: 'Middle', state: 'UP', desc: 'Extended up (face profile)' },
    { finger: 'Ring', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Pinky', state: 'UP', desc: 'Extended up (long ear 2)' },
    { finger: 'Thumb', state: 'DOWN', desc: 'Tucked in' },
  ],
  pig: [
    { finger: 'Index', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Middle', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Ring', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Pinky', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Thumb', state: 'OUT', desc: 'Extended out (snout)' },
  ],
  lizard: [
    { finger: 'Index', state: 'UP', desc: 'Extended (head)' },
    { finger: 'Middle', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Ring', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Pinky', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Thumb', state: 'OUT', desc: 'Extended out (tail)' },
  ],
  scissors: [
    { finger: 'Index', state: 'UP', desc: 'Extended (blade)' },
    { finger: 'Middle', state: 'UP', desc: 'Extended (blade)' },
    { finger: 'Ring', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Pinky', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Thumb', state: 'OUT', desc: 'Extended out (handle)' },
  ],
  glasses: [
    { finger: 'Index', state: 'DOWN', desc: 'Folded in loop' },
    { finger: 'Middle', state: 'UP', desc: 'Extended' },
    { finger: 'Ring', state: 'UP', desc: 'Extended' },
    { finger: 'Pinky', state: 'UP', desc: 'Extended' },
    { finger: 'Thumb', state: 'OUT', desc: 'Extended in loop' },
  ],
  cup: [
    { finger: 'Index', state: 'UP', desc: 'Curved (rim)' },
    { finger: 'Middle', state: 'UP', desc: 'Curved (rim)' },
    { finger: 'Ring', state: 'UP', desc: 'Curved (rim)' },
    { finger: 'Pinky', state: 'UP', desc: 'Curved (rim)' },
    { finger: 'Thumb', state: 'OUT', desc: 'Extended (handle)' },
  ],
  crown: [
    { finger: 'Index', state: 'UP', desc: 'Extended peak' },
    { finger: 'Middle', state: 'UP', desc: 'Extended peak' },
    { finger: 'Ring', state: 'UP', desc: 'Extended peak' },
    { finger: 'Pinky', state: 'UP', desc: 'Extended peak' },
    { finger: 'Thumb', state: 'DOWN', desc: 'Base support' },
  ],
  airplane: [
    { finger: 'Index', state: 'UP', desc: 'Nose forward' },
    { finger: 'Middle', state: 'DOWN', desc: 'Folded' },
    { finger: 'Ring', state: 'DOWN', desc: 'Folded' },
    { finger: 'Pinky', state: 'UP', desc: 'Wing tip' },
    { finger: 'Thumb', state: 'OUT', desc: 'Wing tip' },
  ],
  eagle: [
    { finger: 'Index', state: 'UP', desc: 'Spread wing' },
    { finger: 'Middle', state: 'UP', desc: 'Spread wing' },
    { finger: 'Ring', state: 'UP', desc: 'Spread wing' },
    { finger: 'Pinky', state: 'UP', desc: 'Spread wing' },
    { finger: 'Thumb', state: 'OUT', desc: 'Beak' },
  ],
  deer: [
    { finger: 'Index', state: 'UP', desc: 'Extended (antlers)' },
    { finger: 'Middle', state: 'UP', desc: 'Extended (antlers)' },
    { finger: 'Ring', state: 'UP', desc: 'Extended (antlers)' },
    { finger: 'Pinky', state: 'UP', desc: 'Extended (antlers)' },
    { finger: 'Thumb', state: 'OUT', desc: 'Extended (snout)' },
  ],
  heart: [
    { finger: 'Index', state: 'OUT', desc: 'Extended (curve)' },
    { finger: 'Middle', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Ring', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Pinky', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Thumb', state: 'OUT', desc: 'Extended (bottom)' },
  ],
  sword: [
    { finger: 'Index', state: 'UP', desc: 'Extended up (blade)' },
    { finger: 'Middle', state: 'DOWN', desc: 'Folded' },
    { finger: 'Ring', state: 'DOWN', desc: 'Folded' },
    { finger: 'Pinky', state: 'DOWN', desc: 'Folded' },
    { finger: 'Thumb', state: 'DOWN', desc: 'Folded' },
  ],
}

function FingerDiagram({ name }) {
  const guide = FINGER_GUIDES[name]
  if (!guide) return null
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', justifyContent: 'center', height: 75 }}>
        {guide.map(({ finger, state }) => (
          <div key={finger} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 12, 
              borderRadius: 2,
              height: state === 'UP' ? 50 : state === 'OUT' ? 26 : 10,
              background: state === 'DOWN' ? 'var(--border)' : 'var(--accent-orange)',
              borderTop: state !== 'DOWN' ? '1px solid rgba(255,255,255,0.4)' : 'none',
              boxShadow: state !== 'DOWN' ? '0 2px 6px rgba(217, 119, 6, 0.4)' : 'inset 0 1px 2px rgba(0,0,0,0.5)',
              opacity: state === 'DOWN' ? 0.35 : 1,
            }} />
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700 }}>
              {finger.slice(0, 1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('animal')
  
  const filteredGestures = Object.entries(GESTURE_INFO).filter(
    ([_, info]) => info.category === activeCategory
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, perspective: 1200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, color: 'var(--text)', marginBottom: 4 }}>Gesture Anatomy Reference</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Anatomical finger configurations recognized by the tracking engine. Select category below.
          </p>
        </div>
        
        {/* 3D Rocker Category Switcher */}
        <div className="rocker-switch">
          <button
            type="button"
            onClick={() => setActiveCategory('animal')}
            className={`rocker-button ${activeCategory === 'animal' ? 'active' : ''}`}
          >
            Animal Formations
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('thing')}
            className={`rocker-button ${activeCategory === 'thing' ? 'active' : ''}`}
          >
            Object Formations
          </button>
        </div>
      </div>

      {/* 3D Specimen Tile Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
        gap: 18,
      }}>
        {filteredGestures.map(([name, info]) => (
          <div 
            key={name} 
            className="card-3d"
            style={{
              padding: '20px 16px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{
                display: 'inline-block',
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--accent-orange)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: 2,
                background: 'rgba(217, 119, 6, 0.1)',
                border: '1px solid rgba(217, 119, 6, 0.25)',
                marginBottom: 8,
              }}>
                SPECIMEN ID: {name.toUpperCase()}
              </div>
              <h3 style={{ fontSize: 17, color: 'var(--text)', fontWeight: 700, margin: '0 0 6px 0' }}>
                {info.label}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0, lineHeight: 1.4, minHeight: 34 }}>
                {info.description}
              </p>
            </div>

            <FingerDiagram name={name} />

            <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
              {FINGER_GUIDES[name]?.map(({ finger, state }) => (
                <span key={finger} style={{
                  fontSize: 9,
                  padding: '2px 6px',
                  borderRadius: 2,
                  background: state === 'DOWN' ? 'var(--bg)' : 'rgba(217, 119, 6, 0.12)',
                  color: state === 'DOWN' ? 'var(--text-muted)' : 'var(--text)',
                  border: '1px solid',
                  borderColor: state === 'DOWN' ? 'var(--border)' : 'rgba(217, 119, 6, 0.3)',
                  fontWeight: 600,
                }}>
                  {finger}: {state}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 3D Mechanical Instruction Chassis */}
      <div className="card-3d" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 15, marginBottom: 8, color: 'var(--text)', fontWeight: 700 }}>
          Optical Calibration Guidelines
        </h3>
        <ul style={{ color: 'var(--text-dim)', fontSize: 13, lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
          <li>Position your hand approximately 30 to 60 cm directly in front of the webcam.</li>
          <li>Ensure adequate ambient room lighting facing your hand to prevent camera motion blur.</li>
          <li>Keep fingers separated clearly when casting multi-finger figures such as the Rabbit or Bird.</li>
        </ul>
      </div>
    </div>
  )
}
