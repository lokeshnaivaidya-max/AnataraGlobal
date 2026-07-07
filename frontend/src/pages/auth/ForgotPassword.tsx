import { useState } from 'react'
import { Link } from 'wouter'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, MailCheck } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../lib/validations'
import { useForgotPassword } from '../../lib/auth-hooks'

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const forgotPassword = useForgotPassword()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await forgotPassword.mutateAsync(data.email)
    setSent(true)
  }

  if (sent) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent a password reset link to your email"
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <MailCheck className="h-8 w-8 text-success" />
          </div>
          <p className="text-center text-sm text-black/60">
            If an account exists with that email, you'll receive a password reset link shortly.
          </p>
          <Link href="/login" className="mt-2 text-sm font-semibold text-gold-light hover:text-gold transition-colors">
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm text-black placeholder:text-black/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-200"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-error">{errors.email.message}</p>
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
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-black/50">
        Remember your password?{' '}
        <Link href="/login" className="font-semibold text-gold-light hover:text-gold transition-colors">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
