export interface PlatformStats {
  totalUsers: number
  totalFounders: number
  totalMsmes: number
  totalAdvisors: number
  totalSessions: number
  totalDocuments: number
  newUsersThisMonth: number
  activeUsers: number
  storageUsed: number
  recentActivity: ActivityLog[]
}

export interface ActivityLog {
  id: string
  action: string
  userId: string
  userName: string
  details: string
  createdAt: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'founder' | 'msme' | 'advisor'
  status: 'active' | 'suspended' | 'pending'
  registeredAt: string
  lastLoginAt?: string
  documentsCount: number
}

export interface PlatformSettings {
  platformName?: string
  platformDescription?: string
  supportEmail?: string
  maintenanceMode?: boolean
  allowNewRegistrations?: boolean
  maxDocumentSize?: number
  sessionDuration?: number
}

export const ADMIN_ROLES = ['admin', 'founder', 'msme', 'advisor'] as const
export const USER_STATUSES = ['active', 'suspended', 'pending'] as const

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  founder: 'Founder',
  msme: 'MSME',
  advisor: 'Advisor',
}

export const STATUS_COLORS: Record<string, string> = {
  active: 'text-success bg-success/10',
  suspended: 'text-error bg-error/10',
  pending: 'text-warning bg-warning/10',
}
