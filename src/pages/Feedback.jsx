import { useState } from 'react'
import { Star, CircleCheck, MessageSquareText } from 'lucide-react'
import SectionHeading from '../components/common/SectionHeading'
import { COURSES } from '../constants/courses'
import { submitFeedback } from '../services/feedbackService'

const CATEGORIES = ['General', 'Course Feedback', 'Suggestion', 'Bug Report', 'Mentor / Support']
const ROLES = ['Student', 'Instructor', 'Visitor']

const initialForm = {
  name: '',
  email: '',
  role: 'Student',
  courseId: '',
  category: 'General',
  rating: 0,
  message: '',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value)
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5"
          >
            <Star
              size={26}
              className={filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
            />
          </button>
        )
      })}
    </div>
  )
}

export default function Feedback() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    // clear that field's error as soon as the user edits it
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validate = () => {
    const errors = {}

    if (!form.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!form.email.trim()) {
      errors.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.email = 'Please enter a valid email address'
    }

    if (!form.message.trim()) {
      errors.message = 'Message is required'
    }

    if (form.rating === 0) {
      errors.rating = 'Please select a star rating before submitting.'
    }

    return errors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const errors = validate()
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      // keep the general banner for the rating-specific case, same as before
      if (errors.rating) setError(errors.rating)
      return
    }

    setSubmitting(true)
    try {
      await submitFeedback(form)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm(initialForm)
    setSubmitted(false)
    setError('')
    setFieldErrors({})
  }

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-teal-500 ${
      fieldErrors[field] ? 'border-red-400 focus:border-red-400' : 'border-slate-200'
    }`

  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading
        eyebrow="Feedback"
        title="Tell us how we're doing"
        description="Course feedback, a bug you spotted, or an idea for the platform — a short note here reaches the Eduzyra team directly."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-5">
          <div className="card-surface flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy">
              <MessageSquareText size={18} />
            </span>
            <div>
              <p className="font-display text-sm font-semibold">Why we ask</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                Every submission is reviewed by a mentor or the course team — ratings shape what
                gets improved next, and bug reports go straight to engineering.
              </p>
            </div>
          </div>
          <div className="card-surface p-5">
            <p className="font-mono text-xs uppercase tracking-wide text-slate-400">
              Response time
            </p>
            <p className="mt-1 font-display text-sm font-semibold">Within 1–2 business days</p>
          </div>
        </div>

        <div className="card-surface p-6 sm:p-8">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-10 pb-6 text-center">
              <CircleCheck size={32} className="text-teal-500" />
              <p className="font-display text-lg font-semibold">Thanks for the feedback</p>
              <p className="max-w-sm text-sm text-slate-500">
                We've logged your {form.category.toLowerCase()} note
                {form.name ? `, ${form.name.split(' ')[0]}` : ''}. A mentor may follow up at{' '}
                {form.email} if we need more detail.
              </p>
              <button type="button" onClick={handleReset} className="btn-secondary mb-2 mt-2">
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block font-display text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={handleChange('name')}
                    className={inputClass('name')}
                    placeholder="Your full name"
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block font-display text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    className={inputClass('email')}
                    placeholder="you@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="role" className="mb-1.5 block font-display text-sm font-medium">
                    I am a
                  </label>
                  <select
                    id="role"
                    value={form.role}
                    onChange={handleChange('role')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="mb-1.5 block font-display text-sm font-medium"
                  >
                    Feedback type
                  </label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={handleChange('category')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="courseId" className="mb-1.5 block font-display text-sm font-medium">
                  Course{' '}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <select
                  id="courseId"
                  value={form.courseId}
                  onChange={handleChange('courseId')}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                >
                  <option value="">Not course-specific</option>
                  {COURSES.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="mb-1.5 block font-display text-sm font-medium">
                  Overall rating
                </span>
                <StarRating
                  value={form.rating}
                  onChange={(rating) => {
                    setForm((prev) => ({ ...prev, rating }))
                    setFieldErrors((prev) => {
                      if (!prev.rating) return prev
                      const next = { ...prev }
                      delete next.rating
                      return next
                    })
                  }}
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block font-display text-sm font-medium">
                  Your feedback
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange('message')}
                  className={`resize-none ${inputClass('message')}`}
                  placeholder="What went well, what didn't, or what you'd like to see"
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.message}</p>
                )}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="sticky bottom-0 -mx-6 -mb-6 mt-2 rounded-b-2xl border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur sm:-mx-8 sm:-mb-8 sm:px-8">
                <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                  {submitting ? 'Sending…' : 'Submit feedback'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
