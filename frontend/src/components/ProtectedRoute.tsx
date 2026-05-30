import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { PageSpinner } from './ui/Spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) return <PageSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <>{children}</>
}
