export interface InvestorContact {
  id: string
  name: string
  firm: string
  title?: string
  email?: string
  phone?: string
  linkedinUrl?: string
  type: 'angel' | 'vc' | 'accelerator' | 'family_office' | 'crowd' | 'other'
  tags: string[]
  notes?: string
  source?: string
  createdAt: string
  updatedAt: string
}

export interface CommunicationLog {
  id: string
  contactId: string
  type: 'email' | 'call' | 'meeting' | 'linkedin' | 'other'
  direction: 'outbound' | 'inbound'
  subject: string
  summary: string
  date: string
  followUpDate?: string
}

export interface MeetingNote {
  id: string
  contactId: string
  title: string
  date: string
  notes: string
  actionItems: string[]
  rating?: number
}

export interface InvestorTask {
  id: string
  contactId: string
  title: string
  description?: string
  dueDate?: string
  status: 'pending' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
}

export const INVESTOR_TYPES = [
  { value: 'angel', label: 'Angel Investor' },
  { value: 'vc', label: 'Venture Capital' },
  { value: 'accelerator', label: 'Accelerator' },
  { value: 'family_office', label: 'Family Office' },
  { value: 'crowd', label: 'Crowdfunding' },
  { value: 'other', label: 'Other' },
] as const

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-medium-gray bg-medium-gray/10',
  medium: 'text-warning bg-warning/10',
  high: 'text-error bg-error/10',
}
