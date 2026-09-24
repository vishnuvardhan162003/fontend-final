import { LayoutGrid, Users, BookOpen, CreditCard, Tag, Award, MessageSquareText } from 'lucide-react'

export const ADMIN_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'coupons', label: 'Coupons', icon: Tag },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'feedback', label: 'Feedback', icon: MessageSquareText },
]

export default function AdminSidebar({ active, onChange }) {
  return (
    <nav className="card-surface flex gap-1 overflow-x-auto p-2 lg:flex-col lg:overflow-visible">
      {ADMIN_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-display text-sm font-medium transition-colors ${
            active === tab.id ? 'bg-navy text-white' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <tab.icon size={16} />
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
