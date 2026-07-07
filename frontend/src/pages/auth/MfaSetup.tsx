import { useState } from 'react'
import { Link } from 'wouter'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Loader2, ShieldCheck, Smartphone } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import ProtectedRoute from '../../components/auth/ProtectedRoute'
import { useSetupMfa, useVerifyMfa } from '../../lib/auth-hooks'
import type { MfaSetupData } from '../../lib/auth-types'
import { mfaVerifySchema, type MfaVerifyFormData } from '../../lib/validations'

function MfaSetupContent() {
  const [step, setStep] = useState<'intro' | 'qr' | 'verify' | 'done'>('intro')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')

  const setupMfa = useSetupMfa()
  const verifyMfa = useVerifyMfa()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MfaVerifyFormData>({
    resolver: zodResolver(mfaVerifySchema),
  })

  const handleSetup = async () => {
    setError('')
    try {
      const data = await setupMfa.mutateAsync() as MfaSetupData
      setQrCode(data.qrCode)
      setSecret(data.secret)
      setStep('qr')
    } catch {
      setError('Failed to setup MFA. Please try again.')
    }
  }

  const handleVerify = async (formData: MfaVerifyFormData) => {
    setError('')
    try {
      await verifyMfa.mutateAsync(formData.code)
      setStep('done')
    } catch {
      setError('Invalid code. Please try again.')
    }
  }

  return (
    <AuthLayout title="Two-Factor Authentication" subtitle="Enhance your account security">
      <div className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error font-medium"
          >
            {error}
          </motion.div>
        )}

        {step === 'intro' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(253, 124, 6, 0.1)' }}>
                <Smartphone className="h-8 w-8" style={{ color: '#FD7C06' }} />
              </div>
              <p className="text-center text-sm" style={{ color: 'rgba(0,0,0,0.6)' }}>
                Add an extra layer of security to your account by requiring a
                verification code from your mobile device in addition to your password.
              </p>
            </div>
            <button
              onClick={handleSetup}
              disabled={setupMfa.isPending}
              className="w-full rounded-xl px-4 py-3.5 text-sm font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: '#CEA041' }}
              onMouseEnter={(e) => { if (!setupMfa.isPending) e.currentTarget.style.backgroundColor = '#FD7C06' }}
              onMouseLeave={(e) => { if (!setupMfa.isPending) e.currentTarget.style.backgroundColor = '#CEA041' }}
            >
              {setupMfa.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Setting up...</>
              ) : (
                <><ShieldCheck className="h-4 w-4" /> Enable Two-Factor Auth</>
              )}
            </button>
          </div>
        )}

        {step === 'qr' && (
          <div className="space-y-5">
            <p className="text-center text-sm" style={{ color: 'rgba(0,0,0,0.6)' }}>
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>
            <div className="flex justify-center">
              <div className="rounded-xl border p-4 animate-fade-in" style={{ borderColor: 'rgba(0,0,0,0.12)', backgroundColor: '#FFFFFF' }}>
                <img src={qrCode} alt="MFA QR Code" className="h-48 w-48" />
              </div>
            </div>
            <div className="rounded-xl border px-4 py-3" style={{ backgroundColor: '#F9F8F6', borderColor: 'rgba(0,0,0,0.12)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(0,0,0,0.5)' }}>Manual Setup Code</p>
              <p className="text-sm font-mono break-all" style={{ color: 'rgba(0,0,0,0.8)' }}>{secret}</p>
            </div>

            <form onSubmit={handleSubmit(handleVerify)} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  {...register('code')}
                  className="w-full rounded-xl border px-4 py-3 text-sm text-center text-lg tracking-widest focus:outline-none transition-all duration-200 placeholder:text-black/35"
                  style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)', color: '#000000' }}
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
                  'Verify & Enable'
                )}
              </button>
            </form>
          </div>
        )}

        {step === 'done' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
              <ShieldCheck className="h-8 w-8 text-success" />
            </div>
            <p className="text-center text-sm animate-fade-in" style={{ color: 'rgba(0,0,0,0.6)' }}>
              Two-factor authentication has been enabled for your account.
            </p>
            <Link href="/dashboard/founder" className="text-sm font-semibold transition-colors" style={{ color: '#FD7C06' }}>
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default function MfaSetup() {
  return (
    <ProtectedRoute>
      <MfaSetupContent />
    </ProtectedRoute>
  )
}
