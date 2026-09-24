import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy">
        <Compass size={26} />
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.16em] text-slate-400">
        Error 404
      </span>
      <h1 className="font-display text-3xl font-bold">This path does not exist</h1>
      <p className="max-w-sm text-sm text-slate-500">
        The page you are looking for may have been moved, renamed, or never existed.
      </p>
      <Link to="/" className="btn-primary mt-2">
        Back to home
      </Link>
    </div>
  )
}
