export interface AnalyticsOverview {
  totalViews: number
  totalLeads: number
  conversionRate: number
  activeUsers: number
  revenue: number
  growthRate: number
  periodLabel: string
}

export interface AnalyticsSeries {
  label: string
  value: number
  color: string
  percentage?: number
}

export interface AnalyticsReport {
  overview: AnalyticsOverview
  pageViews: { date: string; views: number; unique: number }[]
  leadsBySource: AnalyticsSeries[]
  userGrowth: { date: string; users: number }[]
  revenueHistory: { date: string; revenue: number }[]
  topPages: { path: string; views: number; avgTime: number }[]
}
