export default function CourseSyllabus({ syllabus }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">Path structure</h2>
      <ol className="mt-5 flex flex-col gap-3">
        {syllabus.map((module, index) => (
          <li
            key={module.title}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-slate-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-display text-sm font-semibold">{module.title}</span>
            </div>
            <span className="font-mono text-xs text-slate-400">{module.lessons} lessons</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
