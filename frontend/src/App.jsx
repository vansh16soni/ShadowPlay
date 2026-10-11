import { useState, useCallback, useRef, useEffect } from 'react'
import WebcamFeed from './components/WebcamFeed'
import ShadowCanvas from './components/ShadowCanvas'
import Stage3D from './components/Stage3D'
import Gallery from './components/Gallery'
import Leaderboard from './components/Leaderboard'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import BattlePanel from './components/BattlePanel'
import SpeedrunPanel from './components/SpeedrunPanel'
import PlaySetupModal from './components/PlaySetupModal'
import SplashScreen from './components/SplashScreen'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsAndConditions from './components/TermsAndConditions'
import CookiePolicy from './components/CookiePolicy'
import CookieBanner from './components/CookieBanner'
import NotFound from './components/NotFound'
import AuthModal from './components/AuthModal'
import AdminDashboard from './components/AdminDashboard'
import { PracticeIcon, QuestIcon, TimerIcon, ExitIcon } from './components/Icons'
import { GESTURE_INFO, GESTURE_NAMES, GESTURE_ANIMALS, GESTURE_THINGS } from './utils/gestureClassifier'
import { playGestureChange, playSuccess, playError, playChallengStart, resumeAudio } from './utils/sounds'
import { startChallenge, saveScore, submitAttempt, syncOfflineScores, verifyCurrentSession } from './utils/api'

// Stable guest ID persisted across sessions
function getGuestId() {
  let id = localStorage.getItem('shadowplay_guest_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('shadowplay_guest_id', id)
  }
  return id
}

const GUEST_ID = getGuestId()

const BOSS_LIST = [
  {
    name: 'Vortex Bat',
    maxHp: 80,
    timeLimit: 8,
    vulnerabilities: ['bird', 'butterfly', 'goat', 'eagle'],
    vulnerabilitiesThings: ['scissors', 'glasses', 'cup', 'heart'],
    damageMultiplier: 20,
    color: '#ef4444' // Red
  },
  {
    name: 'Gloom Wolf',
    maxHp: 120,
    timeLimit: 6,
    vulnerabilities: ['dog', 'rabbit', 'fox', 'horse', 'donkey', 'deer'],
    vulnerabilitiesThings: ['crown', 'airplane', 'scissors', 'sword'],
    damageMultiplier: 25,
    color: '#f97316' // Orange
  },
  {
    name: 'Abyss Dragon',
    maxHp: 160,
    timeLimit: 5,
    vulnerabilities: ['snake', 'bird', 'goat', 'fox', 'spider', 'pig', 'lizard', 'eagle', 'deer'],
    vulnerabilitiesThings: ['cup', 'crown', 'glasses', 'airplane', 'heart'],
    damageMultiplier: 30,
    color: '#fbbf24' // Gold
  }
]

function Breadcrumbs({ path, onNavigate }) {
  if (path === '/') return null
  const labels = {
    '/guide': 'Gesture Reference',
    '/battle': 'Shadow Quest',
    '/speedrun': 'Time Attack',
    '/leaderboard': 'Leaderboard',
    '/about': 'How It Works',
    '/privacy': 'Privacy Policy',
    '/terms': 'Terms of Service',
    '/cookies': 'Cookie Policy',
  }
  const currentLabel = labels[path] || '404 Not Found'
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 16 }}>
      <ol style={{ display: 'flex', alignItems: 'center', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
        <li>
          <button 
            type="button"
            onClick={() => onNavigate('/')}
            style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-dim)', cursor: 'pointer', font: 'inherit', textDecoration: 'underline' }}
          >
            Studio
          </button>
        </li>
        <li aria-hidden="true" style={{ color: 'var(--border)' }}>/</li>
        <li aria-current="page" style={{ color: 'var(--text)', fontWeight: 600 }}>{currentLabel}</li>
      </ol>
    </nav>
  )
}

export default function App() {
  // Path-based routing with slug tracking
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname || '/'
  })

  const navigate = useCallback((path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }
    setCurrentPath(path)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Sync document title and canonical tag based on slug
  useEffect(() => {
    const titles = {
      '/': 'ShadowPlay | Browser Hand Shadow Puppet Studio',
      '/guide': 'Gesture Reference Library | ShadowPlay',
      '/battle': 'Shadow Quest Challenge | ShadowPlay',
      '/speedrun': 'Time Attack Challenge | ShadowPlay',
      '/leaderboard': 'Global Gesture Leaderboard | ShadowPlay',
      '/about': 'How Computer Vision Operates | ShadowPlay',
      '/privacy': 'Privacy Policy (India DPDP Act Compliant) | ShadowPlay',
      '/terms': 'Terms and Conditions | ShadowPlay',
      '/cookies': 'Cookie and Storage Policy | ShadowPlay',
      '/admin': 'Administration Portal | ShadowPlay',
    }
    document.title = titles[currentPath] || 'Page Not Found (404) | ShadowPlay'
    
    const canonical = document.querySelector("link[rel='canonical']")
    if (canonical) {
      canonical.setAttribute('href', `https://shadowplay.app${currentPath === '/' ? '' : currentPath}`)
    }
  }, [currentPath])

  // Map slug to active tab for sidebar highlight
  const getActiveTab = () => {
    if (currentPath === '/guide') return 'learn'
    if (currentPath === '/leaderboard') return 'leaderboard'
    if (currentPath === '/about') return 'about'
    if (currentPath === '/privacy') return 'privacy'
    if (currentPath === '/terms') return 'terms'
    if (currentPath === '/cookies') return 'cookies'
    if (currentPath === '/admin') return 'admin'
    return 'dashboard'
  }
  
  // Operative User & Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const cached = localStorage.getItem('shadowplay_user_profile')
    try { return cached ? JSON.parse(cached) : null } catch { return null }
  })
  const [authModalOpen, setAuthModalOpen] = useState(false)

  // Validate active session with backend
  useEffect(() => {
    verifyCurrentSession().then(res => {
      if (res && res.user) {
        setCurrentUser(res.user)
        localStorage.setItem('shadowplay_user_profile', JSON.stringify(res.user))
      } else {
        setCurrentUser(null)
        localStorage.removeItem('shadowplay_user_profile')
      }
    }).catch(() => {})
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('shadowplay_auth_token')
    localStorage.removeItem('shadowplay_admin_key')
    localStorage.removeItem('shadowplay_user_profile')
    setCurrentUser(null)
    if (currentPath === '/admin') navigate('/')
  }, [currentPath, navigate])

  const handleAuthSuccess = useCallback((user) => {
    setCurrentUser(user)
    localStorage.setItem('shadowplay_user_profile', JSON.stringify(user))
    if (user.role === 'admin') {
      navigate('/admin')
    }
  }, [navigate])

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('shadowplay_theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('shadowplay_theme', theme)
  }, [theme])

  // Category State
  const [category, setCategory] = useState('animals') // animals | things | all
  const [isSetupOpen, setIsSetupOpen] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Hand tracking state
  const [gesture, setGesture] = useState(null)
  const [center, setCenter] = useState(null)
  const [flash, setFlash] = useState(false)
  const prevGestureRef = useRef(null)
  const flashTimeoutRef = useRef(null)

  // Voice Speech State
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  // Game Mode state: free | battle | speedrun
  const [gameMode, setGameMode] = useState('free') 
  
  // Session tracking state
  const [sessionId, setSessionId] = useState(null)

  // Battle state
  const [battleState, setBattleState] = useState('ready') // ready | playing | victory | gameover
  const [bossIndex, setBossIndex] = useState(0)
  const [bossHp, setBossHp] = useState(80)
  const [playerHp, setPlayerHp] = useState(100)
  const [battleTimer, setBattleTimer] = useState(8)
  const [battleVulnerability, setBattleVulnerability] = useState('bird')
  const [battleFeedback, setBattleFeedback] = useState('')
  const [shakePlayer, setShakePlayer] = useState(false)
  const [hitBoss, setHitBoss] = useState(false)
  const [battleScore, setBattleScore] = useState(0)
  const battleTimerRef = useRef(null)
  const holdIntervalRef = useRef(null)

  // Speedrun (Time Attack) state
  const [speedState, setSpeedState] = useState('ready') // ready | playing | gameover
  const [speedScore, setSpeedScore] = useState(0)
  const [speedTimer, setSpeedTimer] = useState(30)
  const [speedTarget, setSpeedTarget] = useState(null)
  const [speedStreak, setSpeedStreak] = useState(0)
  const [speedFeedback, setSpeedFeedback] = useState('')
  const speedTimerRef = useRef(null)
  const speedTargetTimeoutRef = useRef(null)
  const targetCompletedRef = useRef(false)
  const lastSpokenRef = useRef({ text: '', time: 0 })

  const latestGestureRef = useRef(gesture)
  const latestVulRef = useRef(battleVulnerability)

  useEffect(() => {
    latestGestureRef.current = gesture
  }, [gesture])

  useEffect(() => {
    latestVulRef.current = battleVulnerability
  }, [battleVulnerability])

  // Sync offline scores on startup and online detection
  useEffect(() => {
    syncOfflineScores().catch(() => {})
    const handleOnline = () => {
      syncOfflineScores().catch(() => {})
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])

  // Handle hand result from webcam tracking
  const handleHandResult = useCallback(({ gesture: g, center: c }) => {
    setCenter(c)
    if (g !== prevGestureRef.current) {
      prevGestureRef.current = g
      setGesture(g)
      if (g) {
        playGestureChange()
        clearTimeout(flashTimeoutRef.current)
        setFlash(true)
        flashTimeoutRef.current = setTimeout(() => setFlash(false), 120)
      }
    }
  }, [])

  // Web Speech API Voice Guidance with debounce and anti-crash guard
  function speak(text) {
    if (!voiceEnabled || !text || !('speechSynthesis' in window)) return
    const now = Date.now()
    if (lastSpokenRef.current.text === text && now - lastSpokenRef.current.time < 1200) {
      return
    }
    lastSpokenRef.current = { text, time: now }
    try {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 1.2
      window.speechSynthesis.speak(u)
    } catch (e) {
      // Ignore speech synthesis failures
    }
  }

  // Clear all running timers and reset challenge states cleanly
  const resetAllModes = useCallback(() => {
    if (battleTimerRef.current) clearInterval(battleTimerRef.current)
    if (speedTimerRef.current) clearInterval(speedTimerRef.current)
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
    if (speedTargetTimeoutRef.current) clearTimeout(speedTargetTimeoutRef.current)
    targetCompletedRef.current = false
    setGameMode('free')
    setBattleState('ready')
    setSpeedState('ready')
    setSessionId(null)
  }, [])

  useEffect(() => {
    if (gesture && gameMode === 'free') {
      const info = GESTURE_INFO[gesture]
      if (info) speak(info.label)
    }
  }, [gesture, gameMode, voiceEnabled]) // eslint-disable-line

  // ─── SHADOW BATTLE MODE LOGIC ───
  const startBattle = async (overrideCategory) => {
    resumeAudio()
    resetAllModes()
    playChallengStart()
    setBossIndex(0)
    const boss = BOSS_LIST[0]
    setBossHp(boss.maxHp)
    setPlayerHp(100)
    setBattleTimer(boss.timeLimit)
    setBattleScore(0)
    
    const activeCategory = overrideCategory || category
    const vuls = activeCategory === 'all'
      ? [...boss.vulnerabilities, ...boss.vulnerabilitiesThings]
      : activeCategory === 'animals'
        ? boss.vulnerabilities
        : boss.vulnerabilitiesThings
    setBattleFeedback('Round started. Form ' + GESTURE_INFO[vuls[0]].label + ' to counter opponent.')
    
    const initialVul = vuls[Math.floor(Math.random() * vuls.length)]
    setBattleVulnerability(initialVul)
    setBattleState('playing')
    setGameMode('battle')
    speak(`Prepare to counter ${boss.name}! Form ${GESTURE_INFO[initialVul].label}!`)

    try {
      const res = await startChallenge(GUEST_ID)
      if (res && res.sessionId) {
        setSessionId(res.sessionId)
      }
    } catch (e) {
      setSessionId(null)
    }
  }

  // Handle player defeat (HP reaches 0)
  useEffect(() => {
    if (gameMode === 'battle' && battleState === 'playing' && playerHp === 0) {
      setBattleState('gameover')
      playError()
      speak('Challenge ended.')
      saveScore(GUEST_ID, battleScore)
    }
  }, [playerHp, gameMode, battleState, battleScore])

  // Count down boss attack timer
  useEffect(() => {
    if (gameMode !== 'battle' || battleState !== 'playing') return

    battleTimerRef.current = setInterval(() => {
      setBattleTimer((t) => {
        if (t <= 1) {
          const currentBoss = BOSS_LIST[bossIndex]
          const currentVul = latestVulRef.current
          const currentGest = latestGestureRef.current
          
          if (sessionId) {
            submitAttempt({
              sessionId,
              gesturePrompt: currentVul,
              userGesture: currentGest || 'none',
              isCorrect: false
            }).catch(() => {})
          }

          setPlayerHp((prevHp) => {
            const nextHp = Math.max(0, prevHp - 20)
            if (nextHp > 0) {
              setShakePlayer(true)
              setTimeout(() => setShakePlayer(false), 500)
              playError()
              setBattleFeedback(`${currentBoss.name} timed out. 20 HP deducted.`)
              speak('Time expired.')
            }
            return nextHp
          })
          return currentBoss.timeLimit
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(battleTimerRef.current)
  }, [gameMode, battleState, bossIndex, sessionId]) // eslint-disable-line

  // Check if player is holding the correct gesture to attack
  useEffect(() => {
    if (gameMode !== 'battle' || battleState !== 'playing') return

    const currentBoss = BOSS_LIST[bossIndex]

    if (gesture === battleVulnerability) {
      holdIntervalRef.current = setInterval(() => {
        const damage = 20
        const willDefeat = bossHp - damage <= 0

        if (willDefeat) {
          setBossHp(0)
        } else {
          setBossHp(prev => prev - damage)
          
          const remainingVuls = category === 'all'
            ? [...currentBoss.vulnerabilities, ...currentBoss.vulnerabilitiesThings]
            : category === 'animals'
              ? currentBoss.vulnerabilities
              : currentBoss.vulnerabilitiesThings
          const nextVul = remainingVuls[Math.floor(Math.random() * remainingVuls.length)]
          setBattleVulnerability(nextVul)
          setBattleFeedback(`Hit registered. Form next sign: ${GESTURE_INFO[nextVul].label}.`)
          speak(`Confirmed. Next: ${GESTURE_INFO[nextVul].label}.`)

          if (sessionId) {
            submitAttempt({
              sessionId,
              gesturePrompt: battleVulnerability,
              userGesture: gesture,
              isCorrect: true,
            }).catch(() => {})
          }
        }

        setHitBoss(true)
        setTimeout(() => setHitBoss(false), 300)
        playSuccess()
      }, 800)
    }

    return () => clearInterval(holdIntervalRef.current)
  }, [gesture, battleVulnerability, gameMode, battleState, bossIndex, bossHp, category, sessionId]) // eslint-disable-line

  // Standalone useEffect to handle clean boss defeat transitions
  useEffect(() => {
    if (gameMode !== 'battle' || battleState !== 'playing') return
    if (bossHp === 0) {
      const currentBoss = BOSS_LIST[bossIndex]
      const bonus = 100 * (bossIndex + 1)
      const newScore = battleScore + bonus
      setBattleScore(newScore)

      if (sessionId) {
        submitAttempt({
          sessionId,
          gesturePrompt: battleVulnerability,
          userGesture: gesture,
          isCorrect: true
        }).catch(() => {})
      }

      if (bossIndex + 1 >= BOSS_LIST.length) {
        const finalScore = newScore + playerHp * 2
        setBattleScore(finalScore)
        setBattleState('victory')
        speak('Round completed.')
        saveScore(GUEST_ID, finalScore)
      } else {
        const nextIndex = bossIndex + 1
        const nextBoss = BOSS_LIST[nextIndex]
        setBossIndex(nextIndex)
        setBossHp(nextBoss.maxHp)
        setBattleTimer(nextBoss.timeLimit)
        const vuls = category === 'all'
          ? [...nextBoss.vulnerabilities, ...nextBoss.vulnerabilitiesThings]
          : category === 'animals'
            ? nextBoss.vulnerabilities
            : nextBoss.vulnerabilitiesThings
        const nextVul = vuls[Math.floor(Math.random() * vuls.length)]
        setBattleVulnerability(nextVul)
        setBattleFeedback(`Round ${bossIndex + 1} cleared. Moving to ${nextBoss.name}.`)
        speak(`Cleared. Next round: ${nextBoss.name}.`)
      }
    }
  }, [bossHp, gameMode, battleState]) // eslint-disable-line

  // ─── TIME ATTACK (SPEED RUN) LOGIC ───
  const startSpeedrun = async (overrideCategory) => {
    resumeAudio()
    resetAllModes()
    playChallengStart()
    setSpeedScore(0)
    setSpeedTimer(30)
    setSpeedStreak(0)
    targetCompletedRef.current = false
    
    const activeCategory = overrideCategory || category
    const pool = activeCategory === 'all'
      ? GESTURE_NAMES
      : activeCategory === 'animals'
        ? GESTURE_ANIMALS
        : GESTURE_THINGS
    const initialTarget = pool[Math.floor(Math.random() * pool.length)]
    setSpeedTarget(initialTarget)
    setSpeedState('playing')
    setGameMode('speedrun')
    setSpeedFeedback('Time Attack started. Form ' + GESTURE_INFO[initialTarget].label + '.')
    speak(`Time Attack started. Form ${GESTURE_INFO[initialTarget].label}.`)

    try {
      const res = await startChallenge(GUEST_ID)
      if (res && res.sessionId) {
        setSessionId(res.sessionId)
      }
    } catch (e) {
      setSessionId(null)
    }
  }

  // Watch for speedrun game over
  useEffect(() => {
    if (gameMode === 'speedrun' && speedState === 'playing' && speedTimer === 0) {
      setSpeedState('gameover')
      if (speedTargetTimeoutRef.current) clearTimeout(speedTargetTimeoutRef.current)
      playError()
      speak(`Time expired. Total score: ${speedScore}.`)
      saveScore(GUEST_ID, speedScore)
    }
  }, [speedTimer, gameMode, speedState, speedScore])

  // Count down speedrun timer
  useEffect(() => {
    if (gameMode !== 'speedrun' || speedState !== 'playing') return

    speedTimerRef.current = setInterval(() => {
      setSpeedTimer((t) => Math.max(0, t - 1))
    }, 1000)

    return () => clearInterval(speedTimerRef.current)
  }, [gameMode, speedState])

  // Check gesture match for speedrun
  useEffect(() => {
    if (gameMode !== 'speedrun' || speedState !== 'playing' || targetCompletedRef.current) return

    if (gesture === speedTarget) {
      targetCompletedRef.current = true
      playSuccess()
      
      const newStreak = speedStreak + 1
      setSpeedStreak(newStreak)
      
      const points = 10 * Math.min(5, newStreak)
      const newScore = speedScore + points
      setSpeedScore(newScore)
      
      setSpeedTimer(t => Math.min(30, t + 2))
      setSpeedFeedback(`Correct sign. +${points} pts (+2s added).`)

      if (sessionId) {
        submitAttempt({
          sessionId,
          gesturePrompt: speedTarget,
          userGesture: gesture,
          isCorrect: true,
          points
        }).catch(() => {})
      }
      
      if (speedTargetTimeoutRef.current) clearTimeout(speedTargetTimeoutRef.current)
      speedTargetTimeoutRef.current = setTimeout(() => {
        const pool = category === 'all'
          ? GESTURE_NAMES
          : category === 'animals'
            ? GESTURE_ANIMALS
            : GESTURE_THINGS
        const filtered = pool.filter(g => g !== speedTarget)
        const nextTarget = filtered.length > 0 
          ? filtered[Math.floor(Math.random() * filtered.length)]
          : pool[0]
        setSpeedTarget(nextTarget)
        targetCompletedRef.current = false
        if (GESTURE_INFO[nextTarget]) {
          speak(GESTURE_INFO[nextTarget].label)
        }
      }, 500)
    }
  }, [gesture, speedTarget, gameMode, speedState, speedStreak, speedScore, category, sessionId]) // eslint-disable-line

  const handleStartGame = useCallback(({ mode, category: nextCategory }) => {
    resumeAudio()
    setCategory(nextCategory)
    setIsSetupOpen(false)
    setGameStarted(true)
    if (mode === 'free') {
      resetAllModes()
      setGameMode('free')
      navigate('/')
    } else if (mode === 'battle') {
      navigate('/battle')
      startBattle(nextCategory)
    } else if (mode === 'speedrun') {
      navigate('/speedrun')
      startSpeedrun(nextCategory)
    }
  }, [category, resetAllModes, navigate]) // eslint-disable-line

  // Route: 404 handler
  const knownPaths = ['/', '/guide', '/battle', '/speedrun', '/leaderboard', '/about', '/privacy', '/terms', '/cookies', '/admin']
  const is404 = !knownPaths.includes(currentPath)
  const effectiveGuestId = currentUser?.guestId || GUEST_ID

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* ── HEADER ── */}
      <Header 
        guestId={effectiveGuestId}
        user={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenAdmin={() => navigate('/admin')}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        speak={speak}
        onNavigate={navigate}
      />

      {/* ── CORE WRAPPER (SIDEBAR + MAIN CONTENT) ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {/* ── SIDEBAR NAVIGATION ── */}
        <Sidebar activeTab={getActiveTab()} onNavigate={navigate} user={currentUser} />

        {/* ── MAIN CONTENT CONTAINER ── */}
        <main style={{ flex: 1, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
          
          {/* Breadcrumbs for sub-pages */}
          <Breadcrumbs path={currentPath} onNavigate={navigate} />

          {/* 404 View */}
          {is404 && (
            <NotFound onNavigate={navigate} />
          )}

          {/* PRIVACY POLICY PAGE */}
          {currentPath === '/privacy' && (
            <div className="glass-panel" style={{ padding: '28px 32px' }}>
              <PrivacyPolicy />
            </div>
          )}

          {/* TERMS AND CONDITIONS PAGE */}
          {currentPath === '/terms' && (
            <div className="glass-panel" style={{ padding: '28px 32px' }}>
              <TermsAndConditions />
            </div>
          )}

          {/* COOKIE & LOCAL STORAGE POLICY PAGE */}
          {currentPath === '/cookies' && (
            <div className="glass-panel" style={{ padding: '28px 32px' }}>
              <CookiePolicy />
            </div>
          )}

          {/* GESTURE GUIDE / LIBRARY */}
          {currentPath === '/guide' && (
            <div className="glass-panel" style={{ padding: 24 }}>
              <Gallery onClose={() => navigate('/')} />
            </div>
          )}

          {/* LEADERBOARDS */}
          {currentPath === '/leaderboard' && (
            <div className="glass-panel" style={{ padding: 24, maxWidth: 640, margin: '0 auto', width: '100%' }}>
              <Leaderboard guestId={GUEST_ID} onClose={() => navigate('/')} />
            </div>
          )}

          {/* HOW IT WORKS */}
          {currentPath === '/about' && (
            <div className="glass-panel" style={{ padding: 32, maxWidth: 760, margin: '0 auto' }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
                How ShadowPlay Computer Vision Operates
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: 'var(--text-dim)', lineHeight: 1.6, fontSize: 14 }}>
                <p>
                  ShadowPlay executes hand gesture classification entirely within your client web browser. Utilizing MediaPipe Hand landmark estimation via WebAssembly and WebGL, the browser processes 21 three-dimensional skeletal coordinates in real time.
                </p>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '0 0 8px 0' }}>
                    Client-Side Data Isolation
                  </h2>
                  <p style={{ margin: 0 }}>
                    Video camera streams are processed locally in your browser frame-by-frame and immediately discarded from memory. No audio, image, or video stream is ever transmitted over the network or recorded on external servers.
                  </p>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '0 0 8px 0' }}>
                    Geometric Rule Classification
                  </h2>
                  <p style={{ margin: 0 }}>
                    Our rule-based classifier evaluates Euclidean distance ratios between the wrist landmark, metacarpophalangeal (MCP) knuckles, proximal interphalangeal (PIP) joints, and fingertips. Hand shape recognition is rotation-invariant, ensuring reliable detection across various angles and distances.
                  </p>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '0 0 8px 0' }}>
                    Hardware Acceleration & Audio Feedback
                  </h2>
                  <p style={{ margin: 0 }}>
                    Shadow silhouettes are rendered on an HTML5 2D Canvas with sub-pixel path tracing. Audio cues are generated synthetically using the standard Web Audio API oscillators, avoiding external audio tracking dependencies.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ADMINISTRATION PORTAL */}
          {currentPath === '/admin' && (
            currentUser?.role === 'admin' ? (
              <AdminDashboard onClose={() => navigate('/')} currentUser={currentUser} />
            ) : (
              <div
                className="depth-plate"
                style={{
                  padding: '44px 36px',
                  maxWidth: 560,
                  margin: '40px auto',
                  textAlign: 'center',
                  borderRadius: 16,
                  background: 'linear-gradient(165deg, #161c2a 0%, #0d121c 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', color: '#f59e0b', marginBottom: 8 }}>
                  RESTRICTED ACCESS FACILITY
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 14px 0', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  ADMINISTRATION PORTAL
                </h2>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6, margin: '0 0 28px 0' }}>
                  This subsystem requires verified administrative clearance. Please sign in with administrator credentials to manage operatives and inspect telemetry.
                </p>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="depth-button primary-depth"
                    style={{
                      padding: '12px 26px',
                      fontSize: '13px',
                      fontWeight: 800,
                      background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      boxShadow: '0 4px 0 #92400e, 0 6px 16px rgba(217, 119, 6, 0.4)',
                    }}
                  >
                    SIGN IN TO ACCESS
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="depth-button"
                    style={{
                      padding: '12px 22px',
                      fontSize: '13px',
                      fontWeight: 700,
                      background: '#1a2233',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                  >
                    RETURN TO STUDIO
                  </button>
                </div>
              </div>
            )
          )}

          {/* DASHBOARD / STUDIO / BATTLE / SPEEDRUN VIEW */}
          {(currentPath === '/' || currentPath === '/battle' || currentPath === '/speedrun') && (
            <>
              {/* Optional Splash / Intro view before initial camera initialization */}
              {!gameStarted && currentPath === '/' ? (
                <div>
                  <SplashScreen onPlayClick={() => { setGameStarted(true); setIsSetupOpen(true); }} />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  
                  {/* Dynamic 3D Optical Theatre Stage */}
                  <Stage3D
                    gesture={gesture}
                    center={center}
                    flash={flash}
                    gestureInfo={gesture ? GESTURE_INFO[gesture] : null}
                    onHandResult={handleHandResult}
                    targetGesture={gameMode === 'battle' ? battleVulnerability : gameMode === 'speedrun' ? speedTarget : null}
                  />

                  {/* Controller & Practice Panel with 3D Depth */}
                  <div className="card-3d" style={{ padding: 22 }}>
                    {/* Category Selector Bar */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 18,
                      flexWrap: 'wrap',
                      gap: 12,
                      borderBottom: '1px solid var(--border)',
                      paddingBottom: 16
                    }}>
                      <div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Gesture Library Filter</h3>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Filter active targets by classification category.</p>
                      </div>
                      <div className="rocker-switch">
                        <button 
                          type="button"
                          onClick={() => setCategory('animals')}
                          className={`rocker-button ${category === 'animals' ? 'active' : ''}`}
                        >
                          Animals
                        </button>
                        <button 
                          type="button"
                          onClick={() => setCategory('things')}
                          className={`rocker-button ${category === 'things' ? 'active' : ''}`}
                        >
                          Objects
                        </button>
                        <button 
                          type="button"
                          onClick={() => setCategory('all')}
                          className={`rocker-button ${category === 'all' ? 'active' : ''}`}
                        >
                          All Gestures
                        </button>
                      </div>
                    </div>

                    {/* Mode Navigation Tabs with 3D Rocker Segment */}
                    <div style={{
                      display: 'flex',
                      borderBottom: '1px solid var(--border)',
                      marginBottom: 20,
                      gap: 12,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      paddingBottom: 16,
                    }}>
                      <div className="rocker-switch" style={{ flex: '1 1 360px' }}>
                        <button 
                          type="button"
                          onClick={() => { resetAllModes(); navigate('/'); }} 
                          className={`rocker-button ${gameMode === 'free' ? 'active' : ''}`}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        >
                          <PracticeIcon size={16} />
                          <span>Free Practice</span>
                        </button>

                        <button 
                          type="button"
                          onClick={() => {
                            if (gameMode !== 'battle') {
                              startBattle()
                            }
                            navigate('/battle')
                          }} 
                          className={`rocker-button ${gameMode === 'battle' ? 'active' : ''}`}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        >
                          <QuestIcon size={16} />
                          <span>Shadow Quest</span>
                        </button>

                        <button 
                          type="button"
                          onClick={() => {
                            if (gameMode !== 'speedrun') {
                              startSpeedrun()
                            }
                            navigate('/speedrun')
                          }} 
                          className={`rocker-button ${gameMode === 'speedrun' ? 'active' : ''}`}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        >
                          <TimerIcon size={16} />
                          <span>Time Attack</span>
                        </button>
                      </div>

                      {/* Right utility buttons */}
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                        {gameMode !== 'free' && (
                          <button
                            type="button"
                            onClick={() => { resetAllModes(); navigate('/'); }}
                            className="btn btn-secondary"
                            style={{ fontSize: 12, padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
                          >
                            <ExitIcon size={14} />
                            <span>Exit Mode</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsSetupOpen(true)}
                          className="btn btn-primary"
                          style={{ fontSize: 12, padding: '7px 16px' }}
                        >
                          Configure Session
                        </button>
                      </div>
                    </div>

                    {/* Free Practice Display */}
                    {gameMode === 'free' && (
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        minHeight: 160,
                        textAlign: 'center',
                        gap: 12,
                        padding: '12px 0'
                      }}>
                        {gesture ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '3px 10px',
                              borderRadius: 4,
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border)',
                              fontSize: 11,
                              fontWeight: 700,
                              color: GESTURE_INFO[gesture]?.color || 'var(--accent-orange)',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase'
                            }}>
                              <span>Identified Shape</span>
                            </div>
                            <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                              {GESTURE_INFO[gesture]?.label}
                            </h3>
                            <p style={{ color: 'var(--text-dim)', maxWidth: 440, fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                              {GESTURE_INFO[gesture]?.description}
                            </p>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                            <div style={{ color: 'var(--text-muted)' }}>
                              <PracticeIcon size={32} />
                            </div>
                            <h3 style={{ color: 'var(--text)', fontWeight: 600, fontSize: 15, margin: 0 }}>
                              Form a hand silhouette in front of your camera
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>
                              Open the <button type="button" onClick={() => navigate('/guide')} style={{ background: 'none', border: 'none', color: 'var(--accent-orange)', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}>Gesture Reference</button> to view finger placement guides.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Shadow Quest Panel */}
                    {gameMode === 'battle' && (
                      <BattlePanel 
                        battleState={battleState}
                        startBattle={startBattle}
                        bossIndex={bossIndex}
                        bossHp={bossHp}
                        playerHp={playerHp}
                        battleTimer={battleTimer}
                        battleVulnerability={battleVulnerability}
                        battleFeedback={battleFeedback}
                        battleScore={battleScore}
                        shakePlayer={shakePlayer}
                        hitBoss={hitBoss}
                        BOSS_LIST={BOSS_LIST}
                        GESTURE_INFO={GESTURE_INFO}
                        category={category}
                        setCategory={setCategory}
                      />
                    )}

                    {/* Time Attack Panel */}
                    {gameMode === 'speedrun' && (
                      <SpeedrunPanel 
                        speedState={speedState}
                        startSpeedrun={startSpeedrun}
                        speedTimer={speedTimer}
                        speedScore={speedScore}
                        speedStreak={speedStreak}
                        speedTarget={speedTarget}
                        speedFeedback={speedFeedback}
                        GESTURE_INFO={GESTURE_INFO}
                        category={category}
                        setCategory={setCategory}
                      />
                    )}

                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* ── FOOTER (COMPLIANCE & LEGAL NOTICES) ── */}
      <footer style={{
        padding: '24px 20px',
        color: 'var(--text-muted)',
        fontSize: 12,
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-card)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center' }}>
          <button type="button" onClick={() => navigate('/privacy')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Privacy Policy</button>
          <button type="button" onClick={() => navigate('/terms')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Terms of Service</button>
          <button type="button" onClick={() => navigate('/cookies')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Cookie Policy</button>
          <button type="button" onClick={() => navigate('/about')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>How It Works</button>
          <button type="button" onClick={() => navigate('/guide')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Gesture Library</button>
        </div>
        <div style={{ textAlign: 'center', lineHeight: 1.6 }}>
          <span>&copy; 2026 ShadowPlay Studio. All rights reserved.</span>
          <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            Operated in compliance with the Digital Personal Data Protection Act, 2023 (India) and global privacy standards. Camera processing is executed client-side only.
          </span>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieBanner onOpenPolicy={() => navigate('/cookies')} />

      {/* Play Configuration Modal */}
      <PlaySetupModal 
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onStartGame={handleStartGame}
      />

      {/* Operative Sign In / Registration Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}
