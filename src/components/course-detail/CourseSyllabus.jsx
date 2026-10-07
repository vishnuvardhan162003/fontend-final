import { useState } from 'react'
import { ChevronDown, Lock, PlayCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { getCourseById } from '../../constants/courses'
import { getModuleLessons } from '../../constants/lessonContent'

export default function CourseSyllabus({ syllabus, courseId }) {
  const { enrolledCourseIds } = useAuth()
  const isEnrolled = (enrolledCourseIds || []).includes(courseId)
  const courseTitle = getCourseById(courseId)?.title

  const [openModule, setOpenModule] = useState(null)
  const [openLesson, setOpenLesson] = useState(null)

  return (
    <div>
      <h2 className="font-display text-xl font-bold">Path structure</h2>

      <ol className="mt-5 flex flex-col gap-3">
        {syllabus.map((module, index) => {
          const lessons = getModuleLessons({
            courseId,
            courseTitle,
            moduleTitle: module.title,
            count: module.lessons,
          })
          const moduleOpen = openModule === index

          return (
            <li
              key={module.title}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <button
                type="button"
                aria-expanded={moduleOpen}
                onClick={() => setOpenModule(moduleOpen ? null : index)}
                className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-slate-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-sm font-semibold">{module.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-400">
                    {lessons.length} lessons
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${moduleOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {moduleOpen && (
                <ul className="border-t border-slate-100 bg-slate-50">
                  {lessons.map((lesson, li) => {
                    const key = `${index}-${li}`
                    const lessonOpen = openLesson === key

                    return (
                      <li key={key} className="border-b border-slate-100 last:border-b-0">
                        <button
                          type="button"
                          disabled={!isEnrolled}
                          aria-expanded={isEnrolled ? lessonOpen : undefined}
                          onClick={() => setOpenLesson(lessonOpen ? null : key)}
                          className={`flex w-full items-center justify-between gap-3 py-3 pl-14 pr-5 text-left text-sm ${
                            isEnrolled
                              ? 'text-ink hover:bg-white'
                              : 'cursor-not-allowed text-slate-400'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {isEnrolled ? (
                              <PlayCircle size={16} className="text-teal-600" />
                            ) : (
                              <Lock size={14} />
                            )}
                            <span className="font-mono text-xs text-slate-400">
                              {index + 1}.{li + 1}
                            </span>
                            {lesson.title}
                          </span>

                          {isEnrolled ? (
                            <ChevronDown
                              size={14}
                              className={`transition-transform ${lessonOpen ? 'rotate-180' : ''}`}
                            />
                          ) : (
                            <span className="text-xs">Enroll to access</span>
                          )}
                        </button>

                        {isEnrolled && lessonOpen && (
                          <div className="bg-white py-4 pl-14 pr-5 text-sm leading-6 text-slate-600">
                            {lesson.summary}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
