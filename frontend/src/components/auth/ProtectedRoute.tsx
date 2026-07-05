import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '../../lib/auth-context'

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode
  roles?: string[]
}) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [, navigate] = useLocation()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }
    if (user && !user.isVerified) {
      navigate(`/verify-otp?email=${encodeURIComponent(user.email)}`, { replace: true })
      return
    }
    if (roles && user && !roles.includes(user.role)) {
      navigate('/', { replace: true })
    }
  }, [isLoading, isAuthenticated, user, roles, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-navy">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="text-sm text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null
  if (roles && user && !roles.includes(user.role)) return null

  return <>{children}</>
}
