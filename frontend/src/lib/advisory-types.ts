export interface Advisor {
  id: string
  name: string
  title: string
  bio: string
  avatarUrl?: string
  expertise: string[]
  experience: number
  company?: string
  hourlyRate?: number
  currency?: string
  availability: 'available' | 'limited' | 'unavailable'
  rating: number
  sessionCount: number
  languages: string[]
}

export interface AdvisorSession {
  id: string
  advisorId: string
  advisorName: string
  advisorTitle: string
  advisorAvatarUrl?: string
  scheduledAt: string
  duration: number
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  topic: string
  notes?: string
  meetingLink?: string
}

export interface BookingRequest {
  advisorId: string
  scheduledAt: string
  duration: number
  topic: string
  notes?: string
}

export const SESSION_STATUS_LABELS: Record<string, string> = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const SESSION_STATUS_COLORS: Record<string, string> = {
  scheduled: 'text-warning bg-warning/10',
  confirmed: 'text-success bg-success/10',
  completed: 'text-medium-gray bg-medium-gray/10',
  cancelled: 'text-error bg-error/10',
}
