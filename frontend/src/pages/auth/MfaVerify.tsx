import { useState } from 'react'
import { useLocation } from 'wouter'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Loader2, Shield } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import { mfaVerifySchema, type MfaVerifyFormData } from '../../lib/validations'

export default function MfaVerify() {
  const [error, setError] = useState('')
  const [, navigate] = useLocation()

  const params = new URLSearchParams(window.location.search)
  const email = params.get('email') || ''
  const mfaToken = params.get('mfaToken') || sessionStorage.getItem('mfa_token') || ''
  const password = sessionStorage.getItem('mfa_password') || ''

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MfaVerifyFormData>({
    resolver: zodResolver(mfaVerifySchema),
  })

  const onSubmit = async (data: MfaVerifyFormData) => {
    if (!email || (!password && !mfaToken)) {
      navigate('/login')
      return
    }
    setError('')
    try {
      const payload: Record<string, string> = { email, code: data.code }
      if (mfaToken) {
        payload.mfaToken = mfaToken
      } else {
        payload.password = password
      }
      await fetch(`${import.meta.env.VITE_API_URL || '/api'}/auth/mfa/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(async res => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || 'Invalid code')
        localStorage.setItem('token', json.token)
        localStorage.setItem('refreshToken', json.refreshToken)
        sessionStorage.removeItem('mfa_token')
        sessionStorage.removeItem('mfa_password')
        return json
      }).then(() => {
        navigate('/dashboard/founder')
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid verification code.'
      setError(msg)
    }
  }

  return (
    <AuthLayout
      title="Two-Factor Authentication"
      subtitle="Enter the code from your authenticator app"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error font-medium"
          >
            {error}
          </motion.div>
        )}

        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(253, 124, 6, 0.1)' }}>
            <Shield className="h-8 w-8" style={{ color: '#FD7C06' }} />
          </div>
          <p className="text-center text-sm text-black/60">
            Open your authenticator app and enter the 6-digit code.
          </p>
        </div>

        <div>
          <label htmlFor="code" className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
            Authentication Code
          </label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            {...register('code')}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black placeholder:text-black/30 text-center text-lg tracking-widest focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-200"
            placeholder="000000"
            onFocus={(e) => e.target.style.borderColor = '#FD7C06'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
          />
          {errors.code && (
            <p className="mt-1 text-xs text-error">{errors.code.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl px-4 py-3.5 text-sm font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: '#CEA041' }}
          onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#FD7C06' }}
          onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#CEA041' }}
        >
          {isSubmitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</>
          ) : (
            'Verify Code'
          )}
        </button>
      </form>
    </AuthLayout>
  )
}
