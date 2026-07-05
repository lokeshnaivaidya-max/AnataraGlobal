export interface Lead {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  title?: string
  source: 'referral' | 'website' | 'event' | 'cold_outreach' | 'social_media' | 'partner' | 'other'
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
  value: number
  currency: string
  tags: string[]
  notes?: string
  assignedTo?: string
  lastContactedAt?: string
  createdAt: string
}

export interface LeadActivity {
  id: string
  leadId: string
  type: 'note' | 'email' | 'call' | 'meeting' | 'proposal' | 'other'
  subject: string
  description: string
  createdAt: string
}

export const LEAD_SOURCES = [
  { value: 'referral', label: 'Referral' },
  { value: 'website', label: 'Website' },
  { value: 'event', label: 'Event' },
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'partner', label: 'Partner' },
  { value: 'other', label: 'Other' },
] as const

export const LEAD_STAGES = [
  { value: 'new', label: 'New', color: 'text-blue-600 bg-blue-100' },
  { value: 'contacted', label: 'Contacted', color: 'text-warning bg-warning/10' },
  { value: 'qualified', label: 'Qualified', color: 'text-gold bg-gold/10' },
  { value: 'proposal', label: 'Proposal', color: 'text-purple-600 bg-purple-100' },
  { value: 'negotiation', label: 'Negotiation', color: 'text-emerald bg-emerald/10' },
  { value: 'won', label: 'Won', color: 'text-success bg-success/10' },
  { value: 'lost', label: 'Lost', color: 'text-error bg-error/10' },
] as const

export const LEAD_STAGE_ORDER = LEAD_STAGES.map(s => s.value)
