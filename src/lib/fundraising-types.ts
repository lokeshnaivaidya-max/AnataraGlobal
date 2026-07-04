export interface FundraisingRound {
  id: string
  startupId: string
  type: 'seed' | 'pre_seed' | 'series_a' | 'series_b' | 'series_c' | 'grants' | 'debt' | 'other'
  targetAmount: number
  raisedAmount: number
  currency: string
  status: 'planning' | 'active' | 'closed' | 'cancelled'
  startedAt: string
  closedAt?: string
  description?: string
  investors: InvestorAllocation[]
}

export interface InvestorAllocation {
  investorId: string
  investorName: string
  amount: number
  equity: number
  type: 'angel' | 'vc' | 'accelerator' | 'family_office' | 'crowd' | 'other'
}

export interface InvestorPipeline {
  id: string
  roundId: string
  investorName: string
  investorType: 'angel' | 'vc' | 'accelerator' | 'family_office' | 'crowd' | 'other'
  stage: 'identified' | 'contacted' | 'meeting_scheduled' | 'due_diligence' | 'term_sheet' | 'closed' | 'passed'
  contactEmail?: string
  notes?: string
  meetingDate?: string
  expectedAmount?: number
  createdAt: string
}

export interface FundraisingMetric {
  totalRaised: number
  totalTarget: number
  activeRounds: number
  totalInvestors: number
  avgTicketSize: number
  roundsCompleted: number
}

export const ROUND_TYPES = [
  { value: 'pre_seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series_a', label: 'Series A' },
  { value: 'series_b', label: 'Series B' },
  { value: 'series_c', label: 'Series C' },
  { value: 'grants', label: 'Grants' },
  { value: 'debt', label: 'Debt' },
  { value: 'other', label: 'Other' },
] as const

export const ROUND_STATUSES = [
  { value: 'planning', label: 'Planning', color: 'text-medium-gray bg-medium-gray/10' },
  { value: 'active', label: 'Active', color: 'text-success bg-success/10' },
  { value: 'closed', label: 'Closed', color: 'text-gold bg-gold/10' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-error bg-error/10' },
] as const

export const INVESTOR_STAGES = [
  { value: 'identified', label: 'Identified', color: 'text-medium-gray bg-medium-gray/10' },
  { value: 'contacted', label: 'Contacted', color: 'text-blue-600 bg-blue-100' },
  { value: 'meeting_scheduled', label: 'Meeting Scheduled', color: 'text-warning bg-warning/10' },
  { value: 'due_diligence', label: 'Due Diligence', color: 'text-gold bg-gold/10' },
  { value: 'term_sheet', label: 'Term Sheet', color: 'text-emerald bg-emerald/10' },
  { value: 'closed', label: 'Closed', color: 'text-success bg-success/10' },
  { value: 'passed', label: 'Passed', color: 'text-error bg-error/10' },
] as const

export const INVESTOR_TYPES = ['angel', 'vc', 'accelerator', 'family_office', 'crowd', 'other'] as const
