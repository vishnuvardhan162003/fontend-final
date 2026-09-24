import { BookOpen, Users, Star, ClipboardCheck } from 'lucide-react'
import { COURSES } from '../constants/courses'
import { useAuth } from '../hooks/useAuth'
import StatCard from '../components/dashboard/StatCard'
import InstructorCourseCard from '../components/instructor/InstructorCourseCard'

// Demo assignment: first three catalog courses "belong" to the logged-in instructor.
const MY_COURSES = COURSES.slice(0, 3)

export default function InstructorDashboard() {
  const { user } = useAuth()

  return (
    <div className="container-page py-10 sm:py-12">
      <span className="eyebrow">Instructor</span>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Welcome, {user?.name}</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Courses taught" value={MY_COURSES.length} />
        <StatCard icon={Users} label="Total students" value="6,470" />
        <StatCard icon={Star} label="Avg. rating" value="4.75" />
        <StatCard icon={ClipboardCheck} label="Reviews pending" value="12" />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold">Your courses</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MY_COURSES.map((course) => (
            <InstructorCourseCard key={course.id} course={course} students={course.students} />
          ))}
        </div>
      </div>
    </div>
  )
}
