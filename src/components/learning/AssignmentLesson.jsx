import { useState } from 'react'
import { UploadCloud, CircleCheck } from 'lucide-react'

export default function AssignmentLesson({ onComplete, isComplete }) {
  const [fileName, setFileName] = useState('')

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) setFileName(file.name)
  }

  const handleSubmit = () => {
    if (fileName) onComplete()
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="font-display text-sm font-semibold">Capstone submission</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          Submit a link or file for your capstone project. A mentor will review it and leave
          feedback within 3 business days.
        </p>
      </div>

      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-6 py-10 text-center hover:border-teal-400">
        <UploadCloud size={28} className="text-slate-400" />
        <span className="font-display text-sm font-semibold text-navy">
          {fileName || 'Click to upload your project'}
        </span>
        <span className="text-xs text-slate-400">ZIP, PDF, or a link document up to 25MB</span>
        <input type="file" className="hidden" onChange={handleFileChange} />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!fileName || isComplete}
          className="btn-primary w-fit disabled:opacity-60"
        >
          Submit assignment
        </button>
        {isComplete && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-teal-600">
            <CircleCheck size={16} />
            Submitted
          </span>
        )}
      </div>
    </div>
  )
}
