import { useEffect, useState } from 'react'
import { CircleCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [saved, setSaved] = useState(false)

  // Keep the field in sync if the logged-in user changes (e.g. after a
  // fresh login) so we never show a stale name from a previous session.
  useEffect(() => {
    setName(user?.name ?? '')
  }, [user?.email])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    updateProfile({ name: trimmed })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="container-page py-12 sm:py-16">
      <span className="eyebrow">Account</span>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Profile settings</h1>

      <form onSubmit={handleSubmit} className="card-surface mt-8 flex max-w-lg flex-col gap-4 p-6">
        <div>
          <label htmlFor="name" className="mb-1.5 block font-display text-sm font-medium">Full name</label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block font-display text-sm font-medium">Email address</label>
          <input
            id="email"
            value={user?.email ?? ''}
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400"
          />
        </div>
        <div>
          <label htmlFor="role" className="mb-1.5 block font-display text-sm font-medium">Account type</label>
          <input
            id="role"
            value={user?.role ?? ''}
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm capitalize text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary w-fit">Save changes</button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-teal-600">
              <CircleCheck size={16} />
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
