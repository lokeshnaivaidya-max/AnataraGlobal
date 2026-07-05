export interface KnowledgeResource {
  id: string
  title: string
  description: string
  type: 'article' | 'guide' | 'template' | 'video' | 'case_study' | 'report'
  category: string
  url: string
  coverImage?: string
  author: string
  duration?: string
  tags: string[]
  isBookmarked: boolean
  viewCount: number
  createdAt: string
}

export const RESOURCE_CATEGORIES = [
  { value: 'fundraising', label: 'Fundraising' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'legal', label: 'Legal' },
  { value: 'product', label: 'Product' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
  { value: 'technology', label: 'Technology' },
] as const

export const RESOURCE_TYPES = [
  { value: 'article', label: 'Article', icon: 'FileText' },
  { value: 'guide', label: 'Guide', icon: 'BookOpen' },
  { value: 'template', label: 'Template', icon: 'FileSpreadsheet' },
  { value: 'video', label: 'Video', icon: 'Video' },
  { value: 'case_study', label: 'Case Study', icon: 'GraduationCap' },
  { value: 'report', label: 'Report', icon: 'BarChart3' },
] as const
