import { useState } from 'react'
import { Search } from 'lucide-react'
import { verifyCertificate } from '../../services/certificateService'

export default function AdminCertificates() {
  const [id, setId] = useState('')
  const [result, setResult] = useState(undefined)

  const handleSearch = async (event) => {
    event.preventDefault()
    if (!id.trim()) return
    setResult(await verifyCertificate(id))
  }

  return (
    <div>
      <h3 className="mb-4 font-display text-sm font-semibold">Certificate records</h3>
      <form onSubmit={handleSearch} className="flex max-w-sm gap-2">
        <input
          value={id}
          onChange={(event) => setId(event.target.value)}
          placeholder="Search by certificate ID"
          className="w-full rounded-full border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500"
        />
        <button type="submit" className="btn-secondary shrink-0 !px-4">
          <Search size={14} />
        </button>
      </form>

      {result !== undefined && (
        <div className="mt-4 card-surface p-4 text-sm">
          {result ? (
            <>
              <p className="font-display font-semibold">{result.studentName}</p>
              <p className="text-slate-500">{result.courseTitle}</p>
              <p className="mt-1 font-mono text-xs text-slate-400">{result.id} · issued {result.issuedOn}</p>
            </>
          ) : (
            <p className="text-slate-400">No certificate found for that ID.</p>
          )}
        </div>
      )}

      <p className="mt-6 text-xs text-slate-400">
        Certificates are issued automatically when a student completes every lesson in a course.
      </p>
    </div>
  )
}
