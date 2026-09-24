import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { CircleX } from 'lucide-react'

export default function PaymentFailed() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state?.course) return <Navigate to="/courses" replace />

  const { course } = state

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="card-surface w-full max-w-md p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <CircleX size={28} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">Payment failed</h1>
        <p className="mt-2 text-sm text-slate-500">
          We could not process your payment for <strong className="text-ink">{course.title}</strong>.
          No amount was deducted.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(`/checkout/${course.id}`)}
            className="btn-primary w-full"
          >
            Retry payment
          </button>
          <Link to="/contact" className="btn-secondary w-full">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  )
}
