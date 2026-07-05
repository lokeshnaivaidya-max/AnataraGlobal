export interface MSME {
  id: string
  userId: string
  businessName: string
  businessDescription?: string
  industryId?: string
  website?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  profileCompletion: number
  createdAt: string
  updatedAt: string
}

export interface Industry {
  id: string
  name: string
  category: string
}

export interface GSTDetail {
  id: string
  msmeId: string
  gstNumber: string
  gstStatus: 'verified' | 'pending' | 'unregistered'
  verifiedAt?: string
}

export interface Turnover {
  id: string
  msmeId: string
  fiscalYear: string
  amount: number
  currency: string
  isVerified: boolean
}

export interface EmployeeInfo {
  id: string
  msmeId: string
  totalCount: number
  permanentCount: number
  contractCount: number
  asOfDate: string
}

export interface ExportStatus {
  id: string
  msmeId: string
  isExporting: boolean
  exportCountries?: string[]
  exportRevenue?: number
  startedYear?: number
}

export interface FinancialHealth {
  id: string
  msmeId: string
  revenueGrowth: number
  profitMargin: number
  debtRatio: number
  liquidityRatio: number
  overallScore: number
  assessmentDate: string
  recommendations?: string
}

export interface ComplianceStatus {
  id: string
  msmeId: string
  gstFiling: 'regular' | 'irregular' | 'not_applicable'
  itReturns: 'filed' | 'pending' | 'not_applicable'
  companyFilings: 'compliant' | 'overdue' | 'not_applicable'
  laborCompliance: 'compliant' | 'non_compliant' | 'not_applicable'
  environmentalCompliance: 'compliant' | 'non_compliant' | 'not_applicable'
  lastAuditDate?: string
  overallStatus: 'good' | 'attention' | 'critical'
  notes?: string
}

export const MSME_INDUSTRIES = [
  'Manufacturing',
  'Trading',
  'Services',
  'Retail',
  'Food Processing',
  'Textiles',
  'Handicrafts',
  'IT & ITES',
  'Healthcare',
  'Education',
  'Agriculture',
  'Construction',
  'Transportation',
  'Other',
] as const

export const COMPLIANCE_LABELS: Record<string, string> = {
  regular: 'Regular',
  irregular: 'Irregular',
  not_applicable: 'N/A',
  filed: 'Filed',
  pending: 'Pending',
  compliant: 'Compliant',
  overdue: 'Overdue',
  non_compliant: 'Non-Compliant',
  good: 'Good',
  attention: 'Needs Attention',
  critical: 'Critical',
}
