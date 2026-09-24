import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import SectionHeading from '../common/SectionHeading'
import { FAQS } from '../../constants/faqs'

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading eyebrow="FAQs" title="Questions learners ask us" align="center" />

        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={faq.question} className="card-surface overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-sm font-semibold">{faq.question}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <p className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-500">
                    {faq.answer}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
