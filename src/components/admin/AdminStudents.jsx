import { STUDENTS } from '../../constants/adminData'
import DataTable from './DataTable'

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'enrolledCourses', label: 'Courses' },
  { key: 'joined', label: 'Joined' },
]

export default function AdminStudents() {
  return (
    <div>
      <h3 className="mb-4 font-display text-sm font-semibold">All students ({STUDENTS.length})</h3>
      <DataTable columns={COLUMNS} rows={STUDENTS} />
    </div>
  )
}
