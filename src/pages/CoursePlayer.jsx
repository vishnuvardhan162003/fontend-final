import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Award } from 'lucide-react'
import { fetchCourseById } from '../services/courseService'
import { issueCertificate } from '../services/certificateService'
import { useAuth } from '../hooks/useAuth'
import { buildLessonPlan } from '../utils/lessonPlan'
import Spinner from '../components/common/Spinner'
import LessonSidebar from '../components/learning/LessonSidebar'
import VideoLesson from '../components/learning/VideoLesson'
import QuizLesson from '../components/learning/QuizLesson'
import AssignmentLesson from '../components/learning/AssignmentLesson'

export default function CoursePlayer() {
  const { courseId } = useParams()
  const { user, isEnrolledIn } = useAuth()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeLessonId, setActiveLessonId] = useState(null)
  const [completedIds, setCompletedIds] = useState([])
  const [certificate, setCertificate] = useState(null)

  useEffect(() => {
    fetchCourseById(courseId).then((result) => {
      setCourse(result)
      setLoading(false)
    })
  }, [courseId])

  const lessons = useMemo(() => (course ? buildLessonPlan(course) : []), [course])

  useEffect(() => {
    if (lessons.length && !activeLessonId) setActiveLessonId(lessons[0].id)
  }, [lessons, activeLessonId])

  if (loading) return <Spinner label="Loading your path" />
  if (!course) return <Navigate to="/courses" replace />
  if (!isEnrolledIn(course.id)) return <Navigate to={`/courses/${course.id}`} replace />

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId)
  const progress = Math.round((completedIds.length / lessons.length) * 100)

  const markComplete = async (lessonId) => {
    if (completedIds.includes(lessonId)) return
    const next = [...completedIds, lessonId]
    setCompletedIds(next)

    if (next.length === lessons.length && !certificate) {
      const cert = await issueCertificate({
        studentName: user?.name ?? 'Learner',
        courseTitle: course.title,
      })
      setCertificate(cert)
    }
  }

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="flex flex-col gap-1">
        <span className="eyebrow">{course.code}</span>
        <h1 className="text-xl font-bold sm:text-2xl">{course.title}</h1>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="font-mono text-xs text-slate-400">{progress}%</span>
      </div>

      {certificate && (
        <div className="mt-5 flex flex-col items-start gap-3 rounded-xl bg-teal-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Award size={22} className="text-teal-600" />
            <div>
              <p className="font-display text-sm font-semibold text-teal-800">
                Path complete — your certificate is ready
              </p>
              <p className="font-mono text-xs text-teal-700">{certificate.id}</p>
            </div>
          </div>
          <Link to={`/certificate/${certificate.id}`} className="btn-accent shrink-0">
            View certificate
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <LessonSidebar
          lessons={lessons}
          activeLessonId={activeLessonId}
          completedIds={completedIds}
          onSelect={setActiveLessonId}
        />

        <div className="card-surface p-6">
          {activeLesson && (
            <>
              <p className="eyebrow">{activeLesson.moduleTitle}</p>
              <h2 className="mt-1 font-display text-lg font-bold">{activeLesson.title}</h2>
              <div className="mt-5">
                {activeLesson.type === 'video' && (
                  <VideoLesson
                    lesson={activeLesson}
                    isComplete={completedIds.includes(activeLesson.id)}
                    onComplete={() => markComplete(activeLesson.id)}
                  />
                )}
                {activeLesson.type === 'quiz' && (
                  <QuizLesson
                    isComplete={completedIds.includes(activeLesson.id)}
                    onComplete={() => markComplete(activeLesson.id)}
                  />
                )}
                {activeLesson.type === 'assignment' && (
                  <AssignmentLesson
                    isComplete={completedIds.includes(activeLesson.id)}
                    onComplete={() => markComplete(activeLesson.id)}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
