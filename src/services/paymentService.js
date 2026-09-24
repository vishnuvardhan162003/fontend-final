// Payment integration with the Eduzyra Node backend (Razorpay).
// Backend contract:
//   POST /api/payments/order  { courseId, couponCode? } -> { order, razorpayOrder, keyId }
//   POST /api/payments/verify { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
//   POST /api/enrollments     { courseId, orderId? }    -> enrollment (free courses)
//
// For free courses (price === 0) enrollment is direct with no Razorpay step.
// If the backend is unreachable, falls back to the previous demo behavior so
// the checkout UI remains testable offline.

import { apiFetch } from './api'

function demoOrder(courseId, amount) {
  return {
    orderId: `order_${courseId}_${Date.now()}`,
    amount,
    currency: 'INR',
    demo: true,
  }
}

export async function createOrder({ courseId, amount, couponCode } = {}) {
  try {
    const data = await apiFetch('/api/payments/order', {
      method: 'POST',
      body: couponCode ? { courseId, couponCode } : { courseId },
    })
    // Controller returns different shapes across versions — normalize.
    const order = data?.order || data
    return {
      orderId: String(order?._id || order?.orderId || order?.id || ''),
      razorpayOrderId: data?.razorpayOrder?.id || order?.razorpayOrderId || null,
      amount: order?.amount ?? amount,
      currency: order?.currency || 'INR',
      keyId: data?.keyId || null,
      raw: data,
    }
  } catch {
    return demoOrder(courseId, amount)
  }
}

export async function verifyPayment({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  return apiFetch('/api/payments/verify', {
    method: 'POST',
    body: { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature },
  })
}

// Simulates a payment attempt for offline/demo mode only.
// Real payments go through Razorpay Checkout (see Checkout.jsx) + verifyPayment().
// Kept so the UI demo flow (card ending in 0000 = failure) still works offline.
export async function processPayment({ orderId, cardNumber } = {}) {
  const willFail = cardNumber?.trim().endsWith('0000')
  await new Promise((resolve) => setTimeout(resolve, 900))
  return {
    success: !willFail,
    transactionId: willFail ? null : `txn_${orderId}_${Math.floor(Math.random() * 100000)}`,
    orderId,
    demo: true,
  }
}

export async function enrollAfterPayment({ courseId, orderId }) {
  return apiFetch('/api/enrollments', {
    method: 'POST',
    body: orderId ? { courseId, orderId } : { courseId },
  })
}
