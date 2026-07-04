export interface DocumentCategory {
  id: string
  name: string
  icon: string
  description: string
}

export interface DocumentVersion {
  id: string
  documentId: string
  versionNumber: number
  fileUrl: string
  fileSize: number
  uploadedAt: string
  uploadedBy: string
  notes?: string
}

export interface Document {
  id: string
  categoryId: string
  name: string
  description?: string
  tags: string[]
  currentVersion: number
  status: 'draft' | 'under_review' | 'approved' | 'rejected'
  sharedWith: string[]
  createdAt: string
  updatedAt: string
  fileUrl: string
  fileSize: number
  mimeType: string
  expiresAt?: string
}

export interface DocumentUploadPayload {
  file: File
  categoryId: string
  name: string
  description?: string
  tags?: string[]
}

export interface DocumentUpdatePayload {
  name?: string
  description?: string
  tags?: string[]
  categoryId?: string
}

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  { id: 'business-plan', name: 'Business Plan', icon: 'FileText', description: 'Pitch decks, business plans, executive summaries' },
  { id: 'financial', name: 'Financial', icon: 'BarChart3', description: 'Financial statements, projections, reports' },
  { id: 'legal', name: 'Legal', icon: 'ShieldCheck', description: 'Incorporation, contracts, agreements, IP' },
  { id: 'product', name: 'Product', icon: 'Package', description: 'Product specs, roadmaps, technical docs' },
  { id: 'team', name: 'Team', icon: 'Users', description: 'Resumes, offer letters, HR documents' },
  { id: 'marketing', name: 'Marketing', icon: 'TrendingUp', description: 'Research, plans, collaterals' },
  { id: 'other', name: 'Other', icon: 'Folder', description: 'Miscellaneous documents' },
]

export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
}

export const DOCUMENT_STATUS_COLORS: Record<string, string> = {
  draft: 'text-medium-gray bg-medium-gray/10',
  under_review: 'text-warning bg-warning/10',
  approved: 'text-success bg-success/10',
  rejected: 'text-error bg-error/10',
}

export function getCategory(id: string) {
  return DOCUMENT_CATEGORIES.find(c => c.id === id)
}
