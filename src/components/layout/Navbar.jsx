import { useState } from 'react'
import { Menu, X, LayoutDashboard, LogOut, ShieldCheck, GraduationCap } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo'
import { NAV_LINKS } from '../../constants/site'
import { useAuth } from '../../hooks/useAuth'

const ROLE_HOME = {
  student: { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  instructor: { to: '/instructor', label: 'Instructor', icon: GraduationCap },
  admin: { to: '/admin', label: 'Admin', icon: ShieldCheck },
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, role, logout } = useAuth()
  const navigate = useNavigate()
  const home = ROLE_HOME[role] ?? ROLE_HOME.student

  const linkClasses = ({ isActive }) =>
    `font-display text-sm font-medium transition-colors ${
      isActive ? 'text-navy' : 'text-slate-500 hover:text-navy'
    }`

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-50/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Logo size="lg" />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClasses} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <NavLink to={home.to} className="btn-secondary !px-4 !py-2 text-xs">
                <home.icon size={15} />
                {user?.name}
              </NavLink>
              <button onClick={handleLogout} className="btn-primary !px-4 !py-2 text-xs">
                <LogOut size={15} />
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-secondary !px-4 !py-2 text-xs">
                Log in
              </NavLink>
              <NavLink to="/signup" className="btn-primary !px-4 !py-2 text-xs">
                Get started
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-navy md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 font-display text-sm font-medium ${
                    isActive ? 'bg-navy-50 text-navy' : 'text-slate-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
              {isAuthenticated ? (
                <>
                  <NavLink to={home.to} onClick={() => setIsOpen(false)} className="btn-secondary">
                    <home.icon size={15} />
                    {home.label}
                  </NavLink>
                  <button onClick={handleLogout} className="btn-primary">
                    <LogOut size={15} />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setIsOpen(false)} className="btn-secondary">
                    Log in
                  </NavLink>
                  <NavLink to="/signup" onClick={() => setIsOpen(false)} className="btn-primary">
                    Get started
                  </NavLink>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
