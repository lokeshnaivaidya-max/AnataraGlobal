import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function GoogleCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const role = params.get('role')
    const error = params.get('error')

    if (error || !token) {
      window.location.href = `/login?error=${error || 'no_token'}`
      return
    }

    // Save token (auth-context reads this on mount to call /auth/me)
    localStorage.setItem('token', token)

    // Navigate to the right dashboard
    const roleLower = (role || 'founder').toLowerCase()
    if (roleLower === 'msme') {
      window.location.href = '/dashboard/msme'
    } else if (roleLower === 'advisor') {
      window.location.href = '/dashboard/advisor'
    } else {
      window.location.href = '/dashboard/founder'
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-navy">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-gold" />
        <p className="text-white/70 text-sm font-medium">Signing you in with Google...</p>
      </div>
    </div>
  )
}
