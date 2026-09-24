// Live Sessions API client (Google Meet first).
// All routes require auth; backend enforces enrollment / instructor ownership.
import { apiFetch } from './api'

export const GOOGLE_MEET_RE = /^https:\/\/meet\.google\.com\/[a-z]{3,}-[a-z]{4,}-[a-z]{3,}(\?.*)?$/

export function isValidMeetLink(url, provider = 'GOOGLE_MEET') {
  if (!url) return false
  try {
    // eslint-disable-next-line no-new
    new URL(url)
  } catch {
    return false
  }
  if (provider === 'GOOGLE_MEET') return GOOGLE_MEET_RE.test(url.trim())
  return true
}

export function formatSessionTime(iso) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export async function listLiveSessions(courseId) {
  return apiFetch(`/api/courses/${encodeURIComponent(courseId)}/live-sessions`, { method: 'GET' })
}

export async function createLiveSession(courseId, payload) {
  return apiFetch(`/api/courses/${encodeURIComponent(courseId)}/live-sessions`, {
    method: 'POST',
    body: payload,
  })
}

export async function updateLiveSession(id, payload) {
  return apiFetch(`/api/live-sessions/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: payload,
  })
}

export async function deleteLiveSession(id) {
  return apiFetch(`/api/live-sessions/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function joinLiveSession(id) {
  const data = await apiFetch(`/api/live-sessions/${encodeURIComponent(id)}/join`, { method: 'POST' })
  if (data?.redirectUrl) {
    window.open(data.redirectUrl, '_blank', 'noopener,noreferrer')
  }
  return data
}
