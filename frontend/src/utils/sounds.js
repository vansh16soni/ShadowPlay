/**
 * Sound feedback using Web Audio API (no external files needed).
 * Generates tones procedurally.
 */

let audioCtx = null

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

function playTone(frequency, duration, type = 'sine', gainValue = 0.3) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    gain.gain.setValueAtTime(gainValue, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch (e) {
    // Silently fail if audio not available
  }
}

export function playSuccess() {
  playTone(523, 0.12) // C5
  setTimeout(() => playTone(659, 0.12), 120) // E5
  setTimeout(() => playTone(784, 0.2), 240)  // G5
}

export function playError() {
  playTone(300, 0.15, 'sawtooth', 0.15)
  setTimeout(() => playTone(250, 0.2, 'sawtooth', 0.15), 160)
}

export function playGestureChange() {
  playTone(440, 0.08, 'sine', 0.15)
}

export function playChallengStart() {
  playTone(392, 0.1)
  setTimeout(() => playTone(523, 0.1), 100)
  setTimeout(() => playTone(659, 0.15), 200)
}
