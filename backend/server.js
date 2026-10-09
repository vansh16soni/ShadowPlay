require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const challengeRoutes = require('./routes/challenge')
const leaderboardRoutes = require('./routes/leaderboard')

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean)

// ── Middleware ──
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true)
    }
    return callback(null, origin)
  },
  credentials: true,
}))
app.use(express.json())

// ── Routes ──
app.use('/api', challengeRoutes)
app.use('/api', leaderboardRoutes)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

// ── 404 ──
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// ── Start ──
async function start() {
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set. Server will start but DB routes will fail.')
  } else {
    try {
      await mongoose.connect(MONGODB_URI)
      console.log('✅ MongoDB connected')
    } catch (err) {
      console.error('❌ MongoDB connection failed:', err.message)
    }
  }

  app.listen(PORT, () => {
    console.log(`🎭 ShadowPlay backend running on http://localhost:${PORT}`)
  })
}

start()
