import { Link, Navigate, useLocation } from 'react-router-dom'
import { CircleCheck, Download, LayoutDashboard } from 'lucide-react'
import { formatCurrency } from '../utils/format'

export default function PaymentSuccess() {
  const { state } = useLocation()

  if (!state?.course) return <Navigate to="/courses" replace />

  const { course, transactionId, amount } = state

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="card-surface w-full max-w-md p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <CircleCheck size={28} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">Payment successful</h1>
        <p className="mt-1 text-sm text-slate-500">You're enrolled in</p>
        <p className="mt-1 font-display text-base font-semibold">{course.title}</p>

        <dl className="mt-6 flex flex-col gap-2 rounded-xl bg-slate-50 p-4 text-left text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-400">Transaction ID</dt>
            <dd className="font-mono text-xs">{transactionId}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Amount paid</dt>
            <dd className="font-semibold">{formatCurrency(amount)}</dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-slate-400">
          A confirmation email and digital receipt have been sent to your inbox.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link to="/dashboard" className="btn-primary w-full">
            <LayoutDashboard size={16} />
            Go to dashboard
          </Link>
          <button type="button" className="btn-secondary w-full">
            <Download size={16} />
            Download receipt
          </button>
        </div>
      </div>
    </div>
  )
}
