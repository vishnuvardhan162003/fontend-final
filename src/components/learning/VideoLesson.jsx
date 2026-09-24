import { PlayCircle, FileDown } from 'lucide-react'

export default function VideoLesson({ lesson, onComplete, isComplete }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-navy-900 text-white">
        <div className="flex flex-col items-center gap-2">
          <PlayCircle size={48} className="text-teal-400" />
          <p className="font-mono text-xs text-white/50">{lesson.durationMinutes} min lesson video</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
        <span className="flex items-center gap-2 text-sm text-slate-500">
          <FileDown size={16} />
          Lesson notes & resources.pdf
        </span>
        <button type="button" className="font-display text-xs font-semibold text-navy hover:text-navy-700">
          Download
        </button>
      </div>

      <button
        type="button"
        onClick={onComplete}
        disabled={isComplete}
        className="btn-primary w-fit disabled:opacity-60"
      >
        {isComplete ? 'Completed' : 'Mark as complete'}
      </button>
    </div>
  )
}
