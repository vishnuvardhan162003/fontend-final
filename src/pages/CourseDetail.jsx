import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchCourseById } from '../services/courseService'
import CourseHeader from '../components/course-detail/CourseHeader'
import CourseOutcomes from '../components/course-detail/CourseOutcomes'
import CourseSyllabus from '../components/course-detail/CourseSyllabus'
import LiveSessionsSection from '../components/course-detail/LiveSessionsSection'
import EnrollCard from '../components/course-detail/EnrollCard'
import Spinner from '../components/common/Spinner'

export default function CourseDetail() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchCourseById(courseId).then((result) => {
      if (!cancelled) {
        setCourse(result)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [courseId])

  if (loading) {
    return <Spinner label="Loading course" />
  }

  if (!course) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Course not found</h1>
        <p className="text-sm text-slate-500">This course may have been moved or retired.</p>
        <Link to="/courses" className="btn-primary">
          Back to courses
        </Link>
      </div>
    )
  }

  return (
    <div>
      <CourseHeader course={course} />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-8">
          <div className="flex gap-2 border-b border-slate-200" role="tablist" aria-label="Course sections">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'live', label: 'Live Projects' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                  tab === t.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tab === 'overview' ? (
            <>
              <CourseOutcomes outcomes={course.outcomes} />
              <CourseSyllabus syllabus={course.syllabus} />
            </>
          ) : (
            <LiveSessionsSection courseId={course.id} />
          )}
        </div>
        <EnrollCard course={course} />
      </div>
    </div>
  )
}
