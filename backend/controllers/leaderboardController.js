const { User } = require('../models')

// GET /api/leaderboard?limit=10
async function getLeaderboard(req, res) {
  try {
    const rawLimit = parseInt(req.query.limit, 10)
    // Sane bounding: minimum 1, default 10, maximum 50
    const limit = (Number.isFinite(rawLimit) && rawLimit > 0) ? Math.min(rawLimit, 50) : 10

    const topUsers = await User.find({})
      .sort({ totalScore: -1 })
      .limit(limit)
      .select('guestId totalScore -_id')
      .lean()

    res.json(topUsers)
  } catch (err) {
    console.error('getLeaderboard error:', err.message)
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
}

module.exports = { getLeaderboard }
