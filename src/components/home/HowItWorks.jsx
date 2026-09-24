import { ClipboardList, Code2, UsersRound, Rocket } from 'lucide-react'
import SectionHeading from '../common/SectionHeading'

const STEPS = [
  {
    icon: ClipboardList,
    title: 'Pick a path',
    description: 'Choose a course scoped around one real outcome — not a topic, an outcome.',
  },
  {
    icon: Code2,
    title: 'Build weekly',
    description: 'Ship a working piece of the project every week, guided by structured lessons.',
  },
  {
    icon: UsersRound,
    title: 'Get reviewed',
    description: 'A mentor reviews your work at each checkpoint — not just an auto-graded quiz.',
  },
  {
    icon: Rocket,
    title: 'Ship the capstone',
    description: 'Finish with a portfolio-ready project you can point to in interviews.',
  },
]

export default function HowItWorks() {
  return (
    <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="How it works"
          title="Every path follows the same four checkpoints"
          align="center"
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={step.title} className="relative flex flex-col gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy">
                <step.icon size={20} />
              </div>
              <span className="font-mono text-xs text-slate-400">
                Step {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-base font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
