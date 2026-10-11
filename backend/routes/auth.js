const express = require('express')
const router = express.Router()
const { randomUUID } = require('crypto')
const { User } = require('../models')
const { hashPassword, verifyPassword, createSessionToken, verifySessionToken } = require('../middleware/auth')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * POST /api/auth/register
 * Register a new user operative.
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({ error: 'Name must be between 2 and 50 characters.' })
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
      return res.status(400).json({ error: 'A valid email address is required.' })
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' })
    }

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    // Check for existing user
    const existing = await User.findOne({
      $or: [
        { email: cleanEmail },
        { name: { $regex: new RegExp(`^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
      ]
    })

    if (existing) {
      if (existing.email === cleanEmail) {
        return res.status(409).json({ error: 'An operative account with this email already exists.' })
      }
      return res.status(409).json({ error: 'An operative account with this name already exists.' })
    }

    const hashedPassword = await hashPassword(password)
    const guestId = randomUUID()

    const newUser = await User.create({
      guestId,
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: 'user',
      isSuspended: false,
      totalScore: 0,
      lastLogin: new Date(),
    })

    const token = createSessionToken({
      userId: newUser._id.toString(),
      guestId: newUser.guestId,
      role: newUser.role,
      name: newUser.name,
    })

    res.status(201).json({
      ok: true,
      user: {
        guestId: newUser.guestId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isSuspended: false,
        totalScore: 0,
      },
      token,
    })
  } catch (err) {
    console.error('Registration error:', err.message)
    res.status(500).json({ error: 'Failed to create operative account.' })
  }
})

/**
 * POST /api/auth/login
 * User & Admin unified login with name/email and password.
 */
router.post('/login', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const identifier = (name || email || '').trim()

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please provide both username/email and password.' })
    }

    // Match either by email or name (case-insensitive)
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { name: { $regex: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
      ]
    })

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid operative credentials.' })
    }

    // Verify password
    const isMatch = await verifyPassword(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid operative credentials.' })
    }

    // Check account status
    if (user.isSuspended) {
      return res.status(403).json({
        error: 'Access Denied: Your operative account has been suspended by administration.',
        isSuspended: true,
      })
    }

    // Update lastLogin
    user.lastLogin = new Date()
    await user.save()

    const token = createSessionToken({
      userId: user._id.toString(),
      guestId: user.guestId,
      role: user.role,
      name: user.name,
    })

    res.json({
      ok: true,
      user: {
        guestId: user.guestId,
        name: user.name,
        email: user.email,
        role: user.role,
        isSuspended: user.isSuspended,
        totalScore: user.totalScore,
      },
      token,
      // Provide admin key if user is admin so subsequent admin requests pass seamlessly
      adminKey: user.role === 'admin' ? (process.env.ADMIN_API_KEY || token) : undefined,
    })
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ error: 'Failed to authenticate operative.' })
  }
})

/**
 * GET /api/auth/me
 * Verify current session token or guestId status.
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'] || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : req.headers['x-session-token']

    if (!token) {
      return res.status(401).json({ error: 'No active session token provided.' })
    }

    const payload = verifySessionToken(token)
    if (!payload) {
      return res.status(401).json({ error: 'Session expired or invalid.' })
    }

    const user = await User.findOne({ guestId: payload.guestId })
    if (!user) {
      return res.status(404).json({ error: 'Operative record not found.' })
    }

    if (user.isSuspended) {
      return res.status(403).json({
        error: 'Operative account suspended.',
        isSuspended: true,
      })
    }

    res.json({
      ok: true,
      user: {
        guestId: user.guestId,
        name: user.name,
        email: user.email,
        role: user.role,
        isSuspended: user.isSuspended,
        totalScore: user.totalScore,
      },
      adminKey: user.role === 'admin' ? (process.env.ADMIN_API_KEY || token) : undefined,
    })
  } catch (err) {
    console.error('Session verify error:', err.message)
    res.status(500).json({ error: 'Failed to verify session.' })
  }
})

module.exports = router
