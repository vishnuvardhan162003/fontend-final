export default function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-teal-500"
        role="status"
      />
      <span className="font-mono text-xs uppercase tracking-[0.14em]">{label}</span>
    </div>
  )
}
