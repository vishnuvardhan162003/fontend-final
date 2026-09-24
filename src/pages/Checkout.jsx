import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ShieldCheck, Loader2, QrCode, Landmark } from 'lucide-react'
import { fetchCourseById } from '../services/courseService'
import { createOrder, processPayment, verifyPayment, enrollAfterPayment } from '../services/paymentService'
import { useAuth } from '../hooks/useAuth'
import { POPULAR_BANKS } from '../constants/banks'
import { formatCurrency } from '../utils/format'
import OrderSummary from '../components/checkout/OrderSummary'
import CouponField from '../components/checkout/CouponField'
import PaymentMethodPicker from '../components/checkout/PaymentMethodPicker'
import Spinner from '../components/common/Spinner'

export default function Checkout() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { enrollInCourse } = useAuth()

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

  useEffect(() => {
    fetchCourseById(courseId).then((result) => {
      setCourse(result)
      setCoupon({ valid: false, discount: 0, finalPrice: result?.price ?? 0 })
      setLoading(false)
    })
  }, [courseId])

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
          state: { course, transactionId: 'free-enrollment', amount: 0 },
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
          state: { course, transactionId: result.transactionId, amount: finalPrice },
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
    const razorpay = new window.Razorpay({
      key: order.keyId,
      amount: order.raw?.razorpayOrder?.amount || finalPrice * 100,
      currency: order.currency || 'INR',
      name: 'Eduzyra',
      description: course.title,
      order_id: order.razorpayOrderId,
      handler: async (resp) => {
        try {
          await verifyPayment({
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
            state: { course, transactionId: resp.razorpay_payment_id, amount: finalPrice },
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

              <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6">
                <QrCode size={120} strokeWidth={1} className="text-navy-700" />
                <p className="text-xs text-slate-400">Scan to pay {finalPrice ? formatCurrency(finalPrice) : ''}</p>
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
