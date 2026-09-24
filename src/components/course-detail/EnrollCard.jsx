import { CircleCheck } from 'lucide-react'
import { formatCurrency, formatDiscount } from '../../utils/format'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'

export default function EnrollCard({ course }) {
  const { isAuthenticated, isEnrolledIn } = useAuth()
  const navigate = useNavigate()
  const discount = formatDiscount(course.price, course.originalPrice)
  const enrolled = isEnrolledIn(course.id)

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/checkout/${course.id}` } })
      return
    }
    navigate(`/checkout/${course.id}`)
  }

  return (
    <aside className="card-surface sticky top-24 mb-6 flex max-h-[calc(100vh-7rem)] flex-col gap-5 overflow-y-auto p-6 pb-8">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold">{formatCurrency(course.price)}</span>
        {discount && (
          <span className="text-sm text-slate-400 line-through">
            {formatCurrency(course.originalPrice)}
          </span>
        )}
      </div>
      {discount && (
        <span className="w-fit rounded-full bg-teal-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-teal-700">
          {discount}% off · cohort pricing
        </span>
      )}

      {enrolled ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-700">
            <CircleCheck size={18} />
            You are enrolled
          </div>
          <Link to={`/learn/${course.id}`} className="btn-primary w-full">
            Continue learning
          </Link>
        </div>
      ) : (
        <button type="button" onClick={handleEnroll} className="btn-primary w-full">
          Enroll now
        </button>
      )}

      <ul className="flex flex-col gap-2.5 border-t border-slate-100 pt-4 text-sm text-slate-500">
        <li>{course.duration} · self-paced with weekly checkpoints</li>
        <li>{course.lessons} lessons across {course.syllabus.length} modules</li>
        <li>Mentor review at every checkpoint</li>
        <li>Certificate of completion</li>
      </ul>
    </aside>
  )
}
