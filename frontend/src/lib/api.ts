interface ApiConfig {
  baseURL: string
  headers: Record<string, string>
  _retry?: boolean
  method?: string
  url?: string
  data?: unknown
}

interface ApiResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  config: ApiConfig
}

interface ApiError {
  config: ApiConfig
  response?: ApiResponse
  isApiError: boolean
  message: string
}

type RequestInterceptorFulfilled = (config: ApiConfig) => ApiConfig | Promise<ApiConfig>
type RequestInterceptorRejected = (error: unknown) => unknown
type ResponseInterceptorFulfilled = (response: ApiResponse) => ApiResponse | Promise<ApiResponse>
type ResponseInterceptorRejected = (error: ApiError) => ApiResponse | Promise<ApiResponse> | Promise<never>

interface ApiInstance {
  <T = unknown>(config: ApiConfig): Promise<ApiResponse<T>>
  get<T = unknown>(url: string, config?: Partial<ApiConfig>): Promise<ApiResponse<T>>
  post<T = unknown>(url: string, data?: unknown, config?: Partial<ApiConfig>): Promise<ApiResponse<T>>
  put<T = unknown>(url: string, data?: unknown, config?: Partial<ApiConfig>): Promise<ApiResponse<T>>
  delete<T = unknown>(url: string, config?: Partial<ApiConfig>): Promise<ApiResponse<T>>
  interceptors: {
    request: { use: (fulfilled: RequestInterceptorFulfilled, rejected?: RequestInterceptorRejected) => number }
    response: { use: (fulfilled: ResponseInterceptorFulfilled, rejected?: ResponseInterceptorRejected) => number }
  }
  create: (config?: Partial<ApiConfig>) => ApiInstance
}

function createApi(defaultConfig: Partial<ApiConfig> = {}): ApiInstance {
  let baseConfig: ApiConfig = {
    baseURL: defaultConfig.baseURL || '',
    headers: { 'Content-Type': 'application/json', ...defaultConfig.headers },
  }

  interface ReqInterceptor {
    fulfilled: RequestInterceptorFulfilled
    rejected?: RequestInterceptorRejected
  }
  interface ResInterceptor {
    fulfilled: ResponseInterceptorFulfilled
    rejected?: ResponseInterceptorRejected
  }

  const requestInterceptors: ReqInterceptor[] = []
  const responseInterceptors: ResInterceptor[] = []

  let interceptorId = 0

  async function performRequest<T>(method: string, url: string, data?: unknown, extraConfig?: Partial<ApiConfig>): Promise<ApiResponse<T>> {
    let config: ApiConfig = {
      ...baseConfig,
      ...extraConfig,
      method,
      url,
      headers: { ...baseConfig.headers, ...extraConfig?.headers },
    }
    if (data !== undefined) {
      config.data = data
    }

    for (const interceptor of requestInterceptors) {
      try {
        config = await interceptor.fulfilled(config)
      } catch (e) {
        if (interceptor.rejected) interceptor.rejected(e)
        throw e
      }
    }

    const fullUrl = config.baseURL + (config.url || '')
    const fetchOptions: RequestInit = {
      method: config.method || 'GET',
      headers: { ...config.headers },
    }
    if (config.data !== undefined && config.method?.toUpperCase() !== 'GET') {
      fetchOptions.body = JSON.stringify(config.data)
    }

    let response: Response
    try {
      response = await fetch(fullUrl, fetchOptions)
    } catch (e) {
      const error: ApiError = {
        config,
        isApiError: true,
        message: e instanceof Error ? e.message : String(e),
      }
      for (const interceptor of responseInterceptors) {
        if (interceptor.rejected) {
          try { return await interceptor.rejected(error) as ApiResponse<T> } catch { /* fall through */ }
        }
      }
      throw error
    }

    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const raw: unknown = isJson ? await response.json() : await response.text()

    let apiResponse: ApiResponse<T> = {
      data: raw as T,
      status: response.status,
      statusText: response.statusText,
      config,
    }

    if (!response.ok) {
      const apiError: ApiError = {
        config,
        response: apiResponse,
        isApiError: true,
        message: typeof raw === 'object' && raw !== null && 'message' in raw ? (raw as Record<string, unknown>).message as string : response.statusText,
      }
      for (const interceptor of responseInterceptors) {
        if (interceptor.rejected) {
          try { return await interceptor.rejected(apiError) as ApiResponse<T> } catch { /* fall through */ }
        }
      }
      throw apiError
    }

    for (const interceptor of responseInterceptors) {
      try {
        apiResponse = await interceptor.fulfilled(apiResponse) as ApiResponse<T>
      } catch (e) {
        if (interceptor.rejected) interceptor.rejected(e as ApiError)
        throw e
      }
    }

    return apiResponse
  }

  function instanceCallable<T>(config: ApiConfig): Promise<ApiResponse<T>> {
    return performRequest<T>(config.method || 'GET', config.url || '', config.data, config)
  }

  const methods: Omit<ApiInstance, keyof ((config: ApiConfig) => unknown)> = {
    get: <T>(url: string, config?: Partial<ApiConfig>) => performRequest<T>('GET', url, undefined, config),
    post: <T>(url: string, data?: unknown, config?: Partial<ApiConfig>) => performRequest<T>('POST', url, data, config),
    put: <T>(url: string, data?: unknown, config?: Partial<ApiConfig>) => performRequest<T>('PUT', url, data, config),
    delete: <T>(url: string, config?: Partial<ApiConfig>) => performRequest<T>('DELETE', url, undefined, config),
    interceptors: {
      request: {
        use(fulfilled: RequestInterceptorFulfilled, rejected?: RequestInterceptorRejected) {
          requestInterceptors.push({ fulfilled, rejected })
          return ++interceptorId
        },
      },
      response: {
        use(fulfilled: ResponseInterceptorFulfilled, rejected?: ResponseInterceptorRejected) {
          responseInterceptors.push({ fulfilled, rejected })
          return ++interceptorId
        },
      },
    },
    create: (newConfig?: Partial<ApiConfig>) => createApi({ ...baseConfig, ...newConfig }),
  }

  return Object.assign(instanceCallable, methods) as unknown as ApiInstance
}

const api = createApi({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

interface RefreshResponse {
  token: string
  refreshToken?: string
}

type QueueEntry = {
  resolve: (value: ApiResponse | PromiseLike<ApiResponse>) => void
  reject: (reason: unknown) => void
}

api.interceptors.request.use((config: ApiConfig) => {
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
    error ? entry.reject(error) : entry.resolve(error as ApiResponse)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response: ApiResponse) => response,
  async (error: ApiError) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<ApiResponse>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => instanceRequest(originalRequest))
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
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          }
        )
        const data: RefreshResponse = await res.json()
        localStorage.setItem('token', data.token)
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken)
        }
        processQueue(null)
        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return instanceRequest(originalRequest)
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

function instanceRequest<T>(config: ApiConfig): Promise<ApiResponse<T>> {
  return api(config)
}

export default api
