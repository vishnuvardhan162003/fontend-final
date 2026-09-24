import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { COURSES } from '../../constants/courses'
import CourseCard from '../courses/CourseCard'
import SectionHeading from '../common/SectionHeading'

const FEATURED_IDS = ['full-stack-web-development', 'ai-machine-learning', 'cybersecurity-soc-analyst']

export default function FeaturedCourses() {
  const featured = FEATURED_IDS.map((id) => COURSES.find((course) => course.id === id)).filter(Boolean)

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Popular paths"
            title="Start with a path, not a playlist"
            description="Each course is a structured sequence of modules with checkpoints — built the way project work actually happens."
          />
          <Link
            to="/courses"
            className="hidden shrink-0 items-center gap-1.5 font-display text-sm font-semibold text-navy hover:text-navy-700 sm:flex"
          >
            View all courses
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <Link
          to="/courses"
          className="mt-8 flex items-center justify-center gap-1.5 font-display text-sm font-semibold text-navy sm:hidden"
        >
          View all courses
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  )
}
