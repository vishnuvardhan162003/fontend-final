// Certificate API backed by the Node backend.
//   GET  /api/certificates/:id  (public) -> certificate | null
//   POST /api/certificates       { courseId } (auth) -> certificate
//   GET  /api/certificates/mine  (auth) -> certificate list
// Backend certificate shape uses `certificateId`; the UI uses `id` —
// normalize both directions so VerifyCertificate/CertificatePreview keep working.

import { API_BASE_URL, apiFetch } from './api'

export function normalizeCertificate(raw) {
  if (!raw) return null
  return {
    id: raw.certificateId || raw.id,
    certificateId: raw.certificateId || raw.id,
    studentName: raw.studentName || raw.student?.name || '',
    courseTitle: raw.courseTitle || raw.course?.title || '',
    issuedOn: raw.issuedOn || (raw.createdAt ? String(raw.createdAt).slice(0, 10) : ''),
    _raw: raw,
  }
}

export async function verifyCertificate(id) {
  if (!id?.trim()) return null
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/certificates/${encodeURIComponent(id.trim().toUpperCase())}`,
    )
    if (!res.ok) return null
    const data = await res.json()
    return normalizeCertificate(data)
  } catch {
    return null
  }
}

export async function issueCertificate({ courseId }) {
  const data = await apiFetch('/api/certificates', {
    method: 'POST',
    body: { courseId },
  })
  return normalizeCertificate(data)
}

export async function fetchMyCertificates() {
  try {
    const data = await apiFetch('/api/certificates/mine', { method: 'GET' })
    const list = Array.isArray(data) ? data : data?.certificates || []
    return list.map(normalizeCertificate).filter(Boolean)
  } catch {
    return []
  }
}
