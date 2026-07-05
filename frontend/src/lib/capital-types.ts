export interface CapitalProvider {
  id: string
  name: string
  logo?: string
  type: 'bank' | 'nbfc' | 'vc_fund' | 'angel_network' | 'government_scheme' | 'crowdfunding' | 'other'
  description: string
  website?: string
  minAmount: number
  maxAmount: number
  currency: string
  interestRate?: number
  equityRange?: string
  tenure?: string
  products: string[]
  eligibility: string[]
  tags: string[]
  status: 'active' | 'inactive'
}

export interface CapitalRequest {
  id: string
  providerId: string
  providerName: string
  amount: number
  purpose: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'disbursed'
  createdAt: string
  updatedAt?: string
}

export const CAPITAL_PROVIDER_TYPES = [
  { value: 'bank', label: 'Bank' },
  { value: 'nbfc', label: 'NBFC' },
  { value: 'vc_fund', label: 'VC Fund' },
  { value: 'angel_network', label: 'Angel Network' },
  { value: 'government_scheme', label: 'Government Scheme' },
  { value: 'crowdfunding', label: 'Crowdfunding' },
  { value: 'other', label: 'Other' },
] as const

export const CAPITAL_REQUEST_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'text-medium-gray bg-medium-gray/10' },
  { value: 'submitted', label: 'Submitted', color: 'text-blue-600 bg-blue-100' },
  { value: 'under_review', label: 'Under Review', color: 'text-warning bg-warning/10' },
  { value: 'approved', label: 'Approved', color: 'text-success bg-success/10' },
  { value: 'rejected', label: 'Rejected', color: 'text-error bg-error/10' },
  { value: 'disbursed', label: 'Disbursed', color: 'text-gold bg-gold/10' },
] as const
