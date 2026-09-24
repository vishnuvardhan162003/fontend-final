import { Pencil, Trash2, Plus } from 'lucide-react'
import { COURSES } from '../../constants/courses'
import { formatCurrency } from '../../utils/format'

export default function AdminCourses() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold">All courses ({COURSES.length})</h3>
        <button type="button" className="btn-primary !px-4 !py-2 text-xs">
          <Plus size={14} />
          Add course
        </button>
      </div>

      <div className="card-surface divide-y divide-slate-50">
        {COURSES.map((course) => (
          <div key={course.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="font-display text-sm font-semibold">{course.title}</p>
              <p className="font-mono text-[11px] text-slate-400">{course.code} · {course.category}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-display text-sm font-semibold">{formatCurrency(course.price)}</span>
              <button type="button" className="text-slate-400 hover:text-navy" aria-label={`Edit ${course.title}`}>
                <Pencil size={15} />
              </button>
              <button type="button" className="text-slate-400 hover:text-red-500" aria-label={`Delete ${course.title}`}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
