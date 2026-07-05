const { v4: uuidv4 } = require('uuid')
const { User, Session, Attempt } = require('../models')

// POST /api/challenge/start
async function startChallenge(req, res) {
  try {
    const { guestId } = req.body
    if (!guestId) return res.status(400).json({ error: 'guestId is required' })

    const sessionId = uuidv4()

    // Ensure user exists
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
    console.error('startChallenge error:', err)
    res.status(500).json({ error: 'Failed to start challenge' })
  }
}

// POST /api/challenge/attempt
async function submitAttempt(req, res) {
  try {
    const { sessionId, gesturePrompt, userGesture, isCorrect, timeTakenMs } = req.body
    if (!sessionId || !gesturePrompt) {
      return res.status(400).json({ error: 'sessionId and gesturePrompt are required' })
    }

    await Attempt.create({
      sessionId,
      gesturePrompt,
      userGesture: userGesture || 'none',
      isCorrect: !!isCorrect,
      timeTakenMs: timeTakenMs || null,
    })

    if (isCorrect) {
      await Session.updateOne(
        { sessionId },
        { $inc: { finalScore: 10 } }
      )
    }

    const session = await Session.findOne({ sessionId })
    res.json({ ok: true, runningScore: session?.finalScore || 0 })
  } catch (err) {
    console.error('submitAttempt error:', err)
    res.status(500).json({ error: 'Failed to submit attempt' })
  }
}

// POST /api/challenge/save-score
async function saveScore(req, res) {
  try {
    const { guestId, score } = req.body
    if (!guestId || typeof score !== 'number') {
      return res.status(400).json({ error: 'guestId and numeric score required' })
    }

    const user = await User.findOneAndUpdate(
      { guestId },
      {
        $setOnInsert: { guestId },
        $max: { totalScore: score },
      },
      { upsert: true, new: true }
    )

    // Close out the most recent open session for this guest
    await Session.findOneAndUpdate(
      { guestId, endTime: { $exists: false } },
      { endTime: new Date(), finalScore: score },
      { sort: { startTime: -1 } }
    )

    res.json({ ok: true, totalScore: user.totalScore })
  } catch (err) {
    console.error('saveScore error:', err)
    res.status(500).json({ error: 'Failed to save score' })
  }
}

// GET /api/user/:guestId/stats
async function getUserStats(req, res) {
  try {
    const { guestId } = req.params
    const user = await User.findOne({ guestId })
    const sessions = await Session.find({ guestId }).sort({ startTime: -1 }).limit(20)

    res.json({
      guestId,
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
    console.error('getUserStats error:', err)
    res.status(500).json({ error: 'Failed to fetch user stats' })
  }
}

module.exports = { startChallenge, submitAttempt, saveScore, getUserStats }
