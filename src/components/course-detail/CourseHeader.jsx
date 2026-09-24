import { Star, Clock, Users, BookOpen } from 'lucide-react'

export default function CourseHeader({ course }) {
  return (
    <div className="border-b border-slate-200 bg-white py-10 sm:py-14">
      <div className="container-page">
        <span className="eyebrow">
          {course.category} · {course.code}
        </span>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          {course.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
          {course.summary}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Star size={15} className="fill-amber-400 text-amber-400" />
            <strong className="text-ink">{course.rating}</strong> rating
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={15} />
            {course.students.toLocaleString('en-IN')} students
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={15} />
            {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen size={15} />
            {course.lessons} lessons
          </span>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Instructor <span className="font-display font-semibold text-ink">{course.instructor}</span>
        </p>
      </div>
    </div>
  )
}
