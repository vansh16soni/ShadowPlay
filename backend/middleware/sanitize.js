/**
 * Neutralize dangerous characters (null bytes and HTML tags) from string inputs to prevent XSS.
 * Leaves credential and token fields intact while stripping null bytes.
 */
function sanitizeStringValue(key, value) {
  if (typeof value !== 'string') return value
  const clean = value.replace(/\0/g, '')
  if (['password', 'adminkey', 'token', 'authorization', 'x-session-token'].includes(key.toLowerCase())) {
    return clean
  }
  return clean.replace(/[<>]/g, '')
}

/**
 * Recursively strip MongoDB query operator keys ($ prefix), dot notation,
 * and dangerous HTML characters to prevent NoSQL injection and XSS.
 */
function stripMongoOperators(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => stripMongoOperators(item))
  }

  const clean = {}
  for (const [key, value] of Object.entries(obj)) {
    // Drop keys that start with $ or contain dot
    if (key.startsWith('$') || key.includes('.')) {
      continue
    }
    if (typeof value === 'string') {
      clean[key] = sanitizeStringValue(key, value)
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = stripMongoOperators(value)
    } else {
      clean[key] = value
    }
  }
  return clean
}

/**
 * Express middleware that scrubs req.body, req.query, and req.params of NoSQL operator keys.
 */
function sanitizeInputs(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = stripMongoOperators(req.body)
  }
  if (req.query && typeof req.query === 'object') {
    req.query = stripMongoOperators(req.query)
  }
  if (req.params && typeof req.params === 'object') {
    req.params = stripMongoOperators(req.params)
  }
  next()
}

/**
 * Validation helpers with strict formats
 */
const GUEST_ID_REGEX = /^[a-zA-Z0-9_-]{1,64}$/
const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
const GESTURE_KEY_REGEX = /^[a-zA-Z0-9_-]{1,40}$/

function isValidGuestId(id) {
  return typeof id === 'string' && GUEST_ID_REGEX.test(id)
}

function isValidUUID(id) {
  return typeof id === 'string' && UUID_REGEX.test(id)
}

function isValidGesture(gesture) {
  return typeof gesture === 'string' && GESTURE_KEY_REGEX.test(gesture)
}

function clampScore(score) {
  if (typeof score !== 'number' || !Number.isFinite(score)) return null
  const rounded = Math.floor(score)
  if (rounded < 0) return 0
  if (rounded > 100000) return 100000
  return rounded
}

module.exports = {
  sanitizeInputs,
  stripMongoOperators,
  isValidGuestId,
  isValidUUID,
  isValidGesture,
  clampScore,
}
