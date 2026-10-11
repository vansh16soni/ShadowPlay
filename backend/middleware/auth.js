const crypto = require('crypto')

const SECRET = process.env.ADMIN_API_KEY || 'shadowplay_default_hmac_secret_2026'

/**
 * Timing-safe string comparison to prevent side-channel timing attacks.
 */
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

/**
 * Generate a signed session token.
 * Format: base64(payload).signature
 */
function createSessionToken(payload) {
  const data = JSON.stringify({ ...payload, ts: Date.now() })
  const encoded = Buffer.from(data).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(encoded).digest('base64url')
  return `${encoded}.${sig}`
}

/**
 * Verify and decode session token.
 */
function verifySessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null
  const [encoded, sig] = token.split('.')
  const expectedSig = crypto.createHmac('sha256', SECRET).update(encoded).digest('base64url')
  if (!safeCompare(sig, expectedSig)) return null

  try {
    const raw = Buffer.from(encoded, 'base64url').toString('utf8')
    const payload = JSON.parse(raw)
    // 7-day token expiration
    if (Date.now() - payload.ts > 7 * 24 * 60 * 60 * 1000) return null
    return payload
  } catch {
    return null
  }
}

/**
 * Admin authentication middleware.
 * Checks for either valid x-admin-key OR verified admin session token.
 */
function requireAdminAuth(req, res, next) {
  const adminKey = process.env.ADMIN_API_KEY

  const authHeader = req.headers['authorization'] || ''
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null
  const headerKey = req.headers['x-admin-key'] || bearerToken

  // 1. Direct admin API key match
  if (adminKey && headerKey && safeCompare(headerKey, adminKey)) {
    req.admin = { role: 'admin' }
    return next()
  }

  // 2. Verified admin session token
  if (headerKey) {
    const session = verifySessionToken(headerKey)
    if (session && session.role === 'admin') {
      req.admin = session
      return next()
    }
  }

  return res.status(401).json({
    error: 'Unauthorized: Valid administrator credentials required.',
  })
}

/**
 * Cryptographic password hashing utility using Node.js crypto.scrypt.
 * Uses 128-bit salt and derived 64-byte key.
 */
function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex')
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err)
      resolve(`${salt}:${derivedKey.toString('hex')}`)
    })
  })
}

/**
 * Verify a plain text password against a stored hash (salt:derivedKey).
 */
function verifyPassword(password, storedHash) {
  return new Promise((resolve, reject) => {
    if (!storedHash || !storedHash.includes(':')) {
      return resolve(false)
    }
    const [salt, key] = storedHash.split(':')
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err)
      const keyBuffer = Buffer.from(key, 'hex')
      if (derivedKey.length !== keyBuffer.length) {
        return resolve(false)
      }
      resolve(crypto.timingSafeEqual(derivedKey, keyBuffer))
    })
  })
}

module.exports = {
  requireAdminAuth,
  safeCompare,
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
}
