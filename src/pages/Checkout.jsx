import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ShieldCheck, Loader2, Landmark } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { fetchCourseById } from '../services/courseService'
import {
  createOrder,
  processPayment,
  verifyPayment,
  enrollAfterPayment,
  createUpiQr,
  getQrStatus,
} from '../services/paymentService'
import { useAuth } from '../hooks/useAuth'
import { POPULAR_BANKS } from '../constants/banks'
import { formatCurrency } from '../utils/format'
import OrderSummary from '../components/checkout/OrderSummary'
import CouponField from '../components/checkout/CouponField'
import PaymentMethodPicker from '../components/checkout/PaymentMethodPicker'
import Spinner from '../components/common/Spinner'

// false = test mode (demo QR), true = real Razorpay QR (needs Live mode + backend)
const REAL_QR = import.meta.env.VITE_REAL_QR === 'true'

// Razorpay net banking bank codes (bank names must match POPULAR_BANKS)
const BANK_CODES = {
  'State Bank of India': 'SBIN',
  'HDFC Bank': 'HDFC',
  'ICICI Bank': 'ICIC',
  'Axis Bank': 'UTIB',
  'Kotak Mahindra Bank': 'KKBK',
  'Punjab National Bank': 'PUNB',
  'Bank of Baroda': 'BARB_R',
  'IDFC FIRST Bank': 'IDFB',
  'Yes Bank': 'YESB',
}

export default function Checkout() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { enrollInCourse, user } = useAuth()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [method, setMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [upiId, setUpiId] = useState('')
  const [bankQuery, setBankQuery] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [coupon, setCoupon] = useState({ valid: false, discount: 0, finalPrice: 0 })
  const [agreed, setAgreed] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [qr, setQr] = useState(null)
  const [qrStatus, setQrStatus] = useState('idle') // idle | loading | pending | expired | error

  useEffect(() => {
    fetchCourseById(courseId).then((result) => {
      setCourse(result)
      setCoupon({ valid: false, discount: 0, finalPrice: result?.price ?? 0 })
      setLoading(false)
    })
  }, [courseId])

  // Real QR: poll the backend until the QR is paid or expired
  useEffect(() => {
    if (!REAL_QR || !qr || qrStatus !== 'pending') return
    const timer = setInterval(async () => {
      try {
        const s = await getQrStatus(qr.orderId)
        if (s.status === 'paid') {
          clearInterval(timer)
          try {
            await enrollAfterPayment({ courseId: qr.courseId, orderId: qr.orderId })
          } catch {
            await enrollInCourse(qr.courseId, qr.orderId)
          }
          navigate('/payment/success', {
            state: {
              course: qr.course,
              transactionId: s.paymentId,
              amount: qr.amount,
              paymentMethod: s.method || 'upi',
            },
          })
        } else if (s.status === 'expired') {
          clearInterval(timer)
          setQrStatus('expired')
        }
      } catch {
        // network blip, next poll will retry
      }
    }, 3000)
    return () => clearInterval(timer)
  }, [qr, qrStatus])

  if (loading) return <Spinner label="Loading checkout" />
  if (!course) {
    return (
      <div className="container-page py-24 text-center">
        <p className="font-display text-lg font-semibold">Course not found</p>
        <Link to="/courses" className="btn-primary mt-4 inline-flex">Back to courses</Link>
      </div>
    )
  }

  const finalPrice = coupon.valid ? coupon.finalPrice : course.price

  const handleGenerateQr = async () => {
    setError('')
    if (!agreed) {
      setError('Please accept the terms and conditions to continue.')
      return
    }
    setQrStatus('loading')
    try {
      const order = await createOrder({ courseId: course.id, amount: finalPrice })
      const data = await createUpiQr({ orderId: order.orderId })
      setQr({
        orderId: order.orderId,
        imageUrl: data.imageUrl,
        course,
        courseId: course.id,
        amount: finalPrice,
      })
      setQrStatus('pending')
    } catch (err) {
      setError(err?.message || 'Could not generate the QR code. Try again.')
      setQrStatus('error')
    }
  }

  const handlePayNow = async (event) => {
    event.preventDefault()
    setError('')

    if (!agreed) {
      setError('Please accept the terms and conditions to continue.')
      return
    }
    if (method === 'card') {
      if (cardNumber.trim().length < 4) {
        setError('Enter a valid card number.')
        return
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        setError('Enter a valid expiry date (MM/YY).')
        return
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError('Enter a valid CVV.')
        return
      }
    }
    if (method === 'upi' && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())) {
      setError('Enter a valid UPI ID (e.g. name@bank).')
      return
    }
    if (method === 'netbanking' && !selectedBank) {
      setError('Select your bank to continue.')
      return
    }

    setPaying(true)
    try {
      // Free course — enroll directly, no payment step.
      if (finalPrice === 0 || course.price === 0) {
        await enrollInCourse(course.id)
        navigate('/payment/success', {
          state: {
            course,
            transactionId: 'free-enrollment',
            amount: 0,
            paymentMethod: 'free',
          },
        })
        return
      }

      const order = await createOrder({ courseId: course.id, amount: finalPrice })

      // Live Razorpay flow — backend returned a Razorpay order + public key.
      if (order.razorpayOrderId && order.keyId) {
        await payWithRazorpay(order)
        return
      }

      // Offline/demo fallback (backend unreachable): previous card simulation.
      const result = await processPayment({
        orderId: order.orderId,
        cardNumber,
        expiry,
        cvv,
        upiId,
        bank: selectedBank,
      })

      if (result.success) {
        try {
          await enrollInCourse(course.id, order.demo ? undefined : order.orderId)
        } catch {
          // enrollment requires a paid order; demo mode enrolls locally
          await enrollInCourse(course.id)
        }
        navigate('/payment/success', {
          state: {
            course,
            transactionId: result.transactionId,
            amount: finalPrice,
            paymentMethod: method,
          },
        })
      } else {
        navigate('/payment/failed', { state: { course } })
      }
    } catch (err) {
      setError(err?.message || 'Payment failed. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  function loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => reject(new Error('Failed to load Razorpay checkout'))
      document.body.appendChild(script)
    })
  }

  async function payWithRazorpay(order) {
    try {
      await loadRazorpayScript()
    } catch {
      setError('Could not load Razorpay. Check your connection and try again.')
      return
    }

    // Checkout lo enter chesina details ni popup lo prefill cheyyadam
    const prefill = {
      name: user?.name || '',
      email: user?.email || '',
    }
    if (method === 'upi' && upiId.trim()) prefill.vpa = upiId.trim()
    if (method === 'netbanking' && BANK_CODES[selectedBank]) prefill.bank = BANK_CODES[selectedBank]

    const razorpay = new window.Razorpay({
      key: order.keyId,
      amount: order.raw?.razorpayOrder?.amount || finalPrice * 100,
      currency: order.currency || 'INR',
      name: 'Eduzyra',
      description: course.title,
      order_id: order.razorpayOrderId,
      prefill,
      handler: async (resp) => {
        try {
          const verified = await verifyPayment({
            orderId: order.orderId,
            razorpayOrderId: resp.razorpay_order_id,
            razorpayPaymentId: resp.razorpay_payment_id,
            razorpaySignature: resp.razorpay_signature,
          })
          try {
            await enrollAfterPayment({ courseId: course.id, orderId: order.orderId })
          } catch {
            await enrollInCourse(course.id, order.orderId)
          }
          navigate('/payment/success', {
            state: {
              course,
              transactionId: resp.razorpay_payment_id,
              amount: finalPrice,
              paymentMethod: verified?.method || verified?.payment?.method || method,
            },
          })
        } catch (err) {
          setError(err?.message || 'Payment verification failed.')
          setPaying(false)
        }
      },
      modal: {
        ondismiss: () => setPaying(false),
      },
      theme: { color: '#0f766e' },
    })
    razorpay.on('payment.failed', () => {
      setPaying(false)
      navigate('/payment/failed', { state: { course } })
    })
    razorpay.open()
  }

  return (
    <div className="container-page py-12 sm:py-16">
      <span className="eyebrow">Checkout</span>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Complete your enrollment</h1>

      <form onSubmit={handlePayNow} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card-surface flex flex-col gap-6 p-6">
          <CouponField price={course.price} courseId={course.id} onApplied={setCoupon} />

          <PaymentMethodPicker selected={method} onSelect={setMethod} />

          {method === 'card' && (
            <div>
              <label htmlFor="card" className="mb-1.5 block font-display text-sm font-medium">
                Card number
              </label>
              <input
                id="card"
                inputMode="numeric"
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value)}
                placeholder="4242 4242 4242 4242"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Demo mode: a card number ending in 0000 simulates a failed payment.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="mb-1.5 block font-display text-sm font-medium">
                    Expiry date
                  </label>
                  <input
                    id="expiry"
                    inputMode="numeric"
                    value={expiry}
                    maxLength={5}
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, '').slice(0, 4)
                      const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
                      setExpiry(formatted)
                    }}
                    placeholder="MM/YY"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="mb-1.5 block font-display text-sm font-medium">
                    CVV
                  </label>
                  <input
                    id="cvv"
                    type="password"
                    inputMode="numeric"
                    value={cvv}
                    maxLength={4}
                    onChange={(event) => setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {method === 'upi' && (
            <div>
              <label htmlFor="upi" className="mb-1.5 block font-display text-sm font-medium">
                UPI ID
              </label>
              <input
                id="upi"
                value={upiId}
                onChange={(event) => setUpiId(event.target.value)}
                placeholder="yourname@upi"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Enter your UPI ID, or scan the QR code below with any UPI app.
              </p>

              <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6">
                {REAL_QR ? (
                  qrStatus === 'pending' && qr?.imageUrl ? (
                    <>
                      <div className="rounded-xl bg-white p-3">
                        <img src={qr.imageUrl} alt="UPI QR code" className="h-44 w-44" />
                      </div>
                      <p className="text-xs text-slate-500">
                        Scan with any UPI app to pay {formatCurrency(finalPrice)}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Loader2 size={12} className="animate-spin" /> Waiting for payment…
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-slate-500">
                        {qrStatus === 'expired'
                          ? 'This QR has expired. Generate a new one.'
                          : 'Get a QR code to pay with any UPI app.'}
                      </p>
                      <button
                        type="button"
                        onClick={handleGenerateQr}
                        disabled={qrStatus === 'loading'}
                        className="btn-secondary disabled:opacity-70"
                      >
                        {qrStatus === 'loading' && <Loader2 size={16} className="animate-spin" />}
                        {qrStatus === 'expired' ? 'Generate new QR' : 'Show QR code'}
                      </button>
                    </>
                  )
                ) : (
                  <>
                    <div className="rounded-xl bg-white p-3">
                      <QRCodeSVG value="EDUZYRA-DEMO-QR-NOT-PAYABLE" size={160} level="M" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Scan to pay {finalPrice ? formatCurrency(finalPrice) : ''}
                    </p>
                    <p className="text-xs text-slate-400">
                      Demo QR (test mode). Use the UPI ID above and Pay Now to complete the payment.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {method === 'netbanking' && (
            <div>
              <label htmlFor="bank-search" className="mb-1.5 block font-display text-sm font-medium">
                Select your bank
              </label>
              <input
                id="bank-search"
                value={bankQuery}
                onChange={(event) => setBankQuery(event.target.value)}
                placeholder="Search banks…"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500"
              />

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {POPULAR_BANKS.filter((bank) =>
                  bank.toLowerCase().includes(bankQuery.trim().toLowerCase())
                ).map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                      selectedBank === bank
                        ? 'border-navy bg-navy-50 text-navy'
                        : 'border-slate-200 text-slate-600 hover:border-navy-200'
                    }`}
                  >
                    <Landmark size={16} className="shrink-0" />
                    <span className="truncate">{bank}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="flex items-start gap-2.5 text-sm text-slate-500">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-navy"
            />
            I agree to the Terms of Service and Refund Policy.
          </label>

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}

          <div className="sticky bottom-0 -mx-6 -mb-6 rounded-b-2xl border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
            <button type="submit" disabled={paying} className="btn-primary w-full disabled:opacity-70">
              {paying ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              {paying ? 'Verifying payment…' : `Pay ${finalPrice ? '' : ''}Now`}
            </button>
          </div>
        </div>

        <OrderSummary course={course} discount={coupon.valid ? coupon.discount : 0} finalPrice={finalPrice} />
      </form>
    </div>
  )
}
