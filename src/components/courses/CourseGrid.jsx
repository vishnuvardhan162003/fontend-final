import CourseCard from './CourseCard'
import Spinner from '../common/Spinner'
import { PackageOpen } from 'lucide-react'

export default function CourseGrid({ courses, loading }) {
  if (loading) {
    return <Spinner label="Loading courses" />
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <PackageOpen size={28} className="text-slate-300" />
        <p className="font-display text-sm font-semibold text-slate-600">No courses match yet</p>
        <p className="max-w-xs text-sm text-slate-400">
          Try a different search term or switch categories.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
