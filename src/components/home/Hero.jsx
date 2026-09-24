import { ArrowRight, CircleCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const PATH_NODES = [
  { label: 'Enroll', state: 'done' },
  { label: 'Build', state: 'done' },
  { label: 'Review', state: 'active' },
  { label: 'Ship', state: 'upcoming' },
  { label: 'Hire-ready', state: 'upcoming' },
]

export default function Hero() {
  return (
    <section className="overflow-hidden border-b border-slate-200 bg-white">
      <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
        <div>
          <span className="eyebrow">Eduzyra · by Althexus</span>
          <h1 className="mt-4 max-w-xl text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            Learning paths that end in something you{' '}
            <span className="text-teal-600">ship</span>.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg">
            Cohort-style courses in engineering, data and design — structured as a path with
            checkpoints, not a pile of videos. Every module ends with a review, not just a quiz.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/courses" className="btn-primary">
              Browse courses
              <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="btn-secondary">
              How the path works
            </Link>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-slate-100 pt-6 sm:max-w-md">
            <div>
              <dt className="font-mono text-xs uppercase tracking-wide text-slate-400">
                Learners
              </dt>
              <dd className="mt-1 font-display text-xl font-bold">19.6k</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wide text-slate-400">
                Avg. rating
              </dt>
              <dd className="mt-1 font-display text-xl font-bold">4.8/5</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wide text-slate-400">
                Completion
              </dt>
              <dd className="mt-1 font-display text-xl font-bold">86%</dd>
            </div>
          </dl>
        </div>

        {/* Signature element: a vertical learning-path timeline with progress state */}
        <div className="relative rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <p className="eyebrow mb-6">EDU-104 · React for Production Teams</p>
          <ol className="relative flex flex-col gap-6 pl-2">
            <div
              className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px bg-slate-200"
              aria-hidden="true"
            />
            {PATH_NODES.map((node, index) => (
              <li key={node.label} className="relative flex items-center gap-4">
                <span
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-semibold ${
                    node.state === 'done'
                      ? 'border-teal-500 bg-teal-500 text-white'
                      : node.state === 'active'
                        ? 'border-teal-500 bg-white text-teal-600'
                        : 'border-slate-200 bg-white text-slate-300'
                  }`}
                >
                  {node.state === 'done' ? <CircleCheck size={16} /> : index + 1}
                </span>
                <div>
                  <p
                    className={`font-display text-sm font-semibold ${
                      node.state === 'upcoming' ? 'text-slate-400' : 'text-ink'
                    }`}
                  >
                    {node.label}
                  </p>
                  {node.state === 'active' && (
                    <p className="text-xs text-teal-600">In progress — mentor review Thu</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
