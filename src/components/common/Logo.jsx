import { Link } from 'react-router-dom'
import logoMark from '../../assets/logo.jpeg'

const SIZES = {
  md: {
    mark: 'h-11 w-11 rounded-xl',
    wordmark: 'text-xl',
    sub: 'text-[10px] tracking-[0.18em]',
    gap: 'gap-3',
  },
  lg: {
    mark: 'h-14 w-14 rounded-2xl',
    wordmark: 'text-2xl',
    sub: 'text-[11px] tracking-[0.2em]',
    gap: 'gap-3.5',
  },
}

export default function Logo({ variant = 'dark', size = 'md' }) {
  const textColor = variant === 'light' ? 'text-white' : 'text-ink'
  const subColor = variant === 'light' ? 'text-white/55' : 'text-slate-500'
  const s = SIZES[size] ?? SIZES.md

  return (
    <Link to="/" className={`group flex items-center ${s.gap}`}>
      <span
        className={`relative flex shrink-0 items-center justify-center overflow-hidden ${s.mark} bg-white shadow-sm ring-1 ring-slate-200 transition-transform duration-200 group-hover:-translate-y-0.5`}
      >
        <img src={logoMark} alt="Althexus logo" className="h-full w-full object-contain p-1" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display font-extrabold tracking-tight ${s.wordmark} ${textColor}`}>
          Eduzyra
        </span>
        <span className={`mt-1 font-mono uppercase ${s.sub} ${subColor}`}>by Althexus</span>
      </span>
    </Link>
  )
}
