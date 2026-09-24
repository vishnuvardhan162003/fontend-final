import { useState } from 'react'
import { CircleCheck } from 'lucide-react'

const SAMPLE_QUESTIONS = [
  {
    question: 'What is the primary goal of this module?',
    options: ['Memorize syntax', 'Build a working checkpoint', 'Watch more videos', 'Skip ahead'],
    correctIndex: 1,
  },
  {
    question: 'When should you ask your mentor for a review?',
    options: ['Never', 'Only at the end of the course', 'At each checkpoint', 'Before starting'],
    correctIndex: 2,
  },
]

export default function QuizLesson({ onComplete, isComplete }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const score = SAMPLE_QUESTIONS.filter((q, i) => answers[i] === q.correctIndex).length

  const handleSubmit = () => {
    setSubmitted(true)
    if (score === SAMPLE_QUESTIONS.length) onComplete()
  }

  return (
    <div className="flex flex-col gap-6">
      {SAMPLE_QUESTIONS.map((q, qIndex) => (
        <fieldset key={q.question} className="rounded-xl border border-slate-200 p-4">
          <legend className="px-1 font-display text-sm font-semibold">{q.question}</legend>
          <div className="mt-2 flex flex-col gap-2">
            {q.options.map((option, oIndex) => (
              <label
                key={option}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                <input
                  type="radio"
                  name={`q-${qIndex}`}
                  checked={answers[qIndex] === oIndex}
                  onChange={() => setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }))}
                  className="h-4 w-4 accent-navy"
                />
                {option}
              </label>
            ))}
          </div>
          {submitted && (
            <p
              className={`mt-2 text-xs font-semibold ${
                answers[qIndex] === q.correctIndex ? 'text-teal-600' : 'text-red-500'
              }`}
            >
              {answers[qIndex] === q.correctIndex ? 'Correct' : 'Not quite — review and retry'}
            </p>
          )}
        </fieldset>
      ))}

      <div className="flex items-center gap-3">
        <button type="button" onClick={handleSubmit} className="btn-primary w-fit">
          Submit quiz
        </button>
        {isComplete && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-teal-600">
            <CircleCheck size={16} />
            Passed
          </span>
        )}
        {submitted && score < SAMPLE_QUESTIONS.length && (
          <span className="text-sm text-slate-500">
            {score}/{SAMPLE_QUESTIONS.length} correct — try again
          </span>
        )}
      </div>
    </div>
  )
}
