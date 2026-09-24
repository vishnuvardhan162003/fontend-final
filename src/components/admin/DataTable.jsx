export default function DataTable({ columns, rows, statusKey }) {
  const statusColor = (status) => {
    switch (status) {
      case 'Successful':
        return 'bg-teal-50 text-teal-700'
      case 'Pending':
        return 'bg-amber-100 text-amber-700'
      case 'Failed':
        return 'bg-red-50 text-red-600'
      case 'Refunded':
        return 'bg-slate-100 text-slate-500'
      default:
        return 'bg-slate-100 text-slate-500'
    }
  }

  return (
    <div className="card-surface overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-slate-400">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-b border-slate-50 last:border-0">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-slate-600">
                  {col.key === statusKey ? (
                    <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold ${statusColor(row[col.key])}`}>
                      {row[col.key]}
                    </span>
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
