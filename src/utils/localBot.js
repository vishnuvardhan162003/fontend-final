// Lightweight, fully client-side fallback for EduBot.
//
// EduBot normally talks to a separate FastAPI backend (see services/chatbotService.js).
// That backend isn't always available in every environment (e.g. it isn't bundled with
// this frontend), which previously meant every single question landed on a hard
// "Sorry, I couldn't connect right now" message. This module answers common questions
// directly from the course catalog already shipped in the app, so EduBot stays useful
// even with no backend configured. It is intentionally simple (keyword matching, not AI) —
// it is a safety net, not a replacement for the real backend.

import { CATEGORIES, COURSES } from '../constants/courses'

const GREETINGS = ['hi', 'hii', 'hiii', 'hello', 'hey', 'yo', 'hola']

function normalize(text) {
  return text.toLowerCase().trim()
}

function formatCourseLine(course) {
  return `• ${course.title} (${course.category}) — ${course.duration}, ₹${course.price}`
}

function findMatchingCourses(query) {
  const words = normalize(query)
    .split(/[^a-z0-9+]+/)
    .filter((word) => word.length > 2)

  if (words.length === 0) return []

  return COURSES.filter((course) => {
    const haystack = normalize(
      [course.title, course.category, course.instructor, course.summary].join(' '),
    )
    return words.some((word) => haystack.includes(word))
  }).slice(0, 5)
}

export function getLocalBotReply(message) {
  const text = normalize(message)

  if (!text) {
    return "I didn't quite catch that — could you type your question?"
  }

  if (GREETINGS.includes(text) || GREETINGS.some((g) => text === `${g}!`)) {
    return "Hi there! 👋 Ask me about a course, a category, pricing, or duration — for example, \"What web development courses do you have?\""
  }

  if (/\bprice|cost|fee|₹|how much\b/.test(text)) {
    return 'Most Eduzyra courses are ₹999 (discounted from the listed price). Open any course page for its exact price, or tell me a course name and I can point you to it.'
  }

  if (/\bduration|how long|weeks|days\b/.test(text)) {
    return 'Course duration is usually 60 or 90 days, depending on depth. Tell me a course or category and I can narrow it down.'
  }

  if (/\bcategor(y|ies)|track(s)?\b/.test(text)) {
    return `Here are our course categories:\n${CATEGORIES.filter((c) => c !== 'All')
      .map((c) => `• ${c}`)
      .join('\n')}`
  }

  if (/\bcertificat/.test(text)) {
    return 'Yes — every course path ends with a certificate on completion, alongside mentor review and career support.'
  }

  const matches = findMatchingCourses(message)
  if (matches.length > 0) {
    return `Here's what I found:\n${matches.map(formatCourseLine).join('\n')}\n\nWant details on any of these? Open the course page from Courses in the top nav.`
  }

  return "I couldn't find a course that matches that yet, but you can browse the full catalog under \"Courses\", or ask me about a specific category like Web Development, Data Science, or Cloud & DevOps."
}
