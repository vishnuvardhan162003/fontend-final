import { useEffect, useMemo, useState } from 'react'
import { Video, Pencil, Trash2, Plus, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import {
  listLiveSessions,
  createLiveSession,
  updateLiveSession,
  deleteLiveSession,
  joinLiveSession,
  formatSessionTime,
  isValidMeetLink,
} from '../../services/liveSessionService'

const STATUS_STYLES = {
  UPCOMING: 'bg-blue-50 text-blue-700',
  LIVE: 'bg-red-50 text-red-700',
  ENDED: 'bg-slate-100 text-slate-500',
  CANCELLED: 'bg-amber-50 text-amber-700',
}

function toLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const EMPTY_FORM = { title: '', description: '', meetingUrl: '', meetingProvider: 'GOOGLE_MEET', start: '', end: '' }

export default function LiveSessionsSection({ courseId }) {
  const { user, role, isEnrolledIn, isAuthenticated } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [joiningId, setJoiningId] = useState(null)

  const enrolled = isEnrolledIn?.(courseId)
  const canManage = isAuthenticated && (role === 'admin' || role === 'instructor')
  const canView = isAuthenticated && (canManage || enrolled)

  const load = async () => {
    if (!canView) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await listLiveSessions(courseId)
      setSessions(Array.isArray(data) ? data : [])
    } catch (err) {
      if (err?.status === 403) setError('You must be enrolled in this course to view live sessions.')
      else if (err?.status === 401) setError('Please log in to view live sessions.')
      else setError(err?.message || 'Failed to load live sessions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, canView])

  const { upcoming, past } = useMemo(() => {
    const up = sessions.filter((s) => ['UPCOMING', 'LIVE'].includes(s.status))
    const pa = sessions.filter((s) => ['ENDED', 'CANCELLED'].includes(s.status))
    return { upcoming: up, past: pa }
  }, [sessions])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setShowForm(true)
  }

  const openEdit = (s) => {
    setEditing(s)
    setForm({
      title: s.title || '',
      description: s.description || '',
      meetingUrl: s.meetingUrl || '',
      meetingProvider: s.meetingProvider || 'GOOGLE_MEET',
      start: toLocalInput(s.scheduledStartAt),
      end: toLocalInput(s.scheduledEndAt),
    })
    setFormError('')
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.title.trim()) return setFormError('Title is required.')
    if (!form.meetingUrl.trim()) return setFormError('Google Meet link is required.')
    if (!isValidMeetLink(form.meetingUrl.trim(), form.meetingProvider)) {
      return setFormError('Google Meet link must look like https://meet.google.com/xxx-xxxx-xxx')
    }
    if (!form.start) return setFormError('Start time is required.')
    const startIso = new Date(form.start).toISOString()
    const endIso = form.end ? new Date(form.end).toISOString() : undefined
    if (endIso && new Date(endIso) <= new Date(startIso)) {
      return setFormError('End time must be after start time.')
    }
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        meetingProvider: form.meetingProvider,
        meetingUrl: form.meetingUrl.trim(),
        scheduledStartAt: startIso,
        ...(endIso ? { scheduledEndAt: endIso } : {}),
      }
      if (editing) await updateLiveSession(editing.id, payload)
      else await createLiveSession(courseId, payload)
      setShowForm(false)
      await load()
    } catch (err) {
      setFormError(err?.message || 'Failed to save live session.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete "${s.title}"? Students will no longer see it.`)) return
    try {
      await deleteLiveSession(s.id)
      await load()
    } catch (err) {
      alert(err?.message || 'Failed to delete live session.')
    }
  }

  const handleCancel = async (s) => {
    if (!window.confirm(`Cancel "${s.title}"? It will show as Cancelled to students.`)) return
    try {
      await updateLiveSession(s.id, { status: 'CANCELLED' })
      await load()
    } catch (err) {
      alert(err?.message || 'Failed to cancel live session.')
    }
  }

  const handleJoin = async (s) => {
    setJoiningId(s.id)
    try {
      await joinLiveSession(s.id)
    } catch (err) {
      alert(err?.message || 'Could not join this session.')
    } finally {
      setJoiningId(null)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="card-surface p-6 text-center text-sm text-slate-500">
        <Video size={20} className="mx-auto mb-2 text-slate-400" />
        Log in and enroll to view live sessions for this course.
      </div>
    )
  }

  if (!canView) {
    return (
      <div className="card-surface p-6 text-center text-sm text-slate-500">
        <Video size={20} className="mx-auto mb-2 text-slate-400" />
        Live sessions are only visible to enrolled students.
      </div>
    )
  }

  const renderCard = (s) => {
    const joinable = ['UPCOMING', 'LIVE'].includes(s.status)
    return (
      <article key={s.id} className="card-surface flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-bold leading-snug">{s.title}</h3>
          <span className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold ${STATUS_STYLES[s.status] || STATUS_STYLES.UPCOMING}`}>
            {s.status === 'LIVE' ? '● LIVE' : s.status}
          </span>
        </div>
        {s.description && <p className="text-sm leading-relaxed text-slate-500">{s.description}</p>}
        <p className="text-xs text-slate-500">
          {formatSessionTime(s.scheduledStartAt)}
          {s.scheduledEndAt ? ` – ${formatSessionTime(s.scheduledEndAt)}` : ''} · local time
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          {joinable ? (
            <button type="button" onClick={() => handleJoin(s)} disabled={joiningId === s.id} className="btn-primary !px-5 !py-2 text-xs">
              {joiningId === s.id ? 'Joining…' : 'Join Live'}
            </button>
          ) : s.status === 'CANCELLED' ? (
            <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">Cancelled</span>
          ) : (
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400">Ended</span>
          )}
          {canManage && (
            <div className="ml-auto flex items-center gap-1">
              <button type="button" onClick={() => openEdit(s)} aria-label={`Edit ${s.title}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <Pencil size={16} />
              </button>
              {s.status !== 'CANCELLED' && s.status !== 'ENDED' && (
                <button type="button" onClick={() => handleCancel(s)} className="rounded-lg px-2 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50">
                  Cancel
                </button>
              )}
              <button type="button" onClick={() => handleDelete(s)} aria-label={`Delete ${s.title}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </article>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold">Live Projects</h2>
        {canManage && (
          <button type="button" onClick={openCreate} className="btn-primary !px-5 !py-2.5 text-xs">
            <Plus size={15} /> Create Live Session
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-slate-500">Loading live sessions…</p>}
      {!loading && error && <p className="card-surface p-5 text-sm text-red-600">{error}</p>}

      {!loading && !error && sessions.length === 0 && (
        <div className="card-surface p-8 text-center">
          <Video size={22} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm text-slate-500">No live sessions scheduled yet.</p>
        </div>
      )}

      {!loading && !error && sessions.length > 0 && (
        <>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Upcoming & live ({upcoming.length})</h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-slate-400">No upcoming sessions.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">{upcoming.map(renderCard)}</div>
            )}
          </div>
          {past.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Past ({past.length})</h3>
              <div className="grid gap-4 sm:grid-cols-2">{past.map(renderCard)}</div>
            </div>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal="true">
          <form onSubmit={handleSave} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">{editing ? 'Edit live session' : 'Create live session'}</h3>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold">Title *</span>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} required
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-500" placeholder="Week 5: Live project review" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold">Description</span>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} maxLength={5000}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-500" placeholder="What will be covered…" />
              </label>
              <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold">Provider</span>
                  <select value={form.meetingProvider} onChange={(e) => setForm({ ...form, meetingProvider: e.target.value })}
                    className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500">
                    <option value="GOOGLE_MEET">Google Meet</option>
                    <option value="ZOOM">Zoom</option>
                    <option value="OTHER">Other</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold">Meeting link *</span>
                  <input value={form.meetingUrl} onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })} inputMode="url" required
                    className="rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-500" placeholder="https://meet.google.com/xxx-xxxx-xxx" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold">Starts at *</span>
                  <input type="datetime-local" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} required
                    className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold">Ends at</span>
                  <input type="datetime-local" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })}
                    className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500" />
                </label>
              </div>
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary !px-5 !py-2.5 text-xs">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary !px-5 !py-2.5 text-xs">{saving ? 'Saving…' : editing ? 'Save changes' : 'Create session'}</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
