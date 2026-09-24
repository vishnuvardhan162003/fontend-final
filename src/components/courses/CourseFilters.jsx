import { Search } from 'lucide-react'
import { CATEGORIES } from '../../constants/courses'

export default function CourseFilters({ category, onCategoryChange, query, onQueryChange }) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-6">
      <div className="relative w-full sm:max-w-xs">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search courses or instructors"
          className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-blue-600"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onCategoryChange(item)}
            className={`rounded-full border px-4 py-2 font-display text-xs font-semibold transition-colors ${
              category === item
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}