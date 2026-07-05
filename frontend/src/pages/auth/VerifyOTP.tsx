import { useState, useRef, type KeyboardEvent } from 'react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import { useAuth } from '../../lib/auth-context'
import { useVerifyOtp, useResendOtp } from '../../lib/auth-hooks'
import type { AuthResponse } from '../../lib/auth-types'

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [, navigate] = useLocation()
  const { user, updateUser } = useAuth()

  const params = new URLSearchParams(window.location.search)
  const email = params.get('email') || user?.email || ''

  const verifyOtp = useVerifyOtp()
  const resendOtp = useResendOtp()

  const otpString = otp.join('')

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async () => {
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }
    setError('')
    try {
      const data = await verifyOtp.mutateAsync({ email, otp: otpString }) as unknown as AuthResponse
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
      updateUser(data.user)
      navigate('/dashboard/founder')
    } catch (err: unknown) {
      const apiError = err as { message?: string; response?: { data?: { message?: string } } }
      const errMsg = apiError?.response?.data?.message || apiError?.message || 'Invalid OTP. Please try again.'
      setError(errMsg)
    }
  }

  const handleResend = async () => {
    setError('')
    setSuccess('')
    try {
      await resendOtp.mutateAsync(email)
      setSuccess('A new OTP has been sent to your email.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err: unknown) {
      const apiError = err as { message?: string; response?: { data?: { message?: string } } }
      const errMsg = apiError?.response?.data?.message || apiError?.message || 'Failed to resend OTP.'
      setError(errMsg)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i]
    }
    setOtp(newOtp)
    const nextIndex = pasted.length < 6 ? pasted.length : 5
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle={`Enter the 6-digit code sent to ${email || 'your email'}`}
    >
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

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success font-medium"
          >
            {success}
          </motion.div>
        )}

        <label htmlFor="otp-0" className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-3 text-center">
          One-Time Verification Code
        </label>
        <div className="flex justify-center gap-3" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              ref={el => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className="h-14 w-12 rounded-xl border border-white/10 bg-white/5 text-center text-xl font-bold text-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-200"
              autoFocus={index === 0}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={verifyOtp.isPending || otpString.length !== 6}
          className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-dark px-4 py-3.5 text-sm font-bold text-white hover:from-gold-light hover:to-gold transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {verifyOtp.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </button>

        <p className="text-center text-sm text-white/50">
          Didn't receive the code?{' '}
          <button
            onClick={handleResend}
            disabled={resendOtp.isPending}
            className="font-semibold text-gold-light hover:text-gold transition-colors disabled:opacity-50"
          >
            {resendOtp.isPending ? 'Sending...' : 'Resend code'}
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}
