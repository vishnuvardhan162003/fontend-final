import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function OtpForm({ email, onVerify, onResend, loading }) {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [resent, setResent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Enter the 6-digit code sent to your email')
      return
    }
    try {
      await onVerify(otp.trim())
    } catch (err) {
      setError(err?.message || 'Verification failed. Try again.')
    }
  }

  const handleResend = async () => {
    setError('')
    setResent(false)
    try {
      await onResend()
      setResent(true)
    } catch (err) {
      setError(err?.message || 'Could not resend code. Try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-slate-500">
        Enter the 6-digit verification code sent to <span className="font-semibold text-ink">{email}</span>.
      </p>
      <div>
        <label htmlFor="otp" className="mb-1.5 block font-display text-sm font-medium">
          Verification code
        </label>
        <input
          id="otp"
          inputMode="numeric"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-center text-lg tracking-[0.3em] outline-none focus:border-teal-500"
          placeholder="••••••"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {resent && <p className="text-sm text-teal-600">A new code has been sent.</p>}
      <button type="submit" disabled={loading} className="btn-primary mt-1 w-full disabled:opacity-70">
        {loading && <Loader2 size={16} className="animate-spin" />}
        Verify email
      </button>
      <button type="button" onClick={handleResend} className="text-sm font-semibold text-navy hover:text-navy-700">
        Resend code
      </button>
    </form>
  )
}
