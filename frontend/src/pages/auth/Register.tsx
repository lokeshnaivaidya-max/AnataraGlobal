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
      const apiError = err as { response?: { data?: { message?: string } } }
      setServerError(apiError?.response?.data?.message || 'Registration failed. Please try again.')
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
            className="rounded-xl border px-4 py-3 text-sm font-medium" style={{ backgroundColor: 'rgba(220,38,38,0.08)', borderColor: 'rgba(220,38,38,0.2)', color: '#DC2626' }}
          >
            {serverError}
          </motion.div>
        )}

        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
            Full Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register('name')}
            className="w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 placeholder:text-black/35"
            style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)', color: '#000000' }}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-xs" style={{ color: '#DC2626' }}>{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 placeholder:text-black/35"
            style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)', color: '#000000' }}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs" style={{ color: '#DC2626' }}>{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('password')}
              className="w-full rounded-xl border px-4 py-3 pr-11 text-sm transition-all duration-200 placeholder:text-black/35"
              style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)', color: '#000000' }}
              placeholder="Min. 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'rgba(0,0,0,0.4)' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FD7C06'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.4)'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs" style={{ color: '#DC2626' }}>{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('confirmPassword', {
                onBlur: (e) => {
                  e.target.style.borderColor = 'rgba(0,0,0,0.12)'
                },
              })}
              className="w-full rounded-xl border px-4 py-3 pr-11 text-sm transition-all duration-200 focus:outline-none focus:ring-2 placeholder:text-black/35"
              style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)', color: '#000000' }}
              placeholder="Repeat your password"
              onFocus={(e) => { e.target.style.borderColor = '#FD7C06'; e.target.style.setProperty('--tw-ring-color', 'rgba(253,124,6,0.2)') }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'rgba(0,0,0,0.4)' }}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FD7C06'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.4)'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs" style={{ color: '#DC2626' }}>{errors.confirmPassword.message}</p>
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

      <p className="mt-6 text-center text-sm" style={{ color: 'rgba(0,0,0,0.5)' }}>
        Already have an account?{' '}
        <Link href="/login" className="font-semibold transition-colors" style={{ color: '#FD7C06' }}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
