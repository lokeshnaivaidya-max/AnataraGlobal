import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

interface RefreshResponse {
  token: string
  refreshToken?: string
}

type QueueEntry = {
  resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void
  reject: (reason: unknown) => void
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: QueueEntry[] = []

function processQueue(error: unknown) {
  failedQueue.forEach(entry => {
    error ? entry.reject(error) : entry.resolve(error as AxiosResponse)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => api(originalRequest))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post<RefreshResponse>(
          `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`,
          { refreshToken }
        )
        localStorage.setItem('token', data.token)
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken)
        }
        processQueue(null)
        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
