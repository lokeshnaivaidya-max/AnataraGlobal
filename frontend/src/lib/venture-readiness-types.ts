export const READINESS_DIMENSIONS = [
  'team',
  'product',
  'market',
  'traction',
  'financials',
  'legal',
] as const

export type ReadinessDimension = typeof READINESS_DIMENSIONS[number]

export const DIMENSION_LABELS: Record<ReadinessDimension, string> = {
  team: 'Team & Leadership',
  product: 'Product & Technology',
  market: 'Market & Opportunity',
  traction: 'Traction & Growth',
  financials: 'Financial Health',
  legal: 'Legal & Compliance',
}

export const DIMENSION_ICONS: Record<ReadinessDimension, string> = {
  team: 'Users',
  product: 'Package',
  market: 'TrendingUp',
  traction: 'Rocket',
  financials: 'BarChart3',
  legal: 'ShieldCheck',
}

export interface ReadinessQuestion {
  id: string
  dimension: ReadinessDimension
  question: string
  description?: string
  weight: number
  maxScore: number
}

export interface ReadinessResponse {
  questionId: string
  score: number
  notes?: string
}

export interface DimensionScore {
  dimension: ReadinessDimension
  score: number
  maxScore: number
  percentage: number
}

export interface VentureReadiness {
  id: string
  startupId: string
  overallScore: number
  dimensionScores: DimensionScore[]
  responses: ReadinessResponse[]
  strengths: string[]
  gaps: string[]
  recommendations: string[]
  assessedAt?: string
}

export const READINESS_LEVELS = [
  { min: 0, max: 25, label: 'Early Stage', color: 'text-error', bg: 'bg-error/10' },
  { min: 26, max: 50, label: 'Developing', color: 'text-warning', bg: 'bg-warning/10' },
  { min: 51, max: 75, label: 'Investment Ready', color: 'text-gold', bg: 'bg-gold/10' },
  { min: 76, max: 100, label: 'Highly Investable', color: 'text-success', bg: 'bg-success/10' },
]

export function getReadinessLevel(score: number) {
  return READINESS_LEVELS.find(l => score >= l.min && score <= l.max) || READINESS_LEVELS[0]
}
