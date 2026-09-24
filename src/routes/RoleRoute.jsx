import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../components/common/Spinner'

// Restricts a route to one or more roles (e.g. 'instructor', 'admin').
// Unauthenticated users go to /login; wrong-role users go to /dashboard.
export default function RoleRoute({ allow = [], children }) {
  const { isAuthenticated, role, initializing } = useAuth()

  if (initializing) {
    return <Spinner label="Checking session" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!allow.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
