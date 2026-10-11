const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { requireAdminAuth } = require('../middleware/auth')
const { User, Session, Attempt } = require('../models')

// All routes here require valid admin credentials
router.use(requireAdminAuth)

/**
 * GET /api/admin/users
 * Returns all registered and guest operatives with rounds played count.
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('-password')
      .lean()

    // Enrich with count of sessions played
    const guestIds = users.map(u => u.guestId)
    const sessionCounts = await Session.aggregate([
      { $match: { guestId: { $in: guestIds } } },
      { $group: { _id: '$guestId', count: { $sum: 1 }, maxScore: { $max: '$finalScore' } } }
    ])

    const countMap = {}
    sessionCounts.forEach(s => {
      countMap[s._id] = { count: s.count, maxScore: s.maxScore }
    })

    const enriched = users.map(u => ({
      ...u,
      roundsPlayed: countMap[u.guestId]?.count || 0,
      highestSessionScore: countMap[u.guestId]?.maxScore || u.totalScore || 0,
    }))

    res.json(enriched)
  } catch (err) {
    console.error('Fetch admin users error:', err.message)
    res.status(500).json({ error: 'Failed to retrieve operatives list.' })
  }
})

/**
 * GET /api/admin/user/:guestId/sessions
 * Returns detailed history of rounds and gesture attempts for a specific operative.
 */
router.get('/user/:guestId/sessions', async (req, res) => {
  try {
    const { guestId } = req.params
    const user = await User.findOne({ guestId }).select('-password').lean()
    if (!user) {
      return res.status(404).json({ error: 'Operative not found.' })
    }

    const sessions = await Session.find({ guestId })
      .sort({ startTime: -1 })
      .limit(50)
      .lean()

    // Attach attempts to each session
    const sessionIds = sessions.map(s => s.sessionId)
    const attempts = await Attempt.find({ sessionId: { $in: sessionIds } })
      .sort({ timestamp: 1 })
      .lean()

    const attemptsBySession = {}
    attempts.forEach(a => {
      if (!attemptsBySession[a.sessionId]) {
        attemptsBySession[a.sessionId] = []
      }
      attemptsBySession[a.sessionId].push(a)
    })

    const detailedSessions = sessions.map(s => ({
      ...s,
      attempts: attemptsBySession[s.sessionId] || [],
    }))

    res.json({
      user,
      sessions: detailedSessions,
    })
  } catch (err) {
    console.error('Fetch user sessions error:', err.message)
    res.status(500).json({ error: 'Failed to retrieve operative sessions.' })
  }
})

/**
 * POST /api/admin/user/:guestId/toggle-suspend
 * Toggle or set suspension state of an operative.
 */
router.post('/user/:guestId/toggle-suspend', async (req, res) => {
  try {
    const { guestId } = req.params
    const user = await User.findOne({ guestId })

    if (!user) {
      return res.status(404).json({ error: 'Operative not found.' })
    }

    // Do not allow suspending the root admin
    if (user.role === 'admin' && user.email === 'admin@vs') {
      return res.status(400).json({ error: 'Root administrative account cannot be suspended.' })
    }

    // Toggle or apply explicit state
    const newStatus = typeof req.body.isSuspended === 'boolean'
      ? req.body.isSuspended
      : !user.isSuspended

    user.isSuspended = newStatus
    await user.save()

    res.json({
      ok: true,
      guestId: user.guestId,
      name: user.name,
      isSuspended: user.isSuspended,
      message: user.isSuspended ? 'Operative suspended successfully.' : 'Operative unblocked successfully.',
    })
  } catch (err) {
    console.error('Toggle suspend error:', err.message)
    res.status(500).json({ error: 'Failed to update operative suspension state.' })
  }
})

/**
 * GET /api/admin/health
 * Returns server and database diagnostics.
 */
router.get('/health', async (req, res) => {
  try {
    const memoryUsage = process.memoryUsage()
    const healthData = {
      status: 'operational',
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      database: {
        readyState: mongoose.connection.readyState,
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        name: mongoose.connection.name || 'unspecified',
      },
      memory: {
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
      },
      timestamp: new Date().toISOString(),
    }
    res.json(healthData)
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve admin diagnostics' })
  }
})

/**
 * GET /api/admin/stats
 * Aggregate metrics across users, sessions, and attempts.
 */
router.get('/stats', async (req, res) => {
  try {
    const [userCount, sessionCount, attemptCount] = await Promise.all([
      User.countDocuments(),
      Session.countDocuments(),
      Attempt.countDocuments(),
    ])

    const recentSessions = await Session.find()
      .sort({ startTime: -1 })
      .limit(10)
      .select('sessionId guestId finalScore startTime endTime -_id')

    res.json({
      summary: {
        totalOperatives: userCount,
        totalSessions: sessionCount,
        totalAttempts: attemptCount,
      },
      recentSessions,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate admin statistics' })
  }
})

/**
 * POST /api/admin/purge-old-sessions
 * Clean up stale sessions without scores older than 30 days.
 */
router.post('/purge-old-sessions', async (req, res) => {
  try {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const result = await Session.deleteMany({
      startTime: { $lt: cutoff },
      finalScore: 0,
    })

    res.json({
      purgedCount: result.deletedCount || 0,
      cutoffDate: cutoff.toISOString(),
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to purge stale sessions' })
  }
})

module.exports = router
