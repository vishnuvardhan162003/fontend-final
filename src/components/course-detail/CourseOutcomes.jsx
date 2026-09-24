import { CircleCheck } from 'lucide-react'

export default function CourseOutcomes({ outcomes }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">What you will be able to do</h2>
      <ul className="mt-5 flex flex-col gap-3">
        {outcomes.map((outcome) => (
          <li key={outcome} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
            <CircleCheck size={18} className="mt-0.5 shrink-0 text-teal-500" />
            {outcome}
          </li>
        ))}
      </ul>
    </div>
  )
}
