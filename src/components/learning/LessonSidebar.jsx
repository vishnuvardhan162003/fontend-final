import { CircleCheck, Circle, PlayCircle, ListChecks, FileText } from 'lucide-react'

const TYPE_ICON = { video: PlayCircle, quiz: ListChecks, assignment: FileText }

export default function LessonSidebar({ lessons, activeLessonId, completedIds, onSelect }) {
  const modules = []
  lessons.forEach((lesson) => {
    if (!modules[lesson.moduleIndex]) {
      modules[lesson.moduleIndex] = { title: lesson.moduleTitle, lessons: [] }
    }
    modules[lesson.moduleIndex].lessons.push(lesson)
  })

  return (
    <nav className="card-surface flex max-h-[75vh] flex-col overflow-y-auto p-4">
      {modules.map((module, index) => (
        <div key={module.title} className="mb-4 last:mb-0">
          <p className="mb-2 px-2 font-mono text-[11px] uppercase tracking-wide text-slate-400">
            {String(index + 1).padStart(2, '0')} · {module.title}
          </p>
          <ul className="flex flex-col gap-0.5">
            {module.lessons.map((lesson) => {
              const Icon = TYPE_ICON[lesson.type]
              const isActive = lesson.id === activeLessonId
              const isDone = completedIds.includes(lesson.id)
              return (
                <li key={lesson.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(lesson.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                      isActive ? 'bg-navy-50 text-navy' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isDone ? (
                      <CircleCheck size={16} className="shrink-0 text-teal-500" />
                    ) : (
                      <Circle size={16} className="shrink-0 text-slate-300" />
                    )}
                    <Icon size={14} className="shrink-0 text-slate-400" />
                    <span className="flex-1 truncate">{lesson.title}</span>
                    {lesson.durationMinutes && (
                      <span className="shrink-0 font-mono text-[10px] text-slate-400">
                        {lesson.durationMinutes}m
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
