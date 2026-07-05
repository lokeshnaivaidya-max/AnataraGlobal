import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import SocialLoginButtons from '../../components/auth/SocialLoginButtons'
import { useAuth } from '../../lib/auth-context'
import { registerSchema, type RegisterFormData } from '../../lib/validations'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState('')
  const { register: registerUser } = useAuth()
  const [, navigate] = useLocation()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('')
    try {
      await registerUser(data.name, data.email, data.password)
      navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`)
    } catch (err: unknown) {
      const apiError = err as { message?: string; response?: { data?: { message?: string } } }
      const errMsg = apiError?.response?.data?.message || apiError?.message || 'Registration failed. Please try again.'
      setServerError(errMsg)
    }
  }

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join Antara Global's ecosystem of founders, investors, and partners"
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
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register('name')}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-200"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-error">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-200"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-error">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('password')}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-200"
              placeholder="Min. 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-error">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('confirmPassword')}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-200"
              placeholder="Repeat your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
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
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6">
        <SocialLoginButtons />
      </div>

      <p className="mt-6 text-center text-sm text-white/50">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-gold-light hover:text-gold transition-colors">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
