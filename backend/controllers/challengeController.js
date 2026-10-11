const { randomUUID } = require('crypto')
const { User, Session, Attempt } = require('../models')
const {
  isValidGuestId,
  isValidUUID,
  isValidGesture,
  clampScore,
} = require('../middleware/sanitize')

// POST /api/challenge/start
async function startChallenge(req, res) {
  try {
    const { guestId } = req.body

    if (!isValidGuestId(guestId)) {
      return res.status(400).json({ error: 'Valid guestId is required' })
    }

    // Check if user is suspended
    const existingUser = await User.findOne({ guestId })
    if (existingUser && existingUser.isSuspended) {
      return res.status(403).json({ error: 'Operative account suspended. Challenge locked.' })
    }

    const sessionId = randomUUID()

    // Ensure operative record exists
    await User.findOneAndUpdate(
      { guestId },
      { $setOnInsert: { guestId, totalScore: 0 } },
      { upsert: true, new: true }
    )

    await Session.create({
      sessionId,
      guestId,
      startTime: new Date(),
    })

    res.json({ sessionId })
  } catch (err) {
    console.error('startChallenge error:', err.message)
    res.status(500).json({ error: 'Failed to start challenge' })
  }
}

// POST /api/challenge/attempt
async function submitAttempt(req, res) {
  try {
    const { sessionId, gesturePrompt, userGesture, isCorrect, timeTakenMs, points } = req.body

    if (!isValidUUID(sessionId)) {
      return res.status(400).json({ error: 'Valid sessionId UUID is required' })
    }

    if (!gesturePrompt || typeof gesturePrompt !== 'string' || gesturePrompt.length > 50) {
      return res.status(400).json({ error: 'Valid gesturePrompt is required' })
    }

    // Verify session actually exists
    const existingSession = await Session.findOne({ sessionId })
    if (!existingSession) {
      return res.status(404).json({ error: 'Session not found or expired' })
    }

    // Check if user is suspended
    const sessionUser = await User.findOne({ guestId: existingSession.guestId })
    if (sessionUser && sessionUser.isSuspended) {
      return res.status(403).json({ error: 'Operative account suspended.' })
    }

    // Sanitize userGesture
    const cleanGesture = typeof userGesture === 'string' && userGesture.length <= 50 ? userGesture : 'none'

    // Clean timeTakenMs
    const cleanTime = (typeof timeTakenMs === 'number' && timeTakenMs >= 0 && timeTakenMs <= 300000)
      ? Math.floor(timeTakenMs)
      : null

    await Attempt.create({
      sessionId,
      gesturePrompt: gesturePrompt.slice(0, 50),
      userGesture: cleanGesture,
      isCorrect: Boolean(isCorrect),
      timeTakenMs: cleanTime,
    })

    // Sane bounding on points to prevent spoofing: max 100 pts per attempt
    let pointsToAdd = 0
    if (typeof points === 'number' && Number.isFinite(points)) {
      pointsToAdd = Math.max(0, Math.min(100, Math.floor(points)))
    } else if (isCorrect) {
      pointsToAdd = 10
    }

    if (pointsToAdd > 0) {
      await Session.updateOne(
        { sessionId },
        { $inc: { finalScore: pointsToAdd } }
      )
    }

    const updatedSession = await Session.findOne({ sessionId })
    res.json({ ok: true, runningScore: updatedSession?.finalScore || 0 })
  } catch (err) {
    console.error('submitAttempt error:', err.message)
    res.status(500).json({ error: 'Failed to submit attempt' })
  }
}

// POST /api/challenge/save-score
async function saveScore(req, res) {
  try {
    const { guestId, score } = req.body

    if (!isValidGuestId(guestId)) {
      return res.status(400).json({ error: 'Valid guestId is required' })
    }

    // Check if user is suspended
    const existingUser = await User.findOne({ guestId })
    if (existingUser && existingUser.isSuspended) {
      return res.status(403).json({ error: 'Operative account suspended. Score cannot be recorded.' })
    }

    const validatedScore = clampScore(score)
    if (validatedScore === null) {
      return res.status(400).json({ error: 'Valid non-negative numeric score required' })
    }

    const user = await User.findOneAndUpdate(
      { guestId },
      {
        $setOnInsert: { guestId },
        $max: { totalScore: validatedScore },
      },
      { upsert: true, new: true }
    )

    // Close out open sessions for this operative
    await Session.findOneAndUpdate(
      { guestId, endTime: { $exists: false } },
      { endTime: new Date(), finalScore: validatedScore },
      { sort: { startTime: -1 } }
    )

    res.json({ ok: true, totalScore: user.totalScore })
  } catch (err) {
    console.error('saveScore error:', err.message)
    res.status(500).json({ error: 'Failed to save score' })
  }
}

// GET /api/user/:guestId/stats
async function getUserStats(req, res) {
  try {
    const { guestId } = req.params

    if (!isValidGuestId(guestId)) {
      return res.status(400).json({ error: 'Valid guestId parameter required' })
    }

    const user = await User.findOne({ guestId })
    const sessions = await Session.find({ guestId })
      .sort({ startTime: -1 })
      .limit(20)
      .select('sessionId finalScore startTime endTime -_id')

    res.json({
      guestId,
      name: user?.name,
      email: user?.email,
      role: user?.role || 'user',
      isSuspended: user?.isSuspended || false,
      totalScore: user?.totalScore || 0,
      sessions: sessions.length,
      history: sessions.map(s => ({
        sessionId: s.sessionId,
        finalScore: s.finalScore,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
    })
  } catch (err) {
    console.error('getUserStats error:', err.message)
    res.status(500).json({ error: 'Failed to fetch user stats' })
  }
}

module.exports = { startChallenge, submitAttempt, saveScore, getUserStats }
