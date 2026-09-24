import { Users, BookOpen, Pencil } from 'lucide-react'

export default function InstructorCourseCard({ course, students }) {
  return (
    <div className="card-surface flex flex-col gap-3 p-5">
      <span className="eyebrow">{course.code}</span>
      <h3 className="font-display text-base font-semibold">{course.title}</h3>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Users size={13} />
          {students} students
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen size={13} />
          {course.syllabus.length} modules
        </span>
      </div>

      <button type="button" className="btn-secondary mt-1 w-fit !px-4 !py-2 text-xs">
        <Pencil size={13} />
        Manage content
      </button>
    </div>
  )
}
