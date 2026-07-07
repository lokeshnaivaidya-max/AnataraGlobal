import { useState } from 'react'
import { useLocation, Link } from 'wouter'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import { resetPasswordSchema, type ResetPasswordFormData } from '../../lib/validations'
import { useResetPassword } from '../../lib/auth-hooks'

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [, navigate] = useLocation()
  const resetPassword = useResetPassword()

  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setServerError('Invalid or missing reset token.')
      return
    }
    setServerError('')
    try {
      await resetPassword.mutateAsync({ token, password: data.password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } }
      setServerError(apiError?.response?.data?.message || 'Failed to reset password. The link may have expired.')
    }
  }

  if (!token) {
    return (
      <AuthLayout title="Invalid Link" subtitle="This password reset link is invalid or has expired.">
        <Link href="/forgot-password" className="block text-center text-sm font-semibold text-gold-light hover:text-gold transition-colors">
          Request a new reset link
        </Link>
      </AuthLayout>
    )
  }

  if (success) {
    return (
      <AuthLayout title="Password Reset!" subtitle="Your password has been successfully updated.">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <p className="text-center text-sm text-black/60">Redirecting you to login...</p>
          <Link href="/login" className="text-sm font-semibold text-gold-light hover:text-gold transition-colors">
            Go to Login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your new password"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error font-medium"
          >
            {serverError}
          </motion.div>
        )}

        <div>
          <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('password')}
              className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 pr-11 text-sm text-black placeholder:text-black/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-200"
              placeholder="Min. 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-error">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('confirmPassword')}
              className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 pr-11 text-sm text-black placeholder:text-black/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-200"
              placeholder="Repeat your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70 transition-colors"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-dark px-4 py-3.5 text-sm font-bold text-white hover:from-gold-light hover:to-gold transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </AuthLayout>
  )
}
