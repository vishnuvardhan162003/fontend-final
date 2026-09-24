import { PAYMENTS } from '../../constants/adminData'
import { formatCurrency } from '../../utils/format'
import DataTable from './DataTable'

const COLUMNS = [
  { key: 'id', label: 'Transaction ID' },
  { key: 'student', label: 'Student' },
  { key: 'course', label: 'Course' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
]

export default function AdminPayments() {
  const rows = PAYMENTS.map((p) => ({ ...p, amount: formatCurrency(p.amount) }))
  return (
    <div>
      <h3 className="mb-4 font-display text-sm font-semibold">Recent transactions</h3>
      <DataTable columns={COLUMNS} rows={rows} statusKey="status" />
    </div>
  )
}
