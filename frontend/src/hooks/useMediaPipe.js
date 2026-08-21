import { useEffect, useRef, useState, useCallback } from 'react'
import { classifyGesture, getHandCenter } from '../utils/gestureClassifier'

export function useMediaPipe(webcamRef, onResult, overlayCanvasRef) {
  const handsRef = useRef(null)
  const animFrameRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [error, setError] = useState(null)

  const processFrame = useCallback(async () => {
    if (!handsRef.current) return

    const video = webcamRef.current?.video
    if (!video || video.readyState < 2) {
      // Webcam video element not ready yet; poll again on the next animation frame.
      animFrameRef.current = requestAnimationFrame(processFrame)
      return
    }

    try {
      await handsRef.current.send({ image: video })
    } catch (e) {
      // skip frame or failed detection
    }
    animFrameRef.current = requestAnimationFrame(processFrame)
  }, [webcamRef])

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        setLoadProgress(10)

        // Dynamically load MediaPipe to avoid SSR issues
        const mpHands = await import('@mediapipe/hands')
        // Safe check for Hands exports (named, default, or global window fallback)
        const Hands = mpHands.Hands || (mpHands.default && mpHands.default.Hands) || window.Hands
        const HAND_CONNECTIONS = mpHands.HAND_CONNECTIONS || (mpHands.default && mpHands.default.HAND_CONNECTIONS) || window.HAND_CONNECTIONS

        setLoadProgress(40)

        if (cancelled) return

        const mpDrawingUtils = await import('@mediapipe/drawing_utils')
        // Safe check for drawing_utils exports (named, default, or global window fallback)
        const drawingUtils = mpDrawingUtils.drawConnectors 
          ? mpDrawingUtils 
          : ((mpDrawingUtils.default && mpDrawingUtils.default.drawConnectors) ? mpDrawingUtils.default : window)

        setLoadProgress(60)

        if (cancelled) return

        const hands = new Hands({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
        })
        handsRef.current = hands

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.6,
        })

        setLoadProgress(80)

        hands.onResults((results) => {
          if (cancelled) return

          // Draw skeleton on the overlay canvas if it exists
          const canvas = overlayCanvasRef?.current
          if (canvas) {
            const ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const video = webcamRef.current?.video
            if (video) {
              if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
              }
            }

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
              for (const landmarks of results.multiHandLandmarks) {
                drawingUtils.drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                  color: 'rgba(74, 222, 128, 0.6)',
                  lineWidth: 3,
                })
                drawingUtils.drawLandmarks(ctx, landmarks, {
                  color: '#4ade80',
                  lineWidth: 1,
                  radius: 4,
                })
              }
            }
          }

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            // Pass all multiHandLandmarks to classifyGesture so it can check multi-hand rules
            const landmarks = results.multiHandLandmarks
            const gesture = classifyGesture(landmarks)

            // Average center of all detected hands
            let center
            if (results.multiHandLandmarks.length > 1) {
              const c1 = getHandCenter(results.multiHandLandmarks[0])
              const c2 = getHandCenter(results.multiHandLandmarks[1])
              center = {
                x: (c1.x + c2.x) / 2,
                y: (c1.y + c2.y) / 2
              }
            } else {
              center = getHandCenter(results.multiHandLandmarks[0])
            }

            onResult({ landmarks, gesture, center, detected: true })
          } else {
            onResult({ landmarks: null, gesture: null, center: null, detected: false })
          }
        })

        await hands.initialize()
        setLoadProgress(100)

        if (!cancelled) {
          setLoading(false)
          animFrameRef.current = requestAnimationFrame(processFrame)
        } else {
          try {
            hands.close()
          } catch (err) {
            console.warn('Error closing hands:', err)
          }
          handsRef.current = null
        }
      } catch (e) {
        if (!cancelled) {
          setError('Failed to load MediaPipe. Check your connection.')
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      cancelled = true
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (handsRef.current) {
        try {
          handsRef.current.close()
        } catch (err) {
          console.warn('Error closing hands in cleanup:', err)
        }
        handsRef.current = null
      }
    }
  }, []) // eslint-disable-line

  // Restart animation loop when webcam becomes ready
  useEffect(() => {
    if (!loading && handsRef.current) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = requestAnimationFrame(processFrame)
    }
  }, [loading, processFrame])

  return { loading, loadProgress, error }
}
