export interface Event {
  id: string
  title: string
  description: string
  type: 'webinar' | 'workshop' | 'conference' | 'networking' | 'pitch_day' | 'other'
  mode: 'online' | 'offline' | 'hybrid'
  startDate: string
  endDate: string
  location?: string
  meetingLink?: string
  coverImage?: string
  organizer: string
  capacity: number
  registeredCount: number
  price: number
  currency: string
  tags: string[]
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
}

export interface EventRegistration {
  id: string
  eventId: string
  eventTitle: string
  eventType: string
  eventDate: string
  status: 'confirmed' | 'attended' | 'cancelled' | 'waitlisted'
  registeredAt: string
}

export const EVENT_TYPES = [
  { value: 'webinar', label: 'Webinar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'networking', label: 'Networking' },
  { value: 'pitch_day', label: 'Pitch Day' },
  { value: 'other', label: 'Other' },
] as const

export const EVENT_STATUSES = [
  { value: 'upcoming', label: 'Upcoming', color: 'text-success bg-success/10' },
  { value: 'ongoing', label: 'Ongoing', color: 'text-gold bg-gold/10' },
  { value: 'completed', label: 'Completed', color: 'text-medium-gray bg-medium-gray/10' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-error bg-error/10' },
] as const
