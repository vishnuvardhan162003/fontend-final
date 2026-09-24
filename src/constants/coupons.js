// Mock coupon data. In production, coupon validation happens server-side at
// checkout time — this file exists only so the Checkout UI has something to
// validate against before a real payments backend is connected.
export const COUPONS = [
  { code: 'WELCOME10', type: 'percentage', value: 10, label: '10% off for first-time learners' },
  { code: 'EARLYBIRD500', type: 'flat', value: 500, label: '₹500 off — early-bird offer' },
  { code: 'BATCH2026', type: 'percentage', value: 15, label: '15% off — 2026 batch offer' },
]

export function applyCoupon(code, price) {
  const coupon = COUPONS.find((c) => c.code.toLowerCase() === code.trim().toLowerCase())
  if (!coupon) return { valid: false, discount: 0, finalPrice: price }

  const discount = coupon.type === 'percentage' ? Math.round((price * coupon.value) / 100) : coupon.value
  const finalPrice = Math.max(price - discount, 0)
  return { valid: true, coupon, discount, finalPrice }
}
