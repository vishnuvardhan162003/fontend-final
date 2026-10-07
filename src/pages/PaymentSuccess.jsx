import { Link, Navigate, useLocation } from 'react-router-dom'
import { CircleCheck, Download, LayoutDashboard } from 'lucide-react'
import { formatCurrency } from '../utils/format'

export default function PaymentSuccess() {
  const { state } = useLocation()

  if (!state?.course) return <Navigate to="/courses" replace />

  const { course, transactionId, amount } = state

  const handleDownloadReceipt = () => {
    const date = new Date().toLocaleString('en-IN')
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Receipt ${transactionId}</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 520px; margin: 40px auto; padding: 24px; color: #0f172a; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .muted { color: #64748b; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  td { padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
  td:last-child { text-align: right; font-weight: 600; }
</style>
</head>
<body>
  <h1>Eduzyra by Althexus</h1>
  <p class="muted">Payment Receipt</p>
  <table>
    <tr><td>Course</td><td>${course.title}</td></tr>
    <tr><td>Transaction ID</td><td>${transactionId}</td></tr>
    <tr><td>Amount paid</td><td>${formatCurrency(amount)}</td></tr>
    <tr><td>Date</td><td>${date}</td></tr>
    <tr><td>Status</td><td>Paid</td></tr>
  </table>
  <p class="muted" style="margin-top:24px">Thank you for your purchase.</p>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${transactionId}.html`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

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
          <button
            type="button"
            className="btn-secondary w-full"
            onClick={handleDownloadReceipt}
          >
            <Download size={16} />
            Download receipt
          </button>
        </div>
      </div>
    </div>
  )
}
