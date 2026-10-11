require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')
const crypto = require('crypto')

const { sanitizeInputs } = require('./middleware/sanitize')
const { hashPassword } = require('./middleware/auth')
const { User } = require('./models')

const authRoutes = require('./routes/auth')
const challengeRoutes = require('./routes/challenge')
const leaderboardRoutes = require('./routes/leaderboard')
const adminRoutes = require('./routes/admin')

const app = express()

// ── Security Headers & Fingerprinting Prevention ──
app.disable('x-powered-by')

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        connectSrc: ["'self'", 'http://localhost:*', 'ws://localhost:*', 'https://cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
)

// ── Environmental Variable Validation ──
const isProduction = process.env.NODE_ENV === 'production'
const PORT = parseInt(process.env.PORT, 10) || 5000
const MONGODB_URI = process.env.MONGODB_URI
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Admin API Key validation / fallback for development
if (!process.env.ADMIN_API_KEY) {
  if (isProduction) {
    console.error('CRITICAL SECURITY WARNING: ADMIN_API_KEY is not defined in production environment!')
  } else {
    const devKey = crypto.randomBytes(16).toString('hex')
    process.env.ADMIN_API_KEY = devKey
    console.log(`Development notice: ADMIN_API_KEY was generated dynamically: ${devKey}`)
  }
}

// ── Strict CORS Policy ──
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        if (!isProduction) return callback(null, true)
        return callback(null, true)
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('CORS request blocked by security policy'), false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key', 'x-session-token'],
    maxAge: 86400,
  })
)

// ── Payload Size Limits & Input Sanitization ──
app.use(express.json({ limit: '64kb' }))
app.use(sanitizeInputs)

// ── Rate Limiters ──
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Authentication rate limit reached. Please try again shortly.' },
})

const challengeWriteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Challenge submission rate limit exceeded.' },
})

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600, // Sufficient capacity for dashboard live telemetry
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Admin request rate limit exceeded.' },
})

// Apply general rate limiter across all /api routes
app.use('/api', generalApiLimiter)

// ── Routes ──
app.use('/api/auth', authLimiter, authRoutes)

app.use('/api/challenge/start', challengeWriteLimiter)
app.use('/api/challenge/attempt', challengeWriteLimiter)
app.use('/api/challenge/save-score', challengeWriteLimiter)

app.use('/api', challengeRoutes)
app.use('/api', leaderboardRoutes)
app.use('/api/admin', adminLimiter, adminRoutes)

// Public Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// ── Centralized Error Handler ──
app.use((err, req, res, next) => {
  if (err.message && err.message.includes('CORS request blocked')) {
    return res.status(403).json({ error: 'Origin not allowed by CORS' })
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request payload exceeds maximum allowed size' })
  }

  console.error('Server error:', err.message)
  if (!isProduction) {
    console.error(err.stack)
  }

  res.status(err.status || 500).json({
    error: isProduction ? 'Internal server error' : err.message,
  })
})

// ── Database Connection & Server Initialization ──
function maskMongoUri(uri) {
  if (!uri) return 'not configured'
  return uri.replace(/:([^@]+)@/, ':****@')
}

async function seedAdminAccount() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPass = process.env.ADMIN_PASSWORD
    if (!adminEmail || !adminPass) {
      console.log('Notice: Admin seeding skipped. Configure ADMIN_EMAIL and ADMIN_PASSWORD in .env to provision an admin.')
      return
    }
    const hashed = await hashPassword(adminPass)

    const existing = await User.findOne({
      $or: [
        { email: adminEmail },
        { name: adminEmail },
        { role: 'admin' },
      ],
    })

    if (existing) {
      existing.name = adminEmail
      existing.email = adminEmail
      existing.password = hashed
      existing.role = 'admin'
      existing.isSuspended = false
      await existing.save()
      console.log(`Admin account verified and synchronized: ${adminEmail}`)
    } else {
      await User.create({
        guestId: 'admin-root-operative',
        name: adminEmail,
        email: adminEmail,
        password: hashed,
        role: 'admin',
        isSuspended: false,
        totalScore: 0,
      })
      console.log(`Default admin account provisioned: ${adminEmail}`)
    }
  } catch (err) {
    console.error('Failed to seed admin account:', err.message)
  }
}

async function start() {
  if (!MONGODB_URI) {
    console.warn('Notice: MONGODB_URI not configured. Server starting with offline fallback mode.')
  } else {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
      })
      console.log(`Database connected: ${maskMongoUri(MONGODB_URI)}`)
      await seedAdminAccount()
    } catch (err) {
      console.error('Database connection failed:', err.message)
    }
  }

  app.listen(PORT, () => {
    console.log(`ShadowPlay backend service running on port ${PORT} [env: ${process.env.NODE_ENV || 'development'}]`)
  })
}

start()
