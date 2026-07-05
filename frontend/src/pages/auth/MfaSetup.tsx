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
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
                <Smartphone className="h-8 w-8 text-gold" />
              </div>
              <p className="text-center text-sm text-white/60">
                Add an extra layer of security to your account by requiring a
                verification code from your mobile device in addition to your password.
              </p>
            </div>
            <button
              onClick={handleSetup}
              disabled={setupMfa.isPending}
              className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-dark px-4 py-3.5 text-sm font-bold text-white hover:from-gold-light hover:to-gold transition-all duration-300 shadow-lg shadow-gold/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <p className="text-center text-sm text-white/60">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>
            <div className="flex justify-center">
              <div className="rounded-xl border border-white/10 bg-white p-4">
                <img src={qrCode} alt="MFA QR Code" className="h-48 w-48" />
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-1">Manual Setup Code</p>
              <p className="text-sm font-mono text-white/80 break-all">{secret}</p>
            </div>

            <form onSubmit={handleSubmit(handleVerify)} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  {...register('code')}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 text-center text-lg tracking-widest focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-200"
                  placeholder="000000"
                />
                {errors.code && (
                  <p className="mt-1 text-xs text-error">{errors.code.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-dark px-4 py-3.5 text-sm font-bold text-white hover:from-gold-light hover:to-gold transition-all duration-300 shadow-lg shadow-gold/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <p className="text-center text-sm text-white/60">
              Two-factor authentication has been enabled for your account.
            </p>
            <Link href="/dashboard/founder" className="text-sm font-semibold text-gold-light hover:text-gold transition-colors">
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
