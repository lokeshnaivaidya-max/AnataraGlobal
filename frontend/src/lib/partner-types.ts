export interface Partner {
  id: string
  name: string
  logo?: string
  description: string
  type: 'accelerator' | 'incubator' | 'corporate' | 'government' | 'educational' | 'service_provider' | 'other'
  website?: string
  contactEmail?: string
  benefits: string[]
  eligibility?: string
  tags: string[]
  status: 'active' | 'inactive'
  createdAt: string
}

export interface PartnershipRequest {
  id: string
  partnerId: string
  partnerName: string
  status: 'pending' | 'approved' | 'rejected'
  message?: string
  createdAt: string
}

export const PARTNER_TYPES = [
  { value: 'accelerator', label: 'Accelerator' },
  { value: 'incubator', label: 'Incubator' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'government', label: 'Government' },
  { value: 'educational', label: 'Educational' },
  { value: 'service_provider', label: 'Service Provider' },
  { value: 'other', label: 'Other' },
] as const
