export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'text-center items-center mx-auto' : 'text-left'

  return (
    <div className={`flex max-w-2xl flex-col gap-3 ${alignment}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
      {description && <p className="text-base leading-relaxed text-slate-500">{description}</p>}
    </div>
  )
}
