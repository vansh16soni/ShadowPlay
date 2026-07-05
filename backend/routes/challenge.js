const express = require('express')
const router = express.Router()
const {
  startChallenge,
  submitAttempt,
  saveScore,
  getUserStats,
} = require('../controllers/challengeController')

router.post('/challenge/start', startChallenge)
router.post('/challenge/attempt', submitAttempt)
router.post('/challenge/save-score', saveScore)
router.get('/user/:guestId/stats', getUserStats)

module.exports = router
