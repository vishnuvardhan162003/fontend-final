import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthForm from '../components/auth/AuthForm'
import OtpForm from '../components/auth/OtpForm'
import { useAuth } from '../hooks/useAuth'

const ROLE_HOME = { student: '/dashboard', instructor: '/instructor', admin: '/admin' }

export default function Login() {
  const { login, loading, verifyOtp, resendOtp, pendingOtpEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [needsOtp, setNeedsOtp] = useState(false)
  const [otpEmail, setOtpEmail] = useState('')

  const handleSubmit = async (form) => {
    setError('')
    setNeedsOtp(false)
    try {
      const data = await login({ email: form.email, password: form.password })
      const role = data?.user?.role || 'student'
      navigate(location.state?.from || ROLE_HOME[role] || '/dashboard', { replace: true })
    } catch (err) {
      // Backend sends the machine code as `errorCode` (see errorHandler.js).
      const machineCode = err?.data?.errorCode || err?.data?.code
      if (machineCode === 'EMAIL_NOT_VERIFIED' || err?.status === 403) {
        setOtpEmail(form.email)
        setNeedsOtp(true)
        try {
          await resendOtp(form.email)
        } catch {
          // resend is best-effort; OTP from signup may still be valid
        }
      } else {
        setError(err?.message || 'Login failed. Check your email and password.')
      }
    }
  }

  const handleVerify = async (otp) => {
    const data = await verifyOtp({ email: otpEmail || pendingOtpEmail, otp })
    const role = data?.user?.role || 'student'
    navigate(ROLE_HOME[role] || '/dashboard', { replace: true })
  }

  const showOtp = needsOtp

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="card-surface w-full max-w-sm p-8">
        <span className="eyebrow">Welcome back</span>
        <h1 className="mt-2 font-display text-2xl font-bold">Log in to Eduzyra</h1>
        <p className="mt-1 text-sm text-slate-500">Continue your learning path.</p>

        <div className="mt-6">
          {showOtp || needsOtp ? (
            <OtpForm
              email={otpEmail || pendingOtpEmail}
              loading={loading}
              onVerify={handleVerify}
              onResend={() => resendOtp(otpEmail || pendingOtpEmail)}
            />
          ) : (
            <AuthForm mode="login" onSubmit={handleSubmit} loading={loading} />
          )}
        </div>

        {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}

        <p className="mt-4 text-center text-sm">
          <Link to="/forgot-password" className="font-semibold text-navy hover:text-navy-700">
            Forgot password?
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-slate-500">
          New here?{' '}
          <Link to="/signup" className="font-semibold text-navy hover:text-navy-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
