export interface Founder {
  id: string
  userId: string
  bio?: string
  phone?: string
  linkedinUrl?: string
  avatar?: string
  kycStatus: 'pending' | 'submitted' | 'verified' | 'rejected'
  kycDocument?: string
  profileCompletion: number
  createdAt: string
  updatedAt: string
}

export interface Education {
  id: string
  founderId: string
  degree: string
  institution: string
  fieldOfStudy?: string
  startYear: number
  endYear?: number
  isCurrent: boolean
}

export interface Experience {
  id: string
  founderId: string
  company: string
  role: string
  description?: string
  startMonth: string
  startYear: number
  endMonth?: string
  endYear?: number
  isCurrent: boolean
}

export interface Skill {
  id: string
  founderId: string
  name: string
  category?: string
}

export interface Startup {
  id: string
  founderId: string
  name: string
  tagline?: string
  description?: string
  industry: string
  sector?: string
  problem?: string
  solution?: string
  website?: string
  logo?: string
  businessStageId?: string
  fundingStageId?: string
  valuation?: number
  revenue?: number
  revenueCurrency?: string
  traction?: string
  customerCount?: number
  employeeCount?: number
  incorporationType?: string
  incorporationDate?: string
  createdAt: string
  updatedAt: string
}

export interface BusinessStage {
  id: string
  name: string
  description?: string
}

export interface FundingStage {
  id: string
  name: string
  description?: string
  minAmount?: number
  maxAmount?: number
}

export interface TeamMember {
  id: string
  startupId: string
  name: string
  role: string
  email?: string
  linkedinUrl?: string
  equity?: number
  bio?: string
  isCoFounder: boolean
}

export interface Document {
  id: string
  founderId?: string
  startupId?: string
  type: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  status: 'pending' | 'approved' | 'rejected'
  uploadedAt: string
  expiresAt?: string
}

export interface CapTableEntry {
  id: string
  startupId: string
  name: string
  equity: number
  type: 'founder' | 'investor' | 'employee' | 'advisor' | 'other'
  vestingSchedule?: string
}

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'E-commerce',
  'Manufacturing',
  'Agriculture',
  'Real Estate',
  'Transportation',
  'Energy',
  'Media',
  'Other',
] as const

export const BUSINESS_STAGES = [
  'Ideation',
  'Validation',
  'Early Traction',
  'Growth',
  'Scale',
  'Maturity',
] as const

export const FUNDING_STAGES = [
  'Bootstrapped',
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
] as const

export const DOCUMENT_TYPES = [
  'PAN Card',
  'GST Certificate',
  'Incorporation Certificate',
  'Financial Statement',
  'Business Plan',
  'Pitch Deck',
  'Cap Table',
  'Legal Document',
  'Patent',
  'Bank Statement',
  'Other',
] as const
