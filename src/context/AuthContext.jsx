import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { apiFetch, getToken, setToken } from '../services/api'
import {
  fetchMe,
  loginRequest,
  logoutRequest,
  resendOtpRequest,
  signupRequest,
  updateProfileRequest,
  verifyOtpRequest,
} from '../services/authService'

export const AuthContext = createContext(null)

export const ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
}

const PENDING_EMAIL_KEY = 'eduzyra_pending_otp_email'

// Real authentication backed by the Eduzyra Node backend.
// Token is persisted in localStorage; user is rehydrated via GET /api/auth/me.
// Enrollments are sourced from GET /api/enrollments/me when logged in.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([])
  const [pendingOtpEmail, setPendingOtpEmail] = useState(() => {
    try {
      return localStorage.getItem(PENDING_EMAIL_KEY) || null
    } catch {
      return null
    }
  })

  const setPendingEmail = (email) => {
    setPendingOtpEmail(email)
    try {
      if (email) localStorage.setItem(PENDING_EMAIL_KEY, email)
      else localStorage.removeItem(PENDING_EMAIL_KEY)
    } catch {
      // ignore
    }
  }

  const loadEnrollments = useCallback(async () => {
    try {
      const data = await apiFetch('/api/enrollments/me', { method: 'GET' })
      const list = Array.isArray(data) ? data : data?.enrollments || []
      const ids = list
        .map((e) => {
          if (typeof e === 'string') return e
          const c = e?.course
          if (!c) return e?.courseId || null
          if (typeof c === 'string') return c
          return c?.slug || c?._id || String(c?.id || '')
        })
        .filter(Boolean)
      setEnrolledCourseIds(ids)
    } catch {
      setEnrolledCourseIds([])
    }
  }, [])

  // Rehydrate session on mount
  useEffect(() => {
    let cancelled = false
    async function init() {
      if (!getToken()) {
        setInitializing(false)
        return
      }
      try {
        const data = await fetchMe()
        if (!cancelled) {
          setUser(data?.user || null)
          await loadEnrollments()
        }
      } catch {
        if (!cancelled) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (!cancelled) setInitializing(false)
      }
    }
    init()
    return () => {
      cancelled = true
    }
  }, [loadEnrollments])

  const login = async ({ email, password }) => {
    setLoading(true)
    try {
      const data = await loginRequest({ email, password })
      setUser(data.user)
      setPendingEmail(null)
      await loadEnrollments()
      return data
    } finally {
      setLoading(false)
    }
  }

  const signup = async ({ name, email, password }) => {
    setLoading(true)
    try {
      const data = await signupRequest({ name, email, password })
      // Backend requires OTP verification before issuing a token.
      setPendingEmail(email)
      return data
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async ({ email, otp }) => {
    setLoading(true)
    try {
      const data = await verifyOtpRequest({ email, otp })
      setUser(data.user)
      setPendingEmail(null)
      await loadEnrollments()
      return data
    } finally {
      setLoading(false)
    }
  }

  const resendOtp = async (email) => resendOtpRequest({ email: email || pendingOtpEmail })

  const logout = async () => {
    await logoutRequest()
    setUser(null)
    setEnrolledCourseIds([])
  }

  const updateProfile = async (updates) => {
    const data = await updateProfileRequest(updates)
    if (data?.user) setUser(data.user)
    return data
  }

  const enrollInCourse = async (courseId, orderId) => {
    // Optimistic local update so UI responds instantly
    setEnrolledCourseIds((prev) => (prev.includes(courseId) ? prev : [...prev, courseId]))
    try {
      await apiFetch('/api/enrollments', {
        method: 'POST',
        body: orderId ? { courseId, orderId } : { courseId },
      })
      await loadEnrollments()
    } catch (err) {
      // Roll back optimistic update if server rejected (e.g. paid course w/o order)
      if (err?.status === 400 || err?.status === 401) {
        await loadEnrollments()
      }
      throw err
    }
  }

  const isEnrolledIn = useCallback(
    (courseId) => enrolledCourseIds.includes(courseId),
    [enrolledCourseIds],
  )

  const value = useMemo(
    () => ({
      user,
      loading,
      initializing,
      login,
      signup,
      verifyOtp,
      resendOtp,
      pendingOtpEmail,
      logout,
      updateProfile,
      isAuthenticated: Boolean(user),
      role: user?.role ?? null,
      enrolledCourseIds,
      enrollInCourse,
      isEnrolledIn,
      refreshEnrollments: loadEnrollments,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading, initializing, enrolledCourseIds, isEnrolledIn, pendingOtpEmail, loadEnrollments],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
