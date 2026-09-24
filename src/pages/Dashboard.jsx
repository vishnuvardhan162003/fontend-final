import { Link } from 'react-router-dom'
import { BookOpen, Flame, Trophy, Receipt } from 'lucide-react'
import { getCourseById } from '../constants/courses'
import { useAuth } from '../hooks/useAuth'
import StatCard from '../components/dashboard/StatCard'
import EnrolledCourseCard from '../components/dashboard/EnrolledCourseCard'

export default function Dashboard() {
  const { user, enrolledCourseIds } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'there'

  const enrolledCourses = enrolledCourseIds
    .map((id) => getCourseById(id))
    .filter(Boolean)

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Welcome back, {firstName}</h1>
          <p className="mt-2 text-sm text-slate-500">
            Pick up where you left off — your next checkpoint is waiting.
          </p>
        </div>
        <Link to="/profile" className="btn-secondary shrink-0">
          <Receipt size={15} />
          Profile & payments
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={BookOpen} label="Active paths" value={enrolledCourses.length} />
        {/* TODO: wire to real streak/checkpoint tracking once that exists on the backend.
            These were previously hardcoded to '12 days' / '9' for every user. */}
        <StatCard icon={Flame} label="Day streak" value="0 days" />
        <StatCard icon={Trophy} label="Checkpoints cleared" value="0" />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold">Continue learning</h2>

        {enrolledCourses.length === 0 ? (
          <div className="card-surface mt-5 flex flex-col items-center gap-3 p-10 text-center">
            <p className="font-display text-sm font-semibold text-slate-600">
              You haven't enrolled in a course yet
            </p>
            <Link to="/courses" className="btn-primary mt-1">
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {enrolledCourses.map((course) => (
              <EnrolledCourseCard key={course.id} course={course} progress={0} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
