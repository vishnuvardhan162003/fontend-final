import { useState } from 'react'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminOverview from '../components/admin/AdminOverview'
import AdminStudents from '../components/admin/AdminStudents'
import AdminCourses from '../components/admin/AdminCourses'
import AdminPayments from '../components/admin/AdminPayments'
import AdminCoupons from '../components/admin/AdminCoupons'
import AdminCertificates from '../components/admin/AdminCertificates'
import AdminFeedback from '../components/admin/AdminFeedback'

const PANELS = {
  overview: AdminOverview,
  students: AdminStudents,
  courses: AdminCourses,
  payments: AdminPayments,
  coupons: AdminCoupons,
  certificates: AdminCertificates,
  feedback: AdminFeedback,
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const ActivePanel = PANELS[tab]

  return (
    <div className="container-page py-10 sm:py-12">
      <span className="eyebrow">Admin</span>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Platform administration</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
        <AdminSidebar active={tab} onChange={setTab} />
        <ActivePanel />
      </div>
    </div>
  )
}
