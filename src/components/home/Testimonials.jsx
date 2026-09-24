import { Star } from 'lucide-react'
import SectionHeading from '../common/SectionHeading'

const TESTIMONIALS = [
  {
    quote:
      'The weekly checkpoints kept me honest. By week 6 I had a real project, not a folder of exercises.',
    name: 'Priya Nambiar',
    role: 'Frontend Engineer, Fielddesk',
    course: 'React for Production Teams',
  },
  {
    quote:
      'Mentor reviews caught habits I did not know I had. That feedback loop is the whole value.',
    name: 'Arjun Bhatt',
    role: 'Data Analyst, Vertek',
    course: 'Applied Data Analysis with Python',
  },
  {
    quote:
      'I have taken other design courses before — this is the first one that ended with a system I actually reuse.',
    name: 'Meher Kapoor',
    role: 'Product Designer, Nimbus Labs',
    course: 'Design Systems & UI Craft',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="From the cohort"
          title="Learners who finished the path"
          align="center"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure key={item.name} className="card-surface flex flex-col gap-4 p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-slate-600">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-auto border-t border-slate-100 pt-4">
                <p className="font-display text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-slate-400">{item.role}</p>
                <p className="mt-1 font-mono text-[11px] text-teal-600">{item.course}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
