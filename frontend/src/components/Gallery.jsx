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
    { finger: 'Thumb', state: 'DOWN', desc: 'Folded in loop' },
  ],
  cup: [
    { finger: 'Index', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Middle', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Ring', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Pinky', state: 'DOWN', desc: 'Folded in' },
    { finger: 'Thumb', state: 'DOWN', desc: 'Folded in' },
  ],
  crown: [
    { finger: 'Index', state: 'UP', desc: 'Extended (peak 1)' },
    { finger: 'Middle', state: 'DOWN', desc: 'Folded' },
    { finger: 'Ring', state: 'UP', desc: 'Extended (peak 2)' },
    { finger: 'Pinky', state: 'UP', desc: 'Extended (peak 3)' },
    { finger: 'Thumb', state: 'DOWN', desc: 'Folded' },
  ],
  airplane: [
    { finger: 'Index', state: 'UP', desc: 'Extended (wing)' },
    { finger: 'Middle', state: 'DOWN', desc: 'Folded' },
    { finger: 'Ring', state: 'UP', desc: 'Extended (wing)' },
    { finger: 'Pinky', state: 'DOWN', desc: 'Folded' },
    { finger: 'Thumb', state: 'DOWN', desc: 'Folded' },
  ],
  eagle: [
    { finger: 'Index', state: 'UP', desc: 'Extended (wing)' },
    { finger: 'Middle', state: 'UP', desc: 'Extended (wing)' },
    { finger: 'Ring', state: 'UP', desc: 'Extended (wing)' },
    { finger: 'Pinky', state: 'UP', desc: 'Extended (wing)' },
    { finger: 'Thumb', state: 'OUT', desc: 'Crossed thumbs' },
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
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', justifyContent: 'center', height: 80 }}>
        {guide.map(({ finger, state }) => (
          <div key={finger} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 12, 
              borderRadius: 2,
              height: state === 'UP' ? 52 : state === 'OUT' ? 26 : 12,
              background: state === 'DOWN' ? 'var(--border)' : 'var(--accent)',
              opacity: state === 'DOWN' ? 0.4 : 1,
            }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, color: 'var(--text)', marginBottom: 4 }}>Gesture Anatomy Reference</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Anatomical finger configurations recognized by the tracking engine. Select a category below.
          </p>
        </div>
        
        {/* Category switcher */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setActiveCategory('animal')}
            style={{
              padding: '6px 14px',
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              background: activeCategory === 'animal' ? 'var(--accent)' : 'var(--surface)',
              color: activeCategory === 'animal' ? '#ffffff' : 'var(--text-dim)',
              borderColor: activeCategory === 'animal' ? 'var(--accent)' : 'var(--border)',
            }}
          >
            Animal Silhouettes
          </button>
          <button
            onClick={() => setActiveCategory('thing')}
            style={{
              padding: '6px 14px',
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              background: activeCategory === 'thing' ? 'var(--accent)' : 'var(--surface)',
              color: activeCategory === 'thing' ? '#ffffff' : 'var(--text-dim)',
              borderColor: activeCategory === 'thing' ? 'var(--accent)' : 'var(--border)',
            }}
          >
            Object Silhouettes
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 16,
      }}>
        {filteredGestures.map(([name, info]) => (
          <div key={name} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            padding: '18px 16px',
            textAlign: 'center',
          }}>
            <h3 style={{ fontSize: 16, color: 'var(--text)', fontWeight: 700 }}>{info.label}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4, lineHeight: 1.4, minHeight: 34 }}>{info.description}</p>

            <FingerDiagram name={name} />

            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
              {FINGER_GUIDES[name]?.map(({ finger, state }) => (
                <span key={finger} style={{
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 2,
                  background: state === 'DOWN' ? 'transparent' : 'var(--surface-hover)',
                  color: state === 'DOWN' ? 'var(--text-muted)' : 'var(--text)',
                  border: '1px solid var(--border)',
                  fontWeight: 600
                }}>
                  {finger}: {state}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: 16,
        background: 'var(--surface)',
        borderRadius: 4,
        border: '1px solid var(--border)',
      }}>
        <h3 style={{ fontSize: 14, marginBottom: 6, color: 'var(--text)' }}>Tracking Guidelines</h3>
        <ul style={{ color: 'var(--text-dim)', fontSize: 13, lineHeight: 1.6, paddingLeft: 18 }}>
          <li>Position your hand approximately 30 to 60 cm directly in front of the webcam.</li>
          <li>Ensure adequate ambient room lighting facing your hand to prevent camera motion blur.</li>
          <li>Keep fingers separated clearly when casting multi-finger figures such as the Rabbit or Bird.</li>
        </ul>
      </div>
    </div>
  )
}
