import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './api'
import type {
  Founder,
  Education,
  Experience,
  Skill,
  Startup,
  TeamMember,
  Document,
  BusinessStage,
  FundingStage,
  CapTableEntry,
} from './founder-types'

export function useFounderProfile() {
  return useQuery({
    queryKey: ['founder-profile'],
    queryFn: () => api.get<Founder>('/founder/profile').then(res => res.data),
  })
}

export function useUpdateFounderProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Founder>) =>
      api.put<Founder>('/founder/profile', data).then(res => res.data),
    onSuccess: (updated) => {
      // Update cache immediately for instant UI feedback
      queryClient.setQueryData(['founder-profile'], updated)
      // Force all subscribers (DashboardHome, ProfilePage) to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['founder-profile'] })
    },
  })
}

export function useEducation() {
  return useQuery({
    queryKey: ['founder-education'],
    queryFn: () => api.get<Education[]>('/founder/education').then(res => res.data),
  })
}

export function useAddEducation() {
  return useMutation({
    mutationFn: (data: Omit<Education, 'id' | 'founderId'>) =>
      api.post<Education>('/founder/education', data).then(res => res.data),
  })
}

export function useUpdateEducation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Education> }) =>
      api.put<Education>(`/founder/education/${id}`, data).then(res => res.data),
  })
}

export function useDeleteEducation() {
  return useMutation({
    mutationFn: (id: string) => api.delete(`/founder/education/${id}`),
  })
}

export function useExperience() {
  return useQuery({
    queryKey: ['founder-experience'],
    queryFn: () => api.get<Experience[]>('/founder/experience').then(res => res.data),
  })
}

export function useAddExperience() {
  return useMutation({
    mutationFn: (data: Omit<Experience, 'id' | 'founderId'>) =>
      api.post<Experience>('/founder/experience', data).then(res => res.data),
  })
}

export function useUpdateExperience() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Experience> }) =>
      api.put<Experience>(`/founder/experience/${id}`, data).then(res => res.data),
  })
}

export function useDeleteExperience() {
  return useMutation({
    mutationFn: (id: string) => api.delete(`/founder/experience/${id}`),
  })
}

export function useSkills() {
  return useQuery({
    queryKey: ['founder-skills'],
    queryFn: () => api.get<Skill[]>('/founder/skills').then(res => res.data),
  })
}

export function useAddSkill() {
  return useMutation({
    mutationFn: (data: Omit<Skill, 'id' | 'founderId'>) =>
      api.post<Skill>('/founder/skills', data).then(res => res.data),
  })
}

export function useDeleteSkill() {
  return useMutation({
    mutationFn: (id: string) => api.delete(`/founder/skills/${id}`),
  })
}

export function useStartup() {
  return useQuery({
    queryKey: ['startup'],
    queryFn: () => api.get<Startup>('/startup').then(res => res.data),
  })
}

export function useUpdateStartup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Startup>) =>
      api.put<Startup>('/startup', data).then(res => res.data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['startup'], updated)
      queryClient.invalidateQueries({ queryKey: ['startup'] })
      // Also refresh founder-profile so dashboard completion % updates
      queryClient.invalidateQueries({ queryKey: ['founder-profile'] })
    },
  })
}

export function useBusinessStages() {
  return useQuery({
    queryKey: ['business-stages'],
    queryFn: () => api.get<BusinessStage[]>('/startup/business-stages').then(res => res.data),
  })
}

export function useFundingStages() {
  return useQuery({
    queryKey: ['funding-stages'],
    queryFn: () => api.get<FundingStage[]>('/startup/funding-stages').then(res => res.data),
  })
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: () => api.get<TeamMember[]>('/startup/team').then(res => res.data),
  })
}

export function useAddTeamMember() {
  return useMutation({
    mutationFn: (data: Omit<TeamMember, 'id'>) =>
      api.post<TeamMember>('/startup/team', data).then(res => res.data),
  })
}

export function useUpdateTeamMember() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TeamMember> }) =>
      api.put<TeamMember>(`/startup/team/${id}`, data).then(res => res.data),
  })
}

export function useDeleteTeamMember() {
  return useMutation({
    mutationFn: (id: string) => api.delete(`/startup/team/${id}`),
  })
}

export function useDocuments() {
  return useQuery({
    queryKey: ['founder-documents'],
    queryFn: () => api.get<Document[]>('/founder/documents').then(res => res.data),
  })
}

export function useUploadDocument() {
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post<Document>('/founder/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(res => res.data),
  })
}

export function useUploadKycDocument() {
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post<{ status: string; kycStatus: string }>('/founder/kyc/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(res => res.data),
  })
}

export function useDeleteDocument() {
  return useMutation({
    mutationFn: (id: string) => api.delete(`/founder/documents/${id}`),
  })
}

export function useCapTable() {
  return useQuery({
    queryKey: ['cap-table'],
    queryFn: () => api.get<CapTableEntry[]>('/startup/cap-table').then(res => res.data),
  })
}

export function useAddCapTableEntry() {
  return useMutation({
    mutationFn: (data: Omit<CapTableEntry, 'id'>) =>
      api.post<CapTableEntry>('/startup/cap-table', data).then(res => res.data),
  })
}

export function useDeleteCapTableEntry() {
  return useMutation({
    mutationFn: (id: string) => api.delete(`/startup/cap-table/${id}`),
  })
}
