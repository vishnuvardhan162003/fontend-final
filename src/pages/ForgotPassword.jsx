import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, CircleCheck } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (email.trim()) setSent(true)
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="card-surface w-full max-w-sm p-8">
        {sent ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <CircleCheck size={32} className="text-teal-500" />
            <h1 className="font-display text-xl font-bold">Check your inbox</h1>
            <p className="text-sm text-slate-500">
              If an account exists for {email}, a reset link has been sent.
            </p>
            <Link to="/login" className="btn-secondary mt-2">Back to login</Link>
          </div>
        ) : (
          <>
            <span className="eyebrow">Reset password</span>
            <h1 className="mt-2 font-display text-2xl font-bold">Forgot your password?</h1>
            <p className="mt-1 text-sm text-slate-500">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="mb-1.5 flex items-center gap-1.5 font-display text-sm font-medium">
                  <Mail size={14} />
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                  placeholder="you@example.com"
                />
              </div>
              <button type="submit" className="btn-primary w-full">Send reset link</button>
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
