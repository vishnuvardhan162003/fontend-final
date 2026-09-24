import { useState } from 'react'
import { Tag, CircleCheck, CircleX } from 'lucide-react'
import { applyCoupon as applyLocalCoupon } from '../../constants/coupons'
import { apiFetch } from '../../services/api'

export default function CouponField({ price, courseId, onApplied }) {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState(null) // null | 'valid' | 'invalid'
  const [checking, setChecking] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) return
    setChecking(true)
    // Try the live backend first (requires login); fall back to local codes offline.
    try {
      const data = await apiFetch('/api/coupons/apply', {
        method: 'POST',
        body: { code: code.trim(), courseId: courseId || 'any' },
      })
      const discount = data?.discount ?? 0
      const finalPrice = Math.max(price - discount, 0)
      setStatus('valid')
      onApplied({ valid: true, discount, finalPrice, coupon: data?.coupon || { code: code.trim() } })
      return
    } catch {
      // fall through to local validation
    } finally {
      setChecking(false)
    }
    const result = applyLocalCoupon(code, price)
    if (result.valid) {
      setStatus('valid')
      onApplied(result)
    } else {
      setStatus('invalid')
      onApplied({ valid: false, discount: 0, finalPrice: price })
    }
  }

  return (
    <div>
      <label htmlFor="coupon" className="mb-1.5 flex items-center gap-1.5 font-display text-sm font-medium">
        <Tag size={14} />
        Coupon code
      </label>
      <div className="flex gap-2">
        <input
          id="coupon"
          type="text"
          value={code}
          onChange={(event) => {
            setCode(event.target.value)
            setStatus(null)
          }}
          placeholder="e.g. WELCOME10"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-teal-500"
        />
        <button type="button" onClick={handleApply} disabled={checking} className="btn-secondary shrink-0 !px-4 disabled:opacity-60">
          {checking ? 'Checking…' : 'Apply'}
        </button>
      </div>
      {status === 'valid' && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-teal-600">
          <CircleCheck size={14} />
          Coupon applied
        </p>
      )}
      {status === 'invalid' && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-500">
          <CircleX size={14} />
          Invalid or expired coupon
        </p>
      )}
    </div>
  )
}
