import { useState } from 'react'
import SectionHeading from '../components/common/SectionHeading'
import CourseFilters from '../components/courses/CourseFilters'
import CourseGrid from '../components/courses/CourseGrid'
import { useCourses } from '../hooks/useCourses'

export default function Courses() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const { courses, loading } = useCourses({ category, query })

  return (
    <div className="container-page pt-12 pb-20 sm:pt-16 sm:pb-24">
      <SectionHeading
        eyebrow="Course catalog"
        title="Find your next path"
        description="Every course is scoped around one shippable outcome, with weekly checkpoints and mentor review."
      />

      <div className="mt-8">
        <CourseFilters
          category={category}
          onCategoryChange={setCategory}
          query={query}
          onQueryChange={setQuery}
        />
      </div>

      <div className="mt-8">
        <CourseGrid courses={courses} loading={loading} />
      </div>
    </div>
  )
}
