import { Users, BookOpen, IndianRupee, TrendingUp } from 'lucide-react'
import { COURSES } from '../../constants/courses'
import { STUDENTS, REVENUE_SUMMARY } from '../../constants/adminData'
import { formatCurrency } from '../../utils/format'
import StatCard from '../dashboard/StatCard'

export default function AdminOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={IndianRupee} label="Total revenue" value={formatCurrency(REVENUE_SUMMARY.totalRevenue)} />
        <StatCard icon={Users} label="Total students" value={STUDENTS.length.toLocaleString('en-IN')} />
        <StatCard icon={BookOpen} label="Live courses" value={COURSES.length} />
        <StatCard icon={TrendingUp} label="Successful payments" value={REVENUE_SUMMARY.successfulPayments} />
      </div>

      <div className="card-surface p-6">
        <h3 className="font-display text-sm font-semibold">Payment status breakdown</h3>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Successful', value: REVENUE_SUMMARY.successfulPayments, color: 'text-teal-600' },
            { label: 'Pending', value: REVENUE_SUMMARY.pendingPayments, color: 'text-amber-600' },
            { label: 'Failed', value: REVENUE_SUMMARY.failedPayments, color: 'text-red-500' },
            { label: 'Refunded', value: REVENUE_SUMMARY.refunds, color: 'text-slate-500' },
          ].map((item) => (
            <div key={item.label}>
              <p className={`font-display text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="font-mono text-[11px] uppercase tracking-wide text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
