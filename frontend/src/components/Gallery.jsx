import { useState } from 'react'
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
  const info = GESTURE_INFO[name]
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', justifyContent: 'center', height: 90 }}>
        {guide.map(({ finger, state }) => (
          <div key={finger} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 14, 
              borderRadius: 6,
              height: state === 'UP' ? 60 : state === 'OUT' ? 30 : 16,
              background: state === 'DOWN'
                ? 'rgba(255,255,255,0.06)'
                : info.color,
              boxShadow: state === 'DOWN' ? 'none' : `0 0 12px ${info.color}aa`,
              transition: 'all 0.3s ease',
              opacity: state === 'DOWN' ? 0.3 : 1,
            }} />
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 26, color: 'var(--accent-purple)', marginBottom: 8 }}>Gesture Gallery Guide</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>
            Learn the configurations to cast each shadow shape. Toggle categories to practice animals or common objects.
          </p>
        </div>
        
        {/* Category switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 4,
          gap: 4
        }}>
          <button
            onClick={() => setActiveCategory('animal')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              background: activeCategory === 'animal' ? 'var(--accent-orange)' : 'transparent',
              color: activeCategory === 'animal' ? '#fff' : 'var(--text-dim)',
              transition: 'all 0.2s ease'
            }}
          >
            🐕 Animals
          </button>
          <button
            onClick={() => setActiveCategory('thing')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              background: activeCategory === 'thing' ? 'var(--accent-orange)' : 'transparent',
              color: activeCategory === 'thing' ? '#fff' : 'var(--text-dim)',
              transition: 'all 0.2s ease'
            }}
          >
            ⚙️ Things
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
        gap: 20,
      }}>
        {filteredGestures.map(([name, info]) => (
          <div key={name} style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '24px 20px',
            textAlign: 'center',
            transition: 'all 0.2s ease-in-out',
          }}
            onMouseEnter={e => { 
              e.currentTarget.style.borderColor = info.color
              e.currentTarget.style.boxShadow = `0 10px 30px ${info.color}15`
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <div style={{ fontSize: 52, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.15))' }}>{info.emoji}</div>
            <h3 style={{ fontSize: 22, color: info.color, marginTop: 8, fontFamily: 'var(--font-title)' }}>{info.label}</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 6, lineHeight: 1.5, minHeight: 40 }}>{info.description}</p>

            <FingerDiagram name={name} />

            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
              {FINGER_GUIDES[name].map(({ finger, state }) => (
                <span key={finger} style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 20,
                  background: state === 'DOWN' ? 'rgba(255,255,255,0.03)' : `${info.color}10`,
                  color: state === 'DOWN' ? 'var(--text-muted)' : info.color,
                  border: `1px solid ${state === 'DOWN' ? 'transparent' : info.color + '22'}`,
                  fontWeight: 600
                }}>
                  {finger} {state === 'UP' ? '↑' : state === 'OUT' ? '→' : '↓'}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 8, padding: 20,
        background: 'rgba(255,255,255,0.01)', borderRadius: 12,
        border: '1px solid var(--border)',
      }}>
        <h3 style={{ fontSize: 16, marginBottom: 8, color: 'var(--text)' }}>💡 Tips for Success</h3>
        <ul style={{ color: 'var(--text-dim)', fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
          <li>Align your hand directly in front of the camera visor view, about 30–60cm away.</li>
          <li>Keep your hand flat parallel to the camera lens. Tilting your wrist forwards or backwards makes depth tracking difficult.</li>
          <li>If a gesture isn't immediately recognized, check the glowing hand skeleton overlay to see if all 21 points are tracking.</li>
          <li>Good, direct lighting onto the palm side of your hand improves classification significantly.</li>
        </ul>
      </div>
    </div>
  )
}
