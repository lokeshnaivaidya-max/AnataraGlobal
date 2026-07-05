export interface Notification {
  id: string
  type: 'email' | 'in_app' | 'both'
  channel: 'email' | 'system'
  title: string
  message: string
  category: 'profile' | 'document' | 'session' | 'assessment' | 'compliance' | 'system' | 'kyc'
  read: boolean
  emailSent: boolean
  createdAt: string
  readAt?: string
  actionUrl?: string
}

export interface NotificationPreference {
  id: string
  userId: string
  emailNotifications: boolean
  categories: {
    profile: boolean
    document: boolean
    session: boolean
    assessment: boolean
    compliance: boolean
    system: boolean
    kyc: boolean
  }
  digestFrequency: 'immediate' | 'daily' | 'weekly'
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[]
  lastUpdated: string
}

export const NOTIFICATION_CATEGORIES = [
  { key: 'profile', label: 'Profile Updates' },
  { key: 'document', label: 'Document Activity' },
  { key: 'session', label: 'Session Reminders' },
  { key: 'assessment', label: 'Readiness Assessment' },
  { key: 'compliance', label: 'Compliance Alerts' },
  { key: 'system', label: 'System Announcements' },
  { key: 'kyc', label: 'KYC Updates' },
] as const

export const CATEGORY_ICONS: Record<string, string> = {
  profile: 'User',
  document: 'FileText',
  session: 'Calendar',
  assessment: 'Gauge',
  compliance: 'ShieldCheck',
  system: 'Settings',
  kyc: 'ClipboardCheck',
}
