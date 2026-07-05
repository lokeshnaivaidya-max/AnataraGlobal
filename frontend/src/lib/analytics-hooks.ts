import { useQuery } from '@tanstack/react-query'
import api from './api'
import type { AnalyticsReport } from './analytics-types'

export function useAnalytics(period?: string) {
  return useQuery({
    queryKey: ['analytics', period],
    queryFn: () => {
      const url = period ? `/analytics?period=${period}` : '/analytics'
      return api.get<AnalyticsReport>(url).then(res => res.data)
    },
  })
}
