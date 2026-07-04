import { useMutation, useQuery } from '@tanstack/react-query'
import api from './api'
import type { Device, Session, MfaSetupData, User } from './auth-types'

interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      api.post<AuthResponse>('/auth/verify-otp', { email, otp }).then(res => res.data),
  })
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (email: string) =>
      api.post('/auth/resend-otp', { email }),
  })
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) =>
      api.post('/auth/verify-email', { token }),
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) =>
      api.post('/auth/forgot-password', { email }),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      api.post('/auth/reset-password', { token, password }),
  })
}

export function useSetupMfa() {
  return useMutation({
    mutationFn: () =>
      api.get<MfaSetupData>('/auth/mfa/setup').then(res => res.data),
  })
}

export function useVerifyMfa() {
  return useMutation({
    mutationFn: (code: string) =>
      api.post('/auth/mfa/verify', { code }),
  })
}

export function useDisableMfa() {
  return useMutation({
    mutationFn: () => api.post('/auth/mfa/disable'),
  })
}

export function useDevices() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: () => api.get<Device[]>('/auth/devices').then(res => res.data),
  })
}

export function useRemoveDevice() {
  return useMutation({
    mutationFn: (deviceId: string) => api.delete(`/auth/devices/${deviceId}`),
  })
}

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => api.get<Session[]>('/auth/sessions').then(res => res.data),
  })
}

export function useEndSession() {
  return useMutation({
    mutationFn: (sessionId: string) => api.delete(`/auth/sessions/${sessionId}`),
  })
}

export function useEndAllSessions() {
  return useMutation({
    mutationFn: () => api.post('/auth/sessions/end-all'),
  })
}
