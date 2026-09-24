import { COURSES, getCourseById as getStaticCourseById } from '../constants/courses'
import { API_BASE_URL } from './api'

// Backend shape (Mongoose Course) -> frontend card shape.
// Frontend components expect: id, code, title, category, level, instructor,
// duration, lessons, rating, students, price, originalPrice, summary, outcomes, syllabus, thumbnail
export function normalizeCourse(raw) {
  if (!raw) return null
  const id = raw.slug || String(raw._id || raw.id || '')
  return {
    id,
    code: raw.code || '',
    title: raw.title || '',
    category: raw.category || 'All',
    level: raw.level || 'Beginner',
    instructor: raw.instructorName || raw.instructor || '',
    duration: raw.duration || '',
    lessons: raw.lessons ?? 0,
    rating: raw.rating ?? 4.5,
    students: raw.students ?? raw.enrolledCount ?? 0,
    price: raw.price ?? 0,
    originalPrice: raw.originalPrice ?? raw.price ?? 0,
    summary: raw.summary || raw.description || '',
    outcomes: raw.outcomes || [],
    syllabus: raw.syllabus || [],
    thumbnail: raw.thumbnail || '',
    status: raw.status || 'published',
    _raw: raw,
  }
}

function staticFilter({ category = 'All', query = '' } = {}) {
  let results = COURSES
  if (category && category !== 'All') {
    results = results.filter((course) => course.category === category)
  }
  if (query.trim()) {
    const normalized = query.trim().toLowerCase()
    results = results.filter(
      (course) =>
        course.title.toLowerCase().includes(normalized) ||
        course.instructor.toLowerCase().includes(normalized) ||
        course.category.toLowerCase().includes(normalized),
    )
  }
  return results
}

// Tries the live backend first (GET /api/courses), falls back to the static
// catalog when the backend is unreachable so the UI never goes blank.
export async function fetchCourses({ category = 'All', query = '' } = {}) {
  try {
    const params = new URLSearchParams()
    if (category && category !== 'All') params.set('category', category)
    if (query.trim()) params.set('query', query.trim())
    params.set('limit', '100')
    const res = await fetch(`${API_BASE_URL}/api/courses?${params.toString()}`)
    if (!res.ok) throw new Error(`courses request failed (${res.status})`)
    const data = await res.json()
    const list = Array.isArray(data) ? data : data.courses || []
    return list.map(normalizeCourse).filter(Boolean)
  } catch {
    return staticFilter({ category, query })
  }
}

export async function fetchCourseById(id) {
  if (!id) return null
  try {
    const res = await fetch(`${API_BASE_URL}/api/courses/${encodeURIComponent(id)}`)
    if (!res.ok) throw new Error(`course request failed (${res.status})`)
    const data = await res.json()
    return normalizeCourse(data)
  } catch {
    return getStaticCourseById(id) ?? null
  }
}
