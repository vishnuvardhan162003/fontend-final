import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CtaBand() {
  return (
    <section className="bg-navy-900 py-16 sm:py-20">
      <div className="container-page flex flex-col items-center gap-6 text-center">
        <span className="eyebrow !text-teal-300">Next cohort opens soon</span>
        <h2 className="max-w-xl text-3xl font-bold text-white sm:text-4xl">
          Your next path starts with one enrollment.
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-white/60">
          Seats are limited per cohort so mentor reviews stay meaningful. Reserve yours today.
        </p>
        <Link to="/courses" className="btn-accent">
          Browse courses
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
