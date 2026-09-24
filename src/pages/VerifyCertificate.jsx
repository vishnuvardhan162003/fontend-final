import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShieldCheck, Search, CircleX } from 'lucide-react'
import { verifyCertificate } from '../services/certificateService'
import SectionHeading from '../components/common/SectionHeading'
import CertificatePreview from '../components/certificate/CertificatePreview'
import Spinner from '../components/common/Spinner'

export default function VerifyCertificate() {
  const [searchParams] = useSearchParams()
  const [id, setId] = useState(searchParams.get('id') ?? '')
  const [result, setResult] = useState(undefined) // undefined = not searched, null = not found
  const [loading, setLoading] = useState(false)

  const handleVerify = async (event) => {
    event.preventDefault()
    if (!id.trim()) return
    setLoading(true)
    const found = await verifyCertificate(id)
    setResult(found)
    setLoading(false)
  }

  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading
        eyebrow="Certificate verification"
        title="Verify an Eduzyra certificate"
        description="Enter a certificate ID (e.g. EDU-2026-00001) to confirm it was issued by Eduzyra by Althexus."
        align="center"
      />

      <form onSubmit={handleVerify} className="mx-auto mt-8 flex max-w-md gap-2">
        <input
          value={id}
          onChange={(event) => setId(event.target.value)}
          placeholder="EDU-2026-00001"
          className="w-full rounded-full border border-slate-200 px-5 py-3 text-sm outline-none focus:border-teal-500"
        />
        <button type="submit" className="btn-primary shrink-0 !px-5">
          <Search size={16} />
          Verify
        </button>
      </form>

      <div className="mx-auto mt-10 max-w-xl">
        {loading && <Spinner label="Checking certificate registry" />}

        {!loading && result === null && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-6 text-center">
            <CircleX size={24} className="text-red-500" />
            <p className="font-display text-sm font-semibold text-red-700">
              No certificate found for this ID
            </p>
          </div>
        )}

        {!loading && result && (
          <div>
            <div className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-teal-600">
              <ShieldCheck size={16} />
              Verified — this is a genuine Eduzyra certificate
            </div>
            <CertificatePreview certificate={result} />
          </div>
        )}
      </div>
    </div>
  )
}
