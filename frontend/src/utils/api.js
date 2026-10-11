const API_URL = import.meta.env.VITE_API_URL || ''

async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  // Include session token or admin key if stored
  const token = localStorage.getItem('shadowplay_auth_token')
  const adminKey = localStorage.getItem('shadowplay_admin_key')

  if (token && !headers['Authorization'] && !headers['x-session-token']) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (adminKey && !headers['x-admin-key']) {
    headers['x-admin-key'] = adminKey
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const errorMsg = data.error || `Request failed with status ${res.status}`
    const error = new Error(errorMsg)
    error.status = res.status
    error.data = data
    throw error
  }
  return data
}

// ── Authentication ──

export async function registerUser({ name, email, password }) {
  return await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export async function loginUser({ name, email, password }) {
  return await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export async function verifyCurrentSession() {
  const token = localStorage.getItem('shadowplay_auth_token')
  if (!token) return null
  try {
    return await apiFetch('/api/auth/me')
  } catch {
    localStorage.removeItem('shadowplay_auth_token')
    localStorage.removeItem('shadowplay_admin_key')
    return null
  }
}

// ── Admin Functions ──

export async function getAdminUsers(customKey) {
  const headers = customKey ? { 'x-admin-key': customKey } : {}
  return await apiFetch('/api/admin/users', { headers })
}

export async function getAdminUserSessions(guestId, customKey) {
  const headers = customKey ? { 'x-admin-key': customKey } : {}
  return await apiFetch(`/api/admin/user/${guestId}/sessions`, { headers })
}

export async function toggleUserSuspension(guestId, isSuspended, customKey) {
  const headers = customKey ? { 'x-admin-key': customKey } : {}
  return await apiFetch(`/api/admin/user/${guestId}/toggle-suspend`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ isSuspended }),
  })
}

export async function getAdminHealth(customKey) {
  const headers = customKey ? { 'x-admin-key': customKey } : {}
  return await apiFetch('/api/admin/health', { headers })
}

// ── Challenge ──

export async function startChallenge(guestId) {
  try {
    return await apiFetch('/api/challenge/start', {
      method: 'POST',
      body: JSON.stringify({ guestId }),
    })
  } catch (err) {
    if (err.status === 403) throw err
    const sessionId = crypto.randomUUID()
    return { sessionId, offline: true }
  }
}

export async function submitAttempt(data) {
  try {
    return await apiFetch('/api/challenge/attempt', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  } catch {
    return { offline: true }
  }
}

export async function saveScore(guestId, score) {
  let synced = false
  try {
    await apiFetch('/api/challenge/save-score', {
      method: 'POST',
      body: JSON.stringify({ guestId, score }),
    })
    synced = true
  } catch (err) {
    if (err.status === 403) throw err
    // offline fallback
  }

  const existing = JSON.parse(localStorage.getItem('shadowplay_scores') || '[]')
  const foundIndex = existing.findIndex(entry => entry.guestId === guestId)
  if (foundIndex >= 0) {
    existing[foundIndex] = {
      guestId,
      score: Math.max(existing[foundIndex].score, score),
      date: new Date().toISOString(),
      synced,
    }
  } else {
    existing.push({ guestId, score, date: new Date().toISOString(), synced })
  }
  existing.sort((a, b) => b.score - a.score)
  localStorage.setItem('shadowplay_scores', JSON.stringify(existing.slice(0, 20)))
}

export async function syncOfflineScores() {
  if (!navigator.onLine) return
  const stored = JSON.parse(localStorage.getItem('shadowplay_scores') || '[]')
  let changed = false

  for (let i = 0; i < stored.length; i++) {
    if (stored[i].synced === false) {
      try {
        await apiFetch('/api/challenge/save-score', {
          method: 'POST',
          body: JSON.stringify({ guestId: stored[i].guestId, score: stored[i].score }),
        })
        stored[i].synced = true
        changed = true
      } catch (err) {
        // Skip if still failing
      }
    }
  }

  if (changed) {
    localStorage.setItem('shadowplay_scores', JSON.stringify(stored))
  }
}

// ── Leaderboard & Stats ──

export async function getLeaderboard(limit = 10) {
  try {
    return await apiFetch(`/api/leaderboard?limit=${limit}`)
  } catch {
    const stored = JSON.parse(localStorage.getItem('shadowplay_scores') || '[]')
    const unique = []
    const seen = new Set()
    for (const item of stored) {
      if (!seen.has(item.guestId)) {
        seen.add(item.guestId)
        unique.push(item)
      }
    }
    return unique.slice(0, limit)
  }
}

export async function getUserStats(guestId) {
  try {
    return await apiFetch(`/api/user/${guestId}/stats`)
  } catch {
    const stored = JSON.parse(localStorage.getItem('shadowplay_scores') || '[]')
    const userScores = stored.filter(s => s.guestId === guestId)
    const best = userScores.reduce((m, s) => Math.max(m, s.score), 0)
    return { guestId, totalScore: best, sessions: userScores.length }
  }
}
