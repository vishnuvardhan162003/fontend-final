import { Link, Navigate, useLocation } from 'react-router-dom'
import { CircleCheck, Download, LayoutDashboard } from 'lucide-react'
import { formatCurrency } from '../utils/format'
import { useAuth } from '../hooks/useAuth'

const METHOD_LABELS = {
  upi: 'UPI',
  card: 'Card',
  netbanking: 'Net Banking',
  wallet: 'Wallet',
  free: 'Free enrollment',
}

export default function PaymentSuccess() {
  const { state } = useLocation()
  const { user } = useAuth()

  if (!state?.course) return <Navigate to="/courses" replace />

  const { course, transactionId, amount } = state
  const rawMethod = String(state.paymentMethod || state.method || '').toLowerCase()
  const methodLabel = METHOD_LABELS[rawMethod] || (rawMethod ? rawMethod.toUpperCase() : 'N/A')
  const studentName = user?.name || 'N/A'
  const studentEmail = user?.email || ''
  const paidDate = new Date().toLocaleString('en-IN')

  const handleDownloadReceipt = async () => {
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ unit: 'mm', format: 'a4' })

      // jsPDF default font ₹ symbol support cheyadu, anduke "Rs." vaadutunnam
      const amountText = `Rs. ${Number(amount).toLocaleString('en-IN')}`

      const NAVY = [15, 23, 42]
      const TEAL = [15, 118, 110]
      const GRAY = [100, 116, 139]
      const LINE = [226, 232, 240]

      // ---------- Header ----------
      doc.setFillColor(...NAVY)
      doc.rect(0, 0, 210, 40, 'F')
      doc.setFillColor(...TEAL)
      doc.rect(0, 40, 210, 2, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(20)
      doc.text('Eduzyra', 20, 18)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text('by Althexus', 20, 25)
      doc.setFontSize(11)
      doc.text('Payment Receipt', 20, 33)

      doc.setFontSize(8)
      doc.setTextColor(180, 190, 205)
      doc.text('RECEIPT NO.', 190, 16, { align: 'right' })
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(255, 255, 255)
      doc.text(String(transactionId), 190, 23, { align: 'right' })

      // ---------- PAID badge ----------
      doc.setFillColor(220, 252, 231)
      doc.roundedRect(20, 52, 26, 9, 2, 2, 'F')
      doc.setTextColor(21, 128, 61)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text('PAID', 33, 58, { align: 'center' })

      // ---------- Billed to / Date ----------
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...GRAY)
      doc.text('BILLED TO', 20, 74)
      doc.text('DATE', 120, 74)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(...NAVY)
      doc.text(String(studentName), 20, 81)
      doc.text(paidDate, 120, 81)

      if (studentEmail) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(...GRAY)
        doc.text(String(studentEmail), 20, 87)
      }

      // ---------- Items table ----------
      let y = 100
      doc.setFillColor(241, 245, 249)
      doc.rect(20, y, 170, 9, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(...GRAY)
      doc.text('DESCRIPTION', 24, y + 6)
      doc.text('AMOUNT', 186, y + 6, { align: 'right' })
      y += 9

      const titleLines = doc.splitTextToSize(String(course.title), 115)
      const rowH = Math.max(titleLines.length * 6 + 8, 16)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...NAVY)
      doc.text(titleLines, 24, y + 9)
      doc.text(amountText, 186, y + 9, { align: 'right' })
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(...GRAY)
      doc.text('Online course enrollment', 24, y + 9 + titleLines.length * 5 + 1)
      doc.setDrawColor(...LINE)
      doc.line(20, y + rowH + 4, 190, y + rowH + 4)
      y += rowH + 16

      // ---------- Payment details ----------
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(...GRAY)
      doc.text('PAYMENT DETAILS', 20, y)
      y += 8

      const details = [
        ['Transaction ID', String(transactionId)],
        ['Payment method', methodLabel],
        ['Status', 'Paid'],
      ]
      details.forEach(([label, value]) => {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(...GRAY)
        doc.text(label, 20, y)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...NAVY)
        doc.text(value, 190, y, { align: 'right' })
        doc.setDrawColor(...LINE)
        doc.line(20, y + 3, 190, y + 3)
        y += 11
      })

      // ---------- Total box ----------
      y += 6
      doc.setFillColor(...NAVY)
      doc.roundedRect(110, y, 80, 18, 2, 2, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(200, 210, 225)
      doc.text('Total paid', 116, y + 11)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(255, 255, 255)
      doc.text(amountText, 184, y + 11.5, { align: 'right' })
      y += 34

      // ---------- Thank you ----------
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...NAVY)
      doc.text('Thank you for your purchase!', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(...GRAY)
      doc.text('Happy learning with Eduzyra by Althexus.', 20, y + 6)

      // ---------- Page footer ----------
      doc.setFillColor(...TEAL)
      doc.rect(0, 291, 210, 6, 'F')
      doc.setFontSize(8)
      doc.setTextColor(255, 255, 255)
      doc.text(
        'This is a computer-generated receipt and does not require a signature.',
        105,
        295,
        { align: 'center' }
      )

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

        <dl className="mt-6 flex flex-col gap-2.5 rounded-xl bg-slate-50 p-4 text-left text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-400">Student name</dt>
            <dd className="font-medium">{studentName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400">Transaction ID</dt>
            <dd className="break-all text-right font-mono text-xs">{transactionId}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Payment method</dt>
            <dd className="font-medium">{methodLabel}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Date</dt>
            <dd className="text-xs font-medium">{paidDate}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Status</dt>
            <dd>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                Paid
              </span>
            </dd>
          </div>
          <div className="mt-1 flex justify-between border-t border-slate-200 pt-3">
            <dt className="font-medium text-slate-600">Amount paid</dt>
            <dd className="text-base font-bold">{formatCurrency(amount)}</dd>
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
          <button type="button" className="btn-secondary w-full" onClick={handleDownloadReceipt}>
            <Download size={16} />
            Download receipt
          </button>
        </div>
      </div>
    </div>
  )
}
