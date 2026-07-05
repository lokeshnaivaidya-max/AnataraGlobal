import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './api'
import type { PlatformStats, AdminUser, PlatformSettings } from './admin-types'

export function usePlatformStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get<PlatformStats>('/admin/stats').then(res => res.data),
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get<AdminUser[]>('/admin/users').then(res => res.data),
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      api.put(`/admin/users/${userId}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      api.put(`/admin/users/${userId}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })
}

export function usePlatformSettings() {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => api.get<PlatformSettings>('/admin/settings').then(res => res.data),
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PlatformSettings) =>
      api.put('/admin/settings', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-settings'] }),
  })
}
