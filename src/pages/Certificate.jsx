import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Download, ShieldCheck } from 'lucide-react'
import { verifyCertificate } from '../services/certificateService'
import CertificatePreview from '../components/certificate/CertificatePreview'
import Spinner from '../components/common/Spinner'

export default function Certificate() {
  const { certificateId } = useParams()
  const [certificate, setCertificate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    verifyCertificate(certificateId).then((result) => {
      setCertificate(result)
      setLoading(false)
    })
  }, [certificateId])

  if (loading) return <Spinner label="Loading certificate" />

  if (!certificate) {
    return (
      <div className="container-page py-24 text-center">
        <p className="font-display text-lg font-semibold">Certificate not found</p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-flex">Back to dashboard</Link>
      </div>
    )
  }

  return (
    <div className="container-page flex flex-col items-center py-12 sm:py-16">
      <div className="w-full max-w-2xl">
        <CertificatePreview certificate={certificate} />

        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="button" className="btn-primary">
              <Download size={16} />
              Download PDF
            </button>
            <Link to={`/verify-certificate?id=${certificate.id}`} className="btn-secondary">
              <ShieldCheck size={16} />
              View verification page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
