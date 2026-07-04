import { useEffect, useState } from 'react'
import { useLocation, Link } from 'wouter'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useVerifyEmail } from '../../lib/auth-hooks'

export default function VerifyEmail() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [, navigate] = useLocation()
  const verifyEmail = useVerifyEmail()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (!token) {
      setStatus('error')
      return
    }

    verifyEmail.mutateAsync(token)
      .then(() => {
        setStatus('success')
        setTimeout(() => navigate('/login'), 3000)
      })
      .catch(() => {
        setStatus('error')
      })
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
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-gold" />
            <p className="text-white/60 text-sm">Verifying your email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Email Verified!</h1>
            <p className="text-white/60 text-sm">Your email has been successfully verified. Redirecting to login...</p>
            <Link href="/login" className="mt-4 text-sm font-semibold text-gold-light hover:text-gold transition-colors">
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/20">
              <XCircle className="h-8 w-8 text-error" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Verification Failed</h1>
            <p className="text-white/60 text-sm">The verification link is invalid or has expired.</p>
            <Link href="/login" className="mt-4 text-sm font-semibold text-gold-light hover:text-gold transition-colors">
              Back to Login
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  )
}
