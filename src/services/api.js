// Central API client for the Eduzyra Node backend.
// Base URL comes from VITE_API_URL (defaults to http://localhost:5000).
// Handles JWT persistence (localStorage) and JSON error normalization.

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

const TOKEN_KEY = 'eduzyra_token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore storage failures
  }
}

export async function apiFetch(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const finalHeaders = { ...headers }
  let payload = undefined

  if (body !== undefined) {
    finalHeaders['Content-Type'] = finalHeaders['Content-Type'] || 'application/json'
    payload = typeof body === 'string' ? body : JSON.stringify(body)
  }

  if (auth) {
    const token = getToken()
    if (token) finalHeaders.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: payload,
  })

  const contentType = res.headers.get('content-type') || ''
  let data = null
  if (contentType.includes('application/json')) {
    try {
      data = await res.json()
    } catch {
      data = null
    }
  } else {
    try {
      data = await res.text()
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      (typeof data === 'string' && data) ||
      `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}
