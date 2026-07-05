import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useLocation } from 'wouter'
import api from './api'
import type { User } from './auth-types'

interface LoginResponse {
  user: User
  token: string
  refreshToken: string
  mfaRequired?: boolean
  mfaToken?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
  completeLogin: (token: string, refreshToken: string, user: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)
  const [, navigate] = useLocation()

  useEffect(() => {
    if (token) {
      api.get<User>('/auth/me')
        .then(({ data }: { data: User }) => {
          setUser(data)
        })
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          setToken(null)
          setUser(null)
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [token])

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
    if (data.mfaRequired) {
      if (data.mfaToken) {
        sessionStorage.setItem('mfa_token', data.mfaToken)
      } else {
        // Fallback: store password for legacy OTP-based MFA (will be removed later)
        sessionStorage.setItem('mfa_password', password)
      }
      window.location.href = `/mfa/verify?email=${encodeURIComponent(email)}`
      return { id: 'mfa', name: 'mfa', email, role: 'mfa', isVerified: true, isMfaEnabled: true } as any
    }
    localStorage.setItem('token', data.token)
    localStorage.setItem('refreshToken', data.refreshToken)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/auth/register', { name, email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('refreshToken', data.refreshToken)
    setToken(data.token)
    setUser(data.user)
  }, [])

  const logout = useCallback(() => {
    api.post('/auth/logout').catch(() => {})
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setToken(null)
    setUser(null)
    navigate('/login')
  }, [navigate])

  const completeLogin = useCallback((token: string, refreshToken: string, user: User) => {
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
    setToken(token)
    setUser(user)
  }, [])

  const updateUser = useCallback((updated: User) => {
    setUser(updated)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateUser,
      completeLogin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
