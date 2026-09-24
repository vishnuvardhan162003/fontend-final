import { useEffect, useState } from 'react'
import { fetchCourses } from '../services/courseService'

export function useCourses({ category, query }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetchCourses({ category, query }).then((results) => {
      if (!cancelled) {
        setCourses(results)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [category, query])

  return { courses, loading }
}
