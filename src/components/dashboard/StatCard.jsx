export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card-surface flex items-center gap-4 p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy">
        <Icon size={20} />
      </span>
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <p className="font-display text-xl font-bold">{value}</p>
      </div>
    </div>
  )
}
