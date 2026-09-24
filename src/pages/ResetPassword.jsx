import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CircleCheck } from 'lucide-react'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setDone(true)
    setTimeout(() => navigate('/login'), 1800)
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="card-surface w-full max-w-sm p-8">
        {done ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <CircleCheck size={32} className="text-teal-500" />
            <h1 className="font-display text-xl font-bold">Password updated</h1>
            <p className="text-sm text-slate-500">Redirecting you to login…</p>
          </div>
        ) : (
          <>
            <span className="eyebrow">Reset password</span>
            <h1 className="mt-2 font-display text-2xl font-bold">Choose a new password</h1>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label htmlFor="password" className="mb-1.5 block font-display text-sm font-medium">
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label htmlFor="confirm" className="mb-1.5 block font-display text-sm font-medium">
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-xs font-medium text-red-500">{error}</p>}
              <button type="submit" className="btn-primary w-full">Update password</button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              <Link to="/login" className="font-semibold text-navy hover:text-navy-700">
                Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
