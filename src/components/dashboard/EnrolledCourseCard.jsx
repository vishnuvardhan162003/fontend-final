import { Link } from 'react-router-dom'

export default function EnrolledCourseCard({ course, progress }) {
  return (
    <div className="card-surface flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <span className="eyebrow">{course.code}</span>
        <span className="font-mono text-xs text-slate-400">{progress}% complete</span>
      </div>
      <h3 className="font-display text-base font-semibold">{course.title}</h3>

      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-teal-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Link
        to={`/learn/${course.id}`}
        className="mt-1 font-display text-sm font-semibold text-navy hover:text-navy-700"
      >
        Continue path →
      </Link>
    </div>
  )
}
