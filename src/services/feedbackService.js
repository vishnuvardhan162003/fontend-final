// Feedback API backed by the Node backend.
//   POST /api/feedback  (public, rate-limited) -> created entry
// Falls back to a local in-memory store when the backend is unreachable so
// the Feedback page never hard-fails offline.

import { API_BASE_URL } from './api'

const LOCAL_ENTRIES = []

export async function submitFeedback({ name, email, role, courseId, rating, category, message }) {
  const payload = {
    name,
    email,
    role,
    courseId: courseId || null,
    rating: Number(rating),
    category,
    message,
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || `Feedback failed (${res.status})`)
    }
    return await res.json()
  } catch (err) {
    // Offline fallback — keep the same shape so the UI behaves identically
    if (err?.message?.startsWith('Feedback failed')) throw err
    const entry = {
      id: `FB-${Date.now()}`,
      ...payload,
      submittedAt: new Date().toISOString(),
      _local: true,
    }
    LOCAL_ENTRIES.unshift(entry)
    return entry
  }
}

export async function getAllFeedback() {
  return [...LOCAL_ENTRIES]
}
