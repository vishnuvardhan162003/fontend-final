import { formatCurrency } from '../../utils/format'

export default function OrderSummary({ course, discount = 0, finalPrice }) {
  return (
    <div className="card-surface p-6">
      <h2 className="font-display text-lg font-bold">Order summary</h2>

      <div className="mt-4 flex gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy-50 font-mono text-xs text-navy-500">
          {course.code}
        </div>
        <div>
          <p className="font-display text-sm font-semibold leading-snug">{course.title}</p>
          <p className="mt-1 text-xs text-slate-400">{course.duration} · {course.level}</p>
        </div>
      </div>

      <dl className="mt-4 flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between text-slate-500">
          <dt>Course price</dt>
          <dd className="text-ink">{formatCurrency(course.originalPrice)}</dd>
        </div>
        <div className="flex justify-between text-slate-500">
          <dt>Cohort discount</dt>
          <dd className="text-teal-600">
            − {formatCurrency(course.originalPrice - course.price)}
          </dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-slate-500">
            <dt>Coupon discount</dt>
            <dd className="text-teal-600">− {formatCurrency(discount)}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
        <span className="font-display text-sm font-semibold">Total payable</span>
        <span className="font-display text-xl font-bold">{formatCurrency(finalPrice)}</span>
      </div>
    </div>
  )
}
