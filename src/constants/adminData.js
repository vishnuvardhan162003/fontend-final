// Mock data for the Admin and Instructor dashboards. Replace with real API
// calls (services/adminService.js, services/instructorService.js) once a
// backend and database are connected.

export const STUDENTS = [
  { id: 'stu_1', name: 'Priya Nambiar', email: 'priya@example.com', enrolledCourses: 3, joined: '2026-01-12' },
  { id: 'stu_2', name: 'Arjun Bhatt', email: 'arjun@example.com', enrolledCourses: 1, joined: '2026-02-03' },
  { id: 'stu_3', name: 'Meher Kapoor', email: 'meher@example.com', enrolledCourses: 2, joined: '2026-02-20' },
  { id: 'stu_4', name: 'Rahul Devan', email: 'rahul@example.com', enrolledCourses: 1, joined: '2026-03-05' },
  { id: 'stu_5', name: 'Ishita Sen', email: 'ishita@example.com', enrolledCourses: 4, joined: '2026-03-18' },
]

export const PAYMENTS = [
  { id: 'txn_10231', student: 'Priya Nambiar', course: 'React for Production Teams', amount: 3499, status: 'Successful', date: '2026-06-02' },
  { id: 'txn_10245', student: 'Arjun Bhatt', course: 'Applied Data Analysis with Python', amount: 2999, status: 'Successful', date: '2026-06-04' },
  { id: 'txn_10259', student: 'Meher Kapoor', course: 'Design Systems & UI Craft', amount: 3199, status: 'Pending', date: '2026-06-10' },
  { id: 'txn_10267', student: 'Rahul Devan', course: 'Backend Systems with Node.js', amount: 3799, status: 'Failed', date: '2026-06-14' },
  { id: 'txn_10281', student: 'Ishita Sen', course: 'Machine Learning Foundations', amount: 4299, status: 'Refunded', date: '2026-06-19' },
]

export const REVENUE_SUMMARY = {
  totalRevenue: 1284500,
  successfulPayments: 218,
  failedPayments: 14,
  pendingPayments: 6,
  refunds: 5,
}
