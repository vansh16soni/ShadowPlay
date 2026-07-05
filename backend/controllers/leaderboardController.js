const { User } = require('../models')

// GET /api/leaderboard?limit=10
async function getLeaderboard(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50)

    const topUsers = await User.find({})
      .sort({ totalScore: -1 })
      .limit(limit)
      .select('guestId totalScore -_id')

    res.json(topUsers)
  } catch (err) {
    console.error('getLeaderboard error:', err)
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
}

module.exports = { getLeaderboard }
