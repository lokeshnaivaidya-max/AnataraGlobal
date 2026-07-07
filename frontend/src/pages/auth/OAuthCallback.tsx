import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../lib/auth-context'

export default function OAuthCallback() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [, navigate] = useLocation()
  const { updateUser } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const refreshToken = params.get('refreshToken')
    const error = params.get('error')

    if (error) {
      setStatus('error')
      setTimeout(() => navigate('/login'), 2000)
      return
    }

    if (token && refreshToken) {
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)

      fetch(`${import.meta.env.VITE_API_URL || '/api'}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch user profile')
          return res.json()
        })
        .then(user => {
          updateUser(user)
          setStatus('success')
          setTimeout(() => {
            if (!user.isVerified) {
              navigate(`/verify-otp?email=${encodeURIComponent(user.email)}`)
            } else {
              navigate('/dashboard/founder')
            }
          }, 1000)
        })
        .catch(() => {
          setStatus('error')
          setTimeout(() => navigate('/login'), 2000)
        })
    } else {
      setStatus('error')
      setTimeout(() => navigate('/login'), 2000)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-deep-navy via-deep-navy-dark to-deep-navy">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-gold/8 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-emerald/8 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mx-auto max-w-md px-4 text-center"
      >
        {status === 'processing' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-gold" />
            <p className="text-white/60 text-sm">Completing authentication...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Authenticated!</h1>
            <p className="text-white/60 text-sm">Redirecting to your dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/20">
              <XCircle className="h-8 w-8 text-error" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Authentication Failed</h1>
            <p className="text-white/60 text-sm">Something went wrong. Redirecting to login...</p>
          </div>
        )}
      </motion.div>
    </section>
  )
}
