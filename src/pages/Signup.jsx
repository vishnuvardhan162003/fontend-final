import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../components/auth/AuthForm'
import OtpForm from '../components/auth/OtpForm'
import { useAuth } from '../hooks/useAuth'

export default function Signup() {
  const { signup, loading, verifyOtp, resendOtp } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [createdEmail, setCreatedEmail] = useState(null)

  const handleSubmit = async (form) => {
    setError('')
    try {
      await signup({ name: form.name, email: form.email, password: form.password })
      setCreatedEmail(form.email)
    } catch (err) {
      setError(err?.message || 'Signup failed. Try a different email.')
    }
  }

  const handleVerify = async (otp) => {
    await verifyOtp({ email: createdEmail, otp })
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="card-surface w-full max-w-sm p-8">
        <span className="eyebrow">Get started</span>
        <h1 className="mt-2 font-display text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">
          {createdEmail ? 'Verify your email to finish setup.' : 'Start a path in under two minutes.'}
        </p>

        <div className="mt-6">
          {createdEmail ? (
            <OtpForm
              email={createdEmail}
              loading={loading}
              onVerify={handleVerify}
              onResend={() => resendOtp(createdEmail)}
            />
          ) : (
            <AuthForm mode="signup" onSubmit={handleSubmit} loading={loading} />
          )}
        </div>

        {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}

        {!createdEmail && (
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-navy hover:text-navy-700">
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
