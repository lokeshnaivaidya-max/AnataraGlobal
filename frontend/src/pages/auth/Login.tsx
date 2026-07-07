import { useState } from 'react'
import { useLocation, Link } from 'wouter'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import SocialLoginButtons from '../../components/auth/SocialLoginButtons'
import { useAuth } from '../../lib/auth-context'
import { loginSchema, type LoginFormData } from '../../lib/validations'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const { login } = useAuth()
  const [, navigate] = useLocation()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError('')
    try {
      const user = await login(data.email, data.password)
      if (!user.isVerified) {
        navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`)
      } else {
        navigate('/dashboard/founder')
      }
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } }
      setServerError(apiError?.response?.data?.message || 'Invalid email or password. Please try again.')
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your Antara Global account"
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
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
            Email Address
          </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email', {
                onBlur: (e) => {
                  e.target.style.borderColor = 'rgba(0,0,0,0.12)'
                },
              })}
              className="w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 placeholder:text-black/35"
              style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)', color: '#000000' }}
              placeholder="you@example.com"
              onFocus={(e) => e.target.style.borderColor = '#FD7C06'}
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
              autoComplete="current-password"
              {...register('password', {
                onBlur: (e) => {
                  e.target.style.borderColor = 'rgba(0,0,0,0.12)'
                },
              })}
            className="w-full rounded-xl border px-4 py-3 pr-11 text-sm transition-all duration-200 placeholder:text-black/35"
            style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)', color: '#000000' }}
            placeholder="Enter your password"
            onFocus={(e) => e.target.style.borderColor = '#FD7C06'}
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

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold transition-colors"
            style={{ color: '#FD7C06' }}
          >
            Forgot password?
          </Link>
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
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6">
        <SocialLoginButtons />
      </div>

      <p className="mt-6 text-center text-sm" style={{ color: 'rgba(0,0,0,0.5)' }}>
        Don't have an account?{' '}
        <Link href="/register" className="font-semibold transition-colors" style={{ color: '#FD7C06' }}>
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}
