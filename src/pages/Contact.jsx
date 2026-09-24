import { useState } from 'react'
import { Mail, Phone, MapPin, CircleCheck, Send } from 'lucide-react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const initialForm = { name: '', email: '', message: '' }

const Contact = () => {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = 'Please enter a valid email address'
    }
    if (!form.message.trim()) next.message = 'Message is required'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      setSubmitted(true)
      setForm(initialForm)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (field) =>
    `w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
      errors[field] ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-gray-300'
    }`

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-blue-50/60 py-6 md:py-8">
        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-blue-100/70 blur-2xl" />
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-blue-100/70 blur-2xl" />

        <div className="container-page relative max-w-4xl text-center">
          <h1 className="mb-3 text-3xl font-bold text-gray-900 md:text-5xl">
            Get in touch with us
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
            Have a question or need help? We would love to hear from you.
            Send us a message and our team will get back to you.
          </p>
        </div>

        <div className="pointer-events-none absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="h-10 w-full text-white" fill="currentColor">
            <path d="M0,32 C240,64 480,0 720,16 C960,32 1200,64 1440,32 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-6 md:py-8">
        <div className="container-page grid gap-10 md:grid-cols-2">

          {/* Contact Information */}
          <div>
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
              Contact Information
            </span>

            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              We're here to help
            </h2>

            <p className="mb-6 text-base leading-7 text-gray-600">
              If you have any questions about our courses, learning platform,
              or services, feel free to contact us.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Email Us</h3>
                  <p className="mt-0.5 text-gray-600">
                    eduzyraofficial@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Call Us</h3>
                  <p className="mt-0.5 text-gray-600">
                    +91 76687 43501
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Our Location</h3>
                  <p className="mt-0.5 text-gray-600">
                    Meerut, Uttar Pradesh
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl bg-gray-50 p-5 shadow-sm md:p-6 max-w-md w-full">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Send us a message
            </h2>

            {submitted ? (
              <div className="flex flex-col items-center gap-3 rounded-lg bg-green-50 py-8 text-center">
                <CircleCheck size={28} className="text-green-600" />
                <p className="font-semibold text-green-800 text-sm">Message sent successfully!</p>
                <p className="text-xs text-green-700">We'll get back to you soon.</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-medium text-gray-700 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleSubmit} noValidate>
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange('name')}
                    className={`bg-white ${inputClass('name')}`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange('email')}
                    className={`bg-white ${inputClass('email')}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    rows="3"
                    placeholder="Type your message here..."
                    value={form.message}
                    onChange={handleChange('message')}
                    className={`resize-none bg-white ${inputClass('message')}`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? 'Sending…' : (
                    <>
                      Send Message <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact