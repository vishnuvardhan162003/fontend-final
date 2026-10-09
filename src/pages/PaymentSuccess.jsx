import { Link, Navigate, useLocation } from 'react-router-dom'
import { CircleCheck, Download, LayoutDashboard } from 'lucide-react'
import { formatCurrency } from '../utils/format'
import { useAuth } from '../hooks/useAuth'

const METHOD_LABELS = {
  upi: 'UPI',
  card: 'Card',
  netbanking: 'Net Banking',
  wallet: 'Wallet',
}

export default function PaymentSuccess() {
  const { state } = useLocation()
  const { user } = useAuth()

  if (!state?.course) return <Navigate to="/courses" replace />

  const { course, transactionId, amount } = state
  const rawMethod = String(state.paymentMethod || state.method || '').toLowerCase()
  const methodLabel = METHOD_LABELS[rawMethod] || (rawMethod ? rawMethod.toUpperCase() : 'N/A')
  const studentName = user?.name || 'N/A'

  const handleDownloadReceipt = async () => {
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ unit: 'mm', format: 'a4' })

      const date = new Date().toLocaleString('en-IN')
      // jsPDF default font ₹ symbol support cheyadu, anduke "Rs." vaadutunnam
      const amountText = `Rs. ${Number(amount).toLocaleString('en-IN')}`

      // Header
      doc.setFillColor(15, 23, 42)
      doc.rect(0, 0, 210, 32, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(20)
      doc.text('Eduzyra by Althexus', 20, 15)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.text('Payment Receipt', 20, 24)

      // Body
      doc.setTextColor(15, 23, 42)
      const rows = [
        ['Student name', String(studentName)],
        ['Course', String(course.title)],
        ['Transaction ID', String(transactionId)],
        ['Payment method', methodLabel],
        ['Amount paid', amountText],
        ['Date', date],
        ['Status', 'Paid'],
      ]

      let y = 52
      rows.forEach(([label, value]) => {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(11)
        doc.setTextColor(100, 116, 139)
        doc.text(label, 20, y)

        doc.setFont('helvetica', 'bold')
        doc.setTextColor(15, 23, 42)
        const lines = doc.splitTextToSize(value, 105)
        doc.text(lines, 190, y, { align: 'right' })

        const rowHeight = Math.max(lines.length * 6, 8)
        doc.setDrawColor(226, 232, 240)
        doc.line(20, y + rowHeight - 2, 190, y + rowHeight - 2)
        y += rowHeight + 8
      })

      // Footer
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(100, 116, 139)
      doc.text('Thank you for your purchase.', 20, y + 6)

      doc.save(`receipt-${transactionId}.pdf`)
    } catch (err) {
      console.error(err)
      alert('Could not download receipt. Please try again.')
    }
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
            <dt className="text-slate-400">Student name</dt>
            <dd className="font-medium">{studentName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Transaction ID</dt>
            <dd className="font-mono text-xs">{transactionId}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Payment method</dt>
            <dd className="font-medium">{methodLabel}</dd>
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
