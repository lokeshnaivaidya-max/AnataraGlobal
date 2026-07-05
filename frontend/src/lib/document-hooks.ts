import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './api'
import type { Document, DocumentUpdatePayload } from './document-types'

export function useDocuments(categoryId?: string) {
  return useQuery({
    queryKey: ['documents', categoryId],
    queryFn: () => {
      const url = categoryId ? `/documents?categoryId=${categoryId}` : '/documents'
      return api.get<Document[]>(url).then(res => res.data)
    },
  })
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => api.get<Document>(`/documents/${id}`).then(res => res.data),
    enabled: !!id,
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post<Document>('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/documents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DocumentUpdatePayload }) =>
      api.put<Document>(`/documents/${id}`, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

export function useShareDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, email }: { id: string; email: string }) =>
      api.post(`/documents/${id}/share`, { email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}
