import { BadgeCheck } from 'lucide-react'

export default function CertificatePreview({ certificate }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-4 border-navy-100 bg-white p-10 text-center shadow-sm">
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-navy via-teal-500 to-amber-400" />
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
        Eduzyra by Althexus
      </p>
      <BadgeCheck size={36} className="mx-auto mt-4 text-teal-500" />
      <p className="mt-4 text-sm text-slate-500">This certifies that</p>
      <h2 className="mt-2 font-display text-3xl font-bold text-ink">{certificate.studentName}</h2>
      <p className="mt-4 text-sm text-slate-500">has successfully completed the course</p>
      <p className="mt-2 font-display text-xl font-semibold text-navy">{certificate.courseTitle}</p>

      <div className="mt-8 flex items-center justify-center gap-10 border-t border-slate-100 pt-6 text-xs text-slate-400">
        <div>
          <p className="uppercase tracking-wide">Issued on</p>
          <p className="mt-1 font-display text-sm font-semibold text-ink">{certificate.issuedOn}</p>
        </div>
        <div>
          <p className="uppercase tracking-wide">Certificate ID</p>
          <p className="mt-1 font-mono text-sm font-semibold text-ink">{certificate.id}</p>
        </div>
      </div>
    </div>
  )
}
