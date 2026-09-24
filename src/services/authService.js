// Auth API wrappers around the Eduzyra Node backend (/api/auth/*).
// Backend contract:
//   POST /api/auth/signup        { name, email, password } -> { requiresOtp: true, email }
//   POST /api/auth/verify-otp    { email, otp }            -> { user, token }
//   POST /api/auth/resend-otp    { email }                 -> { message }
//   POST /api/auth/login         { email, password }       -> { user, token }
//   GET  /api/auth/me                                    -> { user }
//   PATCH /api/auth/me           { name?, email?, ... }    -> { user }

import { apiFetch, setToken } from './api'

export async function signupRequest({ name, email, password }) {
  return apiFetch('/api/auth/signup', {
    method: 'POST',
    body: { name, email, password },
    auth: false,
  })
}

export async function verifyOtpRequest({ email, otp }) {
  const data = await apiFetch('/api/auth/verify-otp', {
    method: 'POST',
    body: { email, otp },
    auth: false,
  })
  if (data?.token) setToken(data.token)
  return data
}

export async function resendOtpRequest({ email }) {
  return apiFetch('/api/auth/resend-otp', {
    method: 'POST',
    body: { email },
    auth: false,
  })
}

export async function loginRequest({ email, password }) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  })
  if (data?.token) setToken(data.token)
  return data
}

export async function fetchMe() {
  return apiFetch('/api/auth/me', { method: 'GET' })
}

export async function updateProfileRequest(updates) {
  return apiFetch('/api/auth/me', { method: 'PATCH', body: updates })
}

export async function logoutRequest() {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' })
  } catch {
    // logout endpoint is best-effort; clearing the local token is what matters
  }
  setToken(null)
}
