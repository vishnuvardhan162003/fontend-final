import { Plus } from 'lucide-react'
import { COUPONS } from '../../constants/coupons'

export default function AdminCoupons() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold">Active coupons</h3>
        <button type="button" className="btn-primary !px-4 !py-2 text-xs">
          <Plus size={14} />
          New coupon
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {COUPONS.map((coupon) => (
          <div key={coupon.code} className="card-surface flex flex-col gap-1 p-4">
            <span className="font-mono text-sm font-bold text-navy">{coupon.code}</span>
            <span className="text-sm text-slate-500">{coupon.label}</span>
            <span className="mt-1 w-fit rounded-full bg-teal-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-teal-700">
              {coupon.type === 'percentage' ? `${coupon.value}% off` : `₹${coupon.value} off`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
