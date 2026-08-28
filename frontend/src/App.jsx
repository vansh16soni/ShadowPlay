import { useState, useCallback, useRef, useEffect } from 'react'
import WebcamFeed from './components/WebcamFeed'
import ShadowCanvas from './components/ShadowCanvas'
import Gallery from './components/Gallery'
import Leaderboard from './components/Leaderboard'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import BattlePanel from './components/BattlePanel'
import SpeedrunPanel from './components/SpeedrunPanel'
import PlaySetupModal from './components/PlaySetupModal'
import SplashScreen from './components/SplashScreen'
import Starfield from './components/Starfield'
import { GESTURE_INFO, GESTURE_NAMES, GESTURE_ANIMALS, GESTURE_THINGS } from './utils/gestureClassifier'
import { playGestureChange, playSuccess, playError, playChallengStart } from './utils/sounds'
import { startChallenge, saveScore, submitAttempt, syncOfflineScores } from './utils/api'

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
    emoji: '🦇',
    maxHp: 80,
    timeLimit: 8,
    vulnerabilities: ['bird', 'butterfly', 'goat'],
    vulnerabilitiesThings: ['scissors', 'glasses', 'cup'],
    damageMultiplier: 20,
    color: '#ef4444' // Red
  },
  {
    name: 'Gloom Wolf',
    emoji: '🐺',
    maxHp: 120,
    timeLimit: 6,
    vulnerabilities: ['dog', 'rabbit', 'fox', 'horse', 'donkey'],
    vulnerabilitiesThings: ['crown', 'airplane', 'scissors'],
    damageMultiplier: 25,
    color: '#f97316' // Orange
  },
  {
    name: 'Abyss Dragon',
    emoji: '🐉',
    maxHp: 160,
    timeLimit: 5,
    vulnerabilities: ['snake', 'bird', 'goat', 'fox', 'spider', 'pig', 'lizard'],
    vulnerabilitiesThings: ['cup', 'crown', 'glasses', 'airplane'],
    damageMultiplier: 30,
    color: '#fbbf24' // Gold
  }
]

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard | learn | leaderboard | about
  
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('shadowplay_theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('shadowplay_theme', theme)
  }, [theme])

  // Category State
  const [category, setCategory] = useState('animals') // animals | things
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
  const targetCompletedRef = useRef(false)

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

  // Web Speech API Voice Guidance
  function speak(text) {
    if (voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 1.2
      window.speechSynthesis.speak(u)
    }
  }

  useEffect(() => {
    if (gesture && gameMode === 'free') {
      const info = GESTURE_INFO[gesture]
      if (info) speak(info.label)
    }
  }, [gesture, gameMode, voiceEnabled]) // eslint-disable-line

  // ─── SHADOW BATTLE MODE LOGIC ───
  const startBattle = async (overrideCategory) => {
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
    setBattleFeedback('Battle Started! Cast ' + GESTURE_INFO[vuls[0]].label + ' to attack!')
    
    // Choose initial random vulnerability
    const initialVul = vuls[Math.floor(Math.random() * vuls.length)]
    setBattleVulnerability(initialVul)
    setBattleState('playing')
    setGameMode('battle')
    speak(`Prepare to battle ${boss.name}! Cast ${GESTURE_INFO[initialVul].label}!`)

    // Start background session on database
    try {
      const res = await startChallenge(GUEST_ID)
      if (res && res.sessionId) {
        setSessionId(res.sessionId)
      }
    } catch (e) {
      console.warn('Backend unavailable, scoring offline.')
      setSessionId(null)
    }
  }

  // Handle player defeat (HP reaches 0)
  useEffect(() => {
    if (gameMode === 'battle' && battleState === 'playing' && playerHp === 0) {
      setBattleState('gameover')
      playError()
      speak('Defeat! The shadow beast prevailed.')
      saveScore(GUEST_ID, battleScore)
    }
  }, [playerHp, gameMode, battleState, battleScore])

  // Count down boss attack timer
  useEffect(() => {
    if (gameMode !== 'battle' || battleState !== 'playing') return

    battleTimerRef.current = setInterval(() => {
      setBattleTimer((t) => {
        if (t <= 1) {
          // Boss attacks player!
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
              setBattleFeedback(`${currentBoss.name} strikes! You lost 20 HP!`)
              speak('Ouch! Look out!')
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
          
          // Randomize vulnerability on successful hits to keep it dynamic
          const remainingVuls = category === 'all'
            ? [...currentBoss.vulnerabilities, ...currentBoss.vulnerabilitiesThings]
            : category === 'animals'
              ? currentBoss.vulnerabilities
              : currentBoss.vulnerabilitiesThings
          const nextVul = remainingVuls[Math.floor(Math.random() * remainingVuls.length)]
          setBattleVulnerability(nextVul)
          setBattleFeedback(`Direct hit! Spell shifting... Cast ${GESTURE_INFO[nextVul].label}!`)
          speak(`Hit! Quick, make ${GESTURE_INFO[nextVul].label}!`)

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

      // Submit final success attempt
      if (sessionId) {
        submitAttempt({
          sessionId,
          gesturePrompt: battleVulnerability,
          userGesture: gesture,
          isCorrect: true
        }).catch(() => {})
      }

      if (bossIndex + 1 >= BOSS_LIST.length) {
        // Quest Cleared!
        const finalScore = newScore + playerHp * 2
        setBattleScore(finalScore)
        setBattleState('victory')
        speak('Victory! You have cleared the Shadow Quest!')
        saveScore(GUEST_ID, finalScore)
      } else {
        // Go to next Boss
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
        setBattleFeedback(`You defeated ${currentBoss.name}! Now facing ${nextBoss.name}!`)
        speak(`Victory! Prepare to face ${nextBoss.name}!`)
      }
    }
  }, [bossHp, gameMode, battleState]) // eslint-disable-line

  // ─── TIME ATTACK (SPEED RUN) LOGIC ───
  const startSpeedrun = async (overrideCategory) => {
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
    setSpeedFeedback('Time Attack started! Make a ' + GESTURE_INFO[initialTarget].label + '!')
    speak(`Time Attack started! Make ${GESTURE_INFO[initialTarget].label}!`)

    // Start background database session
    try {
      const res = await startChallenge(GUEST_ID)
      if (res && res.sessionId) {
        setSessionId(res.sessionId)
      }
    } catch (e) {
      console.warn('Backend offline, scoring offline.')
      setSessionId(null)
    }
  }

  // Watch for speedrun game over
  useEffect(() => {
    if (gameMode === 'speedrun' && speedState === 'playing' && speedTimer === 0) {
      setSpeedState('gameover')
      playError()
      speak(`Time is up! You scored ${speedScore} points.`)
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
      
      // Calculate score with streak bonus
      const points = 10 * Math.min(5, newStreak)
      const newScore = speedScore + points
      setSpeedScore(newScore)
      
      // Add +2s time bonus
      setSpeedTimer(t => Math.min(30, t + 2))
      
      setSpeedFeedback(`Correct! +${points} points! +2s Bonus!`)

      // Submit attempt
      if (sessionId) {
        submitAttempt({
          sessionId,
          gesturePrompt: speedTarget,
          userGesture: gesture,
          isCorrect: true
        }).catch(() => {})
      }
      
      // Load next random target
      setTimeout(() => {
        const pool = category === 'all'
          ? GESTURE_NAMES
          : category === 'animals'
            ? GESTURE_ANIMALS
            : GESTURE_THINGS
        const nextTarget = pool.filter(g => g !== speedTarget)[Math.floor(Math.random() * (pool.length - 1))]
        setSpeedTarget(nextTarget)
        targetCompletedRef.current = false
        speak(GESTURE_INFO[nextTarget].label)
      }, 500)
    }
  }, [gesture, speedTarget, gameMode, speedState, speedStreak, speedScore, category, sessionId]) // eslint-disable-line

  const handleStartGame = useCallback(({ mode, category: nextCategory }) => {
    setCategory(nextCategory)
    setIsSetupOpen(false)
    setGameStarted(true)
    if (mode === 'free') {
      setGameMode('free')
    } else if (mode === 'battle') {
      startBattle(nextCategory)
    } else if (mode === 'speedrun') {
      startSpeedrun(nextCategory)
    }
  }, [category]) // eslint-disable-line

  if (!gameStarted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', zIndex: 1, position: 'relative' }}>
        <Starfield theme={theme} />
        <SplashScreen onPlayClick={() => setIsSetupOpen(true)} theme={theme} />
        <PlaySetupModal 
          isOpen={isSetupOpen}
          onClose={() => setIsSetupOpen(false)}
          onStartGame={handleStartGame}
        />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', zIndex: 1, position: 'relative' }}>
      <Starfield theme={theme} />

      {/* Glow Orbs background */}
      <div className="glow-orb" style={{ top: '10%', left: '5%' }}></div>
      <div className="glow-orb glow-orb-cyan" style={{ bottom: '15%', right: '10%' }}></div>

      {/* ── HEADER ── */}
      <Header 
        guestId={GUEST_ID}
        theme={theme}
        setTheme={setTheme}
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        speak={speak}
      />

      {/* ── CORE WRAPPER (SIDEBAR + MAIN CONTENT) ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', zIndex: 10 }}>
        {/* ── SIDEBAR NAVIGATION ── */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* ── MAIN CONTENT CONTAINER ── */}
        <main style={{ flex: 1, padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
          
          {/* TAB 1: GAME ARCADE */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Play Area: Camera & Projection Wall side-by-side */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: 24,
                width: '100%'
              }}>
                {/* Webcam Panel */}
                <div className="glass-panel" style={{ 
                  padding: 20, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 12,
                  boxShadow: '0 8px 30px rgba(6, 182, 212, 0.05)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 18, color: 'var(--text)' }}>AI Visor Stream</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="live-dot" />
                      <span style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.05em', fontWeight: 600 }}>TRACKING</span>
                    </div>
                  </div>
                  <WebcamFeed onHandResult={handleHandResult} />
                </div>

                {/* Projection Canvas Panel */}
                <div className="glass-panel" style={{ 
                  padding: 20, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 12,
                  boxShadow: '0 8px 30px rgba(147, 51, 234, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Glowing Projector Beam Effect */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: gesture 
                      ? `linear-gradient(90deg, transparent, ${GESTURE_INFO[gesture]?.color || 'var(--accent-purple)'}, transparent)` 
                      : 'transparent',
                    animation: 'beam-flow 1.5s linear infinite',
                    backgroundSize: '200% auto',
                    opacity: gesture ? 0.7 : 0
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 18, color: 'var(--text)' }}>Shadow Canvas</h3>
                    <span style={{
                      fontSize: 11,
                      color: gesture ? GESTURE_INFO[gesture].color : 'var(--text-muted)',
                      fontWeight: 700,
                      background: gesture ? `${GESTURE_INFO[gesture].color}15` : 'rgba(255,255,255,0.02)',
                      padding: '2px 10px',
                      borderRadius: 20,
                      border: `1px solid ${gesture ? GESTURE_INFO[gesture].color + '33' : 'var(--border)'}`,
                      letterSpacing: '0.05em'
                    }}>
                      {gesture ? GESTURE_INFO[gesture].label.toUpperCase() : 'NO SHADOW'}
                    </span>
                  </div>
                  <ShadowCanvas gesture={gesture} center={center} flash={flash} />
                </div>
              </div>

              {/* Central Controller Box */}
              <div className="glass-panel" style={{ padding: 24 }}>
                
                {/* Category Switcher Tabs */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                  flexWrap: 'wrap',
                  gap: 12,
                  borderBottom: '1px dashed var(--border)',
                  paddingBottom: 16
                }}>
                  <div>
                    <h4 style={{ fontSize: 16, color: 'var(--text)' }}>Play Category Selection</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>Practice shadow animals or everyday objects.</p>
                  </div>
                  <div style={{
                    display: 'flex',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: 4,
                    gap: 4
                  }}>
                    <button 
                      onClick={() => setCategory('animals')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        background: category === 'animals' ? 'var(--accent-orange)' : 'transparent',
                        color: category === 'animals' ? '#fff' : 'var(--text-dim)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      🐕 Animals
                    </button>
                    <button 
                      onClick={() => setCategory('things')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        background: category === 'things' ? 'var(--accent-orange)' : 'transparent',
                        color: category === 'things' ? '#fff' : 'var(--text-dim)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      ⚙️ Things
                    </button>
                    <button 
                      onClick={() => setCategory('all')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        background: category === 'all' ? 'var(--accent-orange)' : 'transparent',
                        color: category === 'all' ? '#fff' : 'var(--text-dim)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      🌀 All
                    </button>
                  </div>
                </div>

                {/* Game mode selector tabs */}
                <div style={{
                  display: 'flex',
                  borderBottom: '1px solid var(--border)',
                  marginBottom: 24,
                  gap: 8,
                  alignItems: 'center'
                }}>
                  <button 
                    onClick={() => { setGameMode('free'); clearInterval(battleTimerRef.current); clearInterval(speedTimerRef.current); }} 
                    style={{
                      padding: '12px 24px',
                      background: 'none',
                      color: gameMode === 'free' ? 'var(--accent-cyan)' : 'var(--text-dim)',
                      fontWeight: 600,
                      fontSize: 15,
                      borderBottom: gameMode === 'free' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                    }}
                  >
                    🧘 Free Play Practice
                  </button>
                  {gameMode === 'battle' && (
                    <button 
                      style={{
                        padding: '12px 24px',
                        background: 'none',
                        color: 'var(--accent-purple)',
                        fontWeight: 600,
                        fontSize: 15,
                        borderBottom: '2px solid var(--accent-purple)',
                      }}
                    >
                      ⚔️ Shadow Quest (Active)
                    </button>
                  )}
                  {gameMode === 'speedrun' && (
                    <button 
                      style={{
                        padding: '12px 24px',
                        background: 'none',
                        color: 'var(--accent-pink)',
                        fontWeight: 600,
                        fontSize: 15,
                        borderBottom: '2px solid var(--accent-pink)',
                      }}
                    >
                      ⏱ Time Attack (Active)
                    </button>
                  )}
                  
                  {gameMode !== 'free' ? (
                    <button
                      onClick={() => { setGameMode('free'); clearInterval(battleTimerRef.current); clearInterval(speedTimerRef.current); }}
                      style={{
                        marginLeft: 'auto',
                        padding: '8px 16px',
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 700,
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--accent-pink)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      Quit Challenge 🚪
                    </button>
                  ) : (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => { setGameStarted(false); clearInterval(battleTimerRef.current); clearInterval(speedTimerRef.current); }}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 700,
                          background: 'rgba(255,255,255,0.03)',
                          color: 'var(--text-dim)',
                          border: '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        Exit to Menu 🚪
                      </button>
                      <button
                        onClick={() => setIsSetupOpen(true)}
                        style={{
                          padding: '8px 20px',
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-gold))',
                          color: '#000',
                          border: 'none',
                          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)',
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                      >
                        🎮 Play Game
                      </button>
                    </div>
                  )}
                </div>

                {/* ── FREE PLAY PANEL ── */}
                {gameMode === 'free' && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    minHeight: 180,
                    textAlign: 'center',
                    gap: 16
                  }}>
                    {gesture ? (
                      <div style={{ 
                        animation: 'slideUp 0.3s ease-out',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 
                      }}>
                        <div style={{ fontSize: 64 }}>{GESTURE_INFO[gesture].emoji}</div>
                        <h2 style={{ fontSize: 32, color: GESTURE_INFO[gesture].color }}>
                          {GESTURE_INFO[gesture].label}
                        </h2>
                        <p style={{ color: 'var(--text-dim)', maxWidth: 400 }}>
                          {GESTURE_INFO[gesture].description}
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: 48, opacity: 0.3 }}>✋</div>
                        <h3 style={{ color: 'var(--text-dim)', fontWeight: 500 }}>Form a hand shadow sign to begin</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                          Need help? Switch to the <strong>Gesture Guide</strong> tab to learn how.
                        </p>
                      </div>
                    )}

                    {/* Centered Play Game CTA */}
                    <div style={{
                      marginTop: 16,
                      padding: '16px 24px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px dashed var(--border)',
                      borderRadius: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      maxWidth: 400,
                    }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Ready for the real trial?</span>
                      <button
                        onClick={() => setIsSetupOpen(true)}
                        style={{
                          padding: '8px 20px',
                          borderRadius: 8,
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-gold))',
                          color: '#000',
                          fontSize: 13,
                          cursor: 'pointer',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                          transition: 'all 0.2s'
                        }}
                      >
                        🎮 Play Game
                      </button>
                    </div>
                  </div>
                )}

                {/* ── SHADOW BATTLE (QUEST) PANEL ── */}
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

                {/* ── TIME ATTACK PANEL ── */}
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

          {/* TAB 2: GESTURE GUIDE */}
          {activeTab === 'learn' && (
            <div className="glass-panel" style={{ padding: 24 }}>
              <Gallery onClose={() => setActiveTab('dashboard')} />
            </div>
          )}

          {/* TAB 3: LEADERBOARDS */}
          {activeTab === 'leaderboard' && (
            <div className="glass-panel" style={{ padding: 24, maxWidth: 500, margin: '0 auto', width: '100%' }}>
              <Leaderboard guestId={GUEST_ID} onClose={() => setActiveTab('dashboard')} />
            </div>
          )}

          {/* TAB 4: HOW IT WORKS */}
          {activeTab === 'about' && (
            <div className="glass-panel" style={{ padding: 32, maxWidth: 700, margin: '0 auto' }}>
              <h2 style={{ fontSize: 28, color: 'var(--accent-purple)', marginBottom: 16 }}>How ShadowPlay AI Works</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: 'var(--text-dim)', lineHeight: 1.6 }}>
                <p>
                  ShadowPlay AI combines browser-based WebRTC webcam access, real-time machine learning, and hardware-accelerated rendering to cast realistic hand shadow puppets on your screen.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h3 style={{ fontSize: 18, color: 'var(--text)', marginTop: 8 }}>🔒 On-Device Privacy First</h3>
                  <p>
                    All hand landmark tracking is calculated entirely inside your web browser using MediaPipe. Your camera feeds or video frames are <strong>never sent to a remote server</strong>.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h3 style={{ fontSize: 18, color: 'var(--text)', marginTop: 8 }}>🖐 21-Landmark Gesture Recognition</h3>
                  <p>
                    The AI processes your hand shape into 21 distinct 3D coordinates. The game rules evaluate the vertical heights and horizontal positions of your fingertips compared to your knuckles (MCP joints) to classify whether you are making a Rabbit, Dog, Bird, Butterfly, or Snake.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h3 style={{ fontSize: 18, color: 'var(--text)', marginTop: 8 }}>🎙 Speech Narration</h3>
                  <p>
                    By checking the speech synthesis speaker button, the game reads out your recognized shadow puppet shapes using the Web Speech API.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      <footer style={{
        padding: '16px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 12,
        borderTop: '1px solid var(--border)',
        background: 'rgba(4, 2, 9, 0.6)',
      }}>
        ShadowPlay.AI &bull; On-device private hand intelligence. &bull; Created with &hearts;
      </footer>

      <PlaySetupModal 
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onStartGame={handleStartGame}
      />
    </div>
  )
}
