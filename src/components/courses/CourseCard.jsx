import { Link } from 'react-router-dom'
import { Star, Clock, Users } from 'lucide-react'
import { formatCurrency, formatDiscount } from '../../utils/format'

export default function CourseCard({ course }) {
  const discount = formatDiscount(course.price, course.originalPrice)

  return (
    <Link
      to={'/courses/' + course.id}
      className="card-surface group flex h-full flex-col overflow-visible transition-shadow hover:shadow-md"
    >
      {/* Course Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-navy-50 px-5 py-4">
        <span className="font-mono text-[11px] uppercase tracking-wide text-navy-500">
          {course.code}
        </span>

        <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-navy-600">
          {course.level}
        </span>
      </div>

      {/* Course Content */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <span className="eyebrow">
          {course.category}
        </span>

        <h3 className="font-display text-lg font-semibold leading-7 text-ink group-hover:text-navy-700">
          {course.title}
        </h3>

        <p className="text-sm leading-6 text-slate-500">
          {course.summary}
        </p>

        {/* Course Details */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            {course.rating}
          </span>

          <span className="flex items-center gap-1">
            <Clock size={13} />
            {course.duration}
          </span>

          <span className="flex items-center gap-1">
            <Users size={13} />
            {course.students.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-ink">
              {formatCurrency(course.price)}
            </span>

            {discount && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(course.originalPrice)}
              </span>
            )}
          </div>

          {discount && (
            <span className="rounded-full bg-teal-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-teal-700">
              {discount}% off
            </span>
          )}
        </div>

        {/* Enrollment Button */}
        <div className="pt-2">
          <span className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-navy-600 px-4 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-navy-700">
            Enroll Now
          </span>
        </div>
      </div>
    </Link>
  )
}