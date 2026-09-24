import { useEffect, useState } from 'react'
import { Star, Inbox } from 'lucide-react'
import { getAllFeedback } from '../../services/feedbackService'
import { getCourseById } from '../../constants/courses'

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={13}
          className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
        />
      ))}
    </div>
  )
}

export default function AdminFeedback() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getAllFeedback().then((data) => {
      if (active) {
        setEntries(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <p className="text-sm text-slate-400">Loading feedback…</p>
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <Inbox size={28} className="text-slate-300" />
        <p className="font-display text-sm font-semibold text-slate-500">No feedback yet</p>
        <p className="max-w-xs text-xs text-slate-400">
          Submissions from the /feedback page will show up here as soon as someone sends one — in
          this browser session.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold">Feedback submissions</h3>
        <span className="font-mono text-xs text-slate-400">{entries.length} total</span>
      </div>

      <div className="flex flex-col gap-3">
        {entries.map((entry) => {
          const course = entry.courseId ? getCourseById(entry.courseId) : null
          return (
            <div key={entry.id} className="card-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-sm font-semibold text-ink">{entry.name}</p>
                  <p className="text-xs text-slate-400">{entry.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-navy-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-navy-600">
                    {entry.category}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-slate-500">
                    {entry.role}
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <Stars rating={entry.rating} />
                {course && <span className="text-xs text-slate-400">{course.title}</span>}
              </div>

              <p className="mt-2 text-sm leading-relaxed text-slate-600">{entry.message}</p>

              <p className="mt-2 font-mono text-[11px] text-slate-400">
                {entry.id} · {new Date(entry.submittedAt).toLocaleString('en-IN')}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
