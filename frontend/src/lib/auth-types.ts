export interface User {
  id: string
  name: string
  email: string
  role: string
  isVerified: boolean
  isMfaEnabled: boolean
  avatar?: string
  phone?: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface OtpInput {
  email: string
  otp: string
}

export interface ForgotPasswordInput {
  email: string
}

export interface ResetPasswordInput {
  token: string
  password: string
  confirmPassword: string
}

export interface Device {
  id: string
  deviceName: string
  deviceType: string
  browser: string
  ip: string
  lastActive: string
  isCurrentDevice: boolean
}

export interface Session {
  id: string
  deviceName: string
  browser: string
  os: string
  ip: string
  lastActive: string
  isCurrentSession: boolean
}

export interface MfaSetupData {
  qrCode: string
  secret: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
