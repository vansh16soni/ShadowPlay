const API_URL = import.meta.env.VITE_API_URL || ''

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

// ── Challenge ──

export async function startChallenge(guestId) {
  try {
    return await apiFetch('/api/challenge/start', {
      method: 'POST',
      body: JSON.stringify({ guestId }),
    })
  } catch {
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
    // offline fallback
  }

  // Preserve in localStorage as local fallback
  const existing = JSON.parse(localStorage.getItem('shadowplay_scores') || '[]')
  // Avoid duplicate entries if possible, or just push
  existing.push({ guestId, score, date: new Date().toISOString(), synced })
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

// ── Leaderboard ──

export async function getLeaderboard(limit = 10) {
  try {
    return await apiFetch(`/api/leaderboard?limit=${limit}`)
  } catch {
    // Fallback: localStorage
    const stored = JSON.parse(localStorage.getItem('shadowplay_scores') || '[]')
    return stored.slice(0, limit)
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
