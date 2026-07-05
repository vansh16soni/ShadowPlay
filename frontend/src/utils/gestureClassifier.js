/**
 * GestureClassifier
 * Rule-based classification using MediaPipe 21-landmark hand data.
 * Landmarks: https://mediapipe.dev/images/mobile/hand_landmarks.png
 * 
 * Key landmarks:
 *  4  = THUMB_TIP,    3 = THUMB_IP
 *  8  = INDEX_TIP,    6 = INDEX_PIP (knuckle)
 *  12 = MIDDLE_TIP,  10 = MIDDLE_PIP
 *  16 = RING_TIP,    14 = RING_PIP
 *  20 = PINKY_TIP,   18 = PINKY_PIP
 *   0 = WRIST
 */

const LANDMARKS = {
  WRIST: 0,
  THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_MCP: 5, INDEX_PIP: 6, INDEX_DIP: 7, INDEX_TIP: 8,
  MIDDLE_MCP: 9, MIDDLE_PIP: 10, MIDDLE_DIP: 11, MIDDLE_TIP: 12,
  RING_MCP: 13, RING_PIP: 14, RING_DIP: 15, RING_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
}

/**
 * Returns true if finger tip is above (lower y value) its PIP joint.
 * MediaPipe: y=0 is top of image, y=1 is bottom.
 * Extended = tip y < pip y
 */
function isExtended(lm, tipIdx, pipIdx) {
  return lm[tipIdx].y < lm[pipIdx].y
}

/**
 * Thumb special case: compare tip x vs MCP x (handedness aware).
 * We use distance from wrist as a proxy instead.
 */
function isThumbExtended(lm) {
  const tipX = lm[LANDMARKS.THUMB_TIP].x
  const mcpX = lm[LANDMARKS.THUMB_MCP].x
  const wristX = lm[LANDMARKS.WRIST].x
  // If wrist is to the right of MCP, left hand; flip logic
  const isRightHand = wristX < mcpX
  return isRightHand ? tipX > mcpX : tipX < mcpX
}

function getFingerStates(lm) {
  return {
    thumb:  isThumbExtended(lm),
    index:  isExtended(lm, LANDMARKS.INDEX_TIP,  LANDMARKS.INDEX_PIP),
    middle: isExtended(lm, LANDMARKS.MIDDLE_TIP, LANDMARKS.MIDDLE_PIP),
    ring:   isExtended(lm, LANDMARKS.RING_TIP,   LANDMARKS.RING_PIP),
    pinky:  isExtended(lm, LANDMARKS.PINKY_TIP,  LANDMARKS.PINKY_PIP),
  }
}

/**
 * Distance between two landmarks (normalized 0-1 space)
 */
function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

/**
 * Classify single hand gesture from landmarks array (21 points).
 */
function classifySingleHand(landmarks) {
  if (!landmarks || landmarks.length < 21) return null

  const lm = landmarks
  const f = getFingerStates(lm)

  // ── RABBIT 🐇 ──
  // Index + middle extended (ears), ring + pinky + thumb folded
  if (f.index && f.middle && !f.ring && !f.pinky && !f.thumb) {
    // Extra: index and middle spread apart (not touching)
    const spread = Math.abs(lm[LANDMARKS.INDEX_TIP].x - lm[LANDMARKS.MIDDLE_TIP].x)
    if (spread > 0.03) return 'rabbit'
  }

  // ── DOG 🐕 ──
  // Thumb + pinky extended, index + middle + ring folded
  if (!f.index && !f.middle && !f.ring && f.pinky && f.thumb) {
    return 'dog'
  }

  // ── BIRD 🕊️ ──
  // All fingers extended (open hand) + thumb extended
  if (f.index && f.middle && f.ring && f.pinky && f.thumb) {
    return 'bird'
  }

  // ── BUTTERFLY 🦋 ──
  // All fingers extended but thumb folded (flat open hand, no thumb)
  if (f.index && f.middle && f.ring && f.pinky && !f.thumb) {
    return 'butterfly'
  }

  // ── SNAKE 🐍 ──
  // Index + middle extended close together (touching), ring + pinky + thumb folded
  if (f.index && f.middle && !f.ring && !f.pinky && !f.thumb) {
    const spread = Math.abs(lm[LANDMARKS.INDEX_TIP].x - lm[LANDMARKS.MIDDLE_TIP].x)
    if (spread <= 0.03) return 'snake'
  }

  // ── GOAT 🐐 ──
  // Index + pinky extended, middle + ring + thumb folded
  if (f.index && !f.middle && !f.ring && f.pinky && !f.thumb) {
    return 'goat'
  }

  // ── FOX 🦊 ──
  // Index + pinky + thumb extended, middle + ring folded
  if (f.index && !f.middle && !f.ring && f.pinky && f.thumb) {
    return 'fox'
  }

  // ── HORSE 🐎 ──
  // Index + middle + ring extended, pinky + thumb folded
  if (f.index && f.middle && f.ring && !f.pinky && !f.thumb) {
    return 'horse'
  }

  // ── SPIDER 🕷️ ──
  // Middle + ring extended, index + pinky + thumb folded
  if (!f.index && f.middle && f.ring && !f.pinky && !f.thumb) {
    return 'spider'
  }

  // ── DONKEY 🫏 ──
  // Index + middle + pinky extended, ring + thumb folded
  if (f.index && f.middle && !f.ring && f.pinky && !f.thumb) {
    return 'donkey'
  }

  // ── PIG 🐖 ──
  // Thumb extended only, rest folded
  if (!f.index && !f.middle && !f.ring && !f.pinky && f.thumb) {
    return 'pig'
  }

  // ── LIZARD 🦎 ──
  // Thumb + index extended, rest folded
  if (f.index && !f.middle && !f.ring && !f.pinky && f.thumb) {
    return 'lizard'
  }

  // ── SCISSORS ✂️ ──
  // Thumb + index + middle extended, ring + pinky folded
  if (f.thumb && f.index && f.middle && !f.ring && !f.pinky) {
    return 'scissors'
  }

  // ── GLASSES 👓 ──
  // Middle + ring + pinky extended, thumb + index folded
  if (!f.thumb && !f.index && f.middle && f.ring && f.pinky) {
    return 'glasses'
  }

  // ── CUP ☕ ──
  // All folded (fist)
  if (!f.thumb && !f.index && !f.middle && !f.ring && !f.pinky) {
    return 'cup'
  }

  // ── CROWN 👑 ──
  // Index + ring + pinky extended, thumb + middle folded
  if (f.index && !f.middle && f.ring && f.pinky && !f.thumb) {
    return 'crown'
  }

  // ── AIRPLANE ✈️ ──
  // Index + ring extended, thumb + middle + pinky folded
  if (f.index && !f.middle && f.ring && !f.pinky && !f.thumb) {
    return 'airplane'
  }

  // ── SWORD 🗡️ ──
  // Index extended, rest folded
  if (f.index && !f.middle && !f.ring && !f.pinky && !f.thumb) {
    return 'sword'
  }

  return null
}

/**
 * Classify gesture from landmarks array (21 points).
 * Returns gesture name string or null.
 */
export function classifyGesture(landmarks) {
  if (!landmarks) return null

  // Check if we received an array of multiple hands (length >= 2)
  if (Array.isArray(landmarks) && landmarks.length > 0 && Array.isArray(landmarks[0])) {
    if (landmarks.length >= 2) {
      const lm1 = landmarks[0]
      const lm2 = landmarks[1]
      const f1 = getFingerStates(lm1)
      const f2 = getFingerStates(lm2)

      // ── DUAL HAND: EAGLE 🦅 ──
      // Both hands fully open
      if (f1.index && f1.middle && f1.ring && f1.pinky && f1.thumb &&
          f2.index && f2.middle && f2.ring && f2.pinky && f2.thumb) {
        // Crossed wrists (wrists are close to each other)
        const wristDist = dist(lm1[LANDMARKS.WRIST], lm2[LANDMARKS.WRIST])
        if (wristDist < 0.18) {
          return 'eagle'
        }
      }

      // ── DUAL HAND: HEART 💖 ──
      // Both hands index and thumb extended, rest folded
      if (f1.index && f1.thumb && !f1.middle && !f1.ring && !f1.pinky &&
          f2.index && f2.thumb && !f2.middle && !f2.ring && !f2.pinky) {
        const indexDist = dist(lm1[LANDMARKS.INDEX_TIP], lm2[LANDMARKS.INDEX_TIP])
        const thumbDist = dist(lm1[LANDMARKS.THUMB_TIP], lm2[LANDMARKS.THUMB_TIP])
        if (indexDist < 0.14 && thumbDist < 0.14) {
          return 'heart'
        }
      }

      // ── DUAL HAND: DEER 🦌 ──
      // One hand snout (thumb & index), other hand antlers (all extended) above it
      const isHand1Antler = f1.index && f1.middle && f1.ring && f1.pinky
      const isHand2Antler = f2.index && f2.middle && f2.ring && f2.pinky
      const isHand1Snout = f1.thumb && f1.index && !f1.middle && !f1.ring && !f1.pinky
      const isHand2Snout = f2.thumb && f2.index && !f2.middle && !f2.ring && !f2.pinky

      if (isHand1Antler && isHand2Snout && lm1[LANDMARKS.WRIST].y < lm2[LANDMARKS.WRIST].y) {
        return 'deer'
      }
      if (isHand2Antler && isHand1Snout && lm2[LANDMARKS.WRIST].y < lm1[LANDMARKS.WRIST].y) {
        return 'deer'
      }
    }

    // Fallback to classifying the first hand
    return classifySingleHand(landmarks[0])
  }

  return classifySingleHand(landmarks)
}

/**
 * Get bounding box center of hand in normalized coords
 */
export function getHandCenter(landmarks) {
  if (!landmarks || landmarks.length === 0) return { x: 0.5, y: 0.5 }
  let sumX = 0, sumY = 0
  for (const lm of landmarks) { sumX += lm.x; sumY += lm.y }
  return { x: sumX / landmarks.length, y: sumY / landmarks.length }
}

export const GESTURE_INFO = {
  rabbit: {
    emoji: '🐇',
    label: 'Rabbit',
    description: 'Extend index & middle fingers (spread apart). Fold ring, pinky, thumb.',
    color: '#fbbf24', // Gold
    category: 'animal',
  },
  dog: {
    emoji: '🐕',
    label: 'Dog',
    description: 'Extend thumb & pinky. Fold index, middle, ring fingers.',
    color: '#ef4444', // Red
    category: 'animal',
  },
  bird: {
    emoji: '🕊️',
    label: 'Bird',
    description: 'Open all fingers wide including thumb.',
    color: '#f97316', // Orange
    category: 'animal',
  },
  butterfly: {
    emoji: '🦋',
    label: 'Butterfly',
    description: 'Extend all four fingers together, keep thumb folded in.',
    color: '#f59e0b', // Amber Gold
    category: 'animal',
  },
  snake: {
    emoji: '🐍',
    label: 'Snake',
    description: 'Extend index & middle fingers pressed together. Fold rest.',
    color: '#dc2626', // Crimson Red
    category: 'animal',
  },
  goat: {
    emoji: '🐐',
    label: 'Goat',
    description: 'Extend index & pinky (horns). Fold middle, ring, and thumb.',
    color: '#fb923c', // Light Orange
    category: 'animal',
  },
  fox: {
    emoji: '🦊',
    label: 'Fox',
    description: 'Extend thumb, index, & pinky. Fold middle & ring fingers.',
    color: '#d97706', // Golden Brown
    category: 'animal',
  },
  horse: {
    emoji: '🐎',
    label: 'Horse',
    description: 'Extend index, middle, and ring fingers together. Fold pinky and thumb.',
    color: '#fbbf24', // Gold
    category: 'animal',
  },
  spider: {
    emoji: '🕷️',
    label: 'Spider',
    description: 'Extend middle and ring fingers together. Fold index, pinky, and thumb.',
    color: '#b91c1c', // Dark Red
    category: 'animal',
  },
  donkey: {
    emoji: '🫏',
    label: 'Donkey',
    description: 'Extend index, middle, and pinky (ears and snout). Fold ring and thumb.',
    color: '#f97316', // Orange
    category: 'animal',
  },
  pig: {
    emoji: '🐖',
    label: 'Pig',
    description: 'Extend only the thumb (thumbs-up gesture). Fold other fingers.',
    color: '#fca5a5', // Rose Gold / Light Red
    category: 'animal',
  },
  lizard: {
    emoji: '🦎',
    label: 'Lizard',
    description: 'Extend thumb and index finger (L-shape). Fold middle, ring, and pinky.',
    color: '#eab308', // Yellow Gold
    category: 'animal',
  },
  eagle: {
    emoji: '🦅',
    label: 'Eagle',
    description: 'Use both hands. Cross wrists, spread all fingers wide to flap wings.',
    color: '#38bdf8', // Sky Blue
    category: 'animal',
  },
  deer: {
    emoji: '🦌',
    label: 'Deer',
    description: 'Use both hands. One hand thumb/index snout, other hand antlers above it.',
    color: '#a78bfa', // Purple
    category: 'animal',
  },
  scissors: {
    emoji: '✂️',
    label: 'Scissors',
    description: 'Extend thumb, index, and middle fingers. Fold ring and pinky.',
    color: '#ef4444', // Red
    category: 'thing',
  },
  glasses: {
    emoji: '👓',
    label: 'Glasses',
    description: 'Extend middle, ring, and pinky. Fold thumb and index touching in a circle.',
    color: '#fbbf24', // Gold
    category: 'thing',
  },
  cup: {
    emoji: '☕',
    label: 'Cup',
    description: 'Fold all fingers into a tight fist to represent a cup.',
    color: '#f97316', // Orange
    category: 'thing',
  },
  crown: {
    emoji: '👑',
    label: 'Crown',
    description: 'Extend index, ring, and pinky. Fold thumb and middle finger.',
    color: '#fbbf24', // Gold
    category: 'thing',
  },
  airplane: {
    emoji: '✈️',
    label: 'Airplane',
    description: 'Extend index and ring fingers. Fold thumb, middle, and pinky.',
    color: '#f97316', // Orange
    category: 'thing',
  },
  heart: {
    emoji: '💖',
    label: 'Heart',
    description: 'Use both hands. Form a circle with index and thumb tips touching.',
    color: '#ec4899', // Pink
    category: 'thing',
  },
  sword: {
    emoji: '🗡️',
    label: 'Sword',
    description: 'Extend only your index finger straight up. Keep other fingers folded.',
    color: '#94a3b8', // Slate Grey
    category: 'thing',
  },
}

export const GESTURE_NAMES = Object.keys(GESTURE_INFO)
export const GESTURE_ANIMALS = Object.keys(GESTURE_INFO).filter(k => GESTURE_INFO[k].category === 'animal')
export const GESTURE_THINGS = Object.keys(GESTURE_INFO).filter(k => GESTURE_INFO[k].category === 'thing')
