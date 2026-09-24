import { CreditCard, Landmark, Smartphone } from 'lucide-react'

const METHODS = [
  { id: 'card', label: 'Credit / Debit card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'netbanking', label: 'Net banking', icon: Landmark },
]

export default function PaymentMethodPicker({ selected, onSelect }) {
  return (
    <div>
      <p className="mb-2 font-display text-sm font-medium">Payment method</p>
      <div className="grid grid-cols-3 gap-2">
        {METHODS.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-xs font-semibold transition-colors ${
              selected === method.id
                ? 'border-navy bg-navy-50 text-navy'
                : 'border-slate-200 text-slate-500 hover:border-navy-200'
            }`}
          >
            <method.icon size={18} />
            {method.label}
          </button>
        ))}
      </div>
    </div>
  )
}
