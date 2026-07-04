declare module 'axios' {
  export interface AxiosRequestConfig {
    baseURL?: string
    headers?: Record<string, string | number | boolean> & { Authorization?: string }
    _retry?: boolean
    [key: string]: unknown
  }

  export interface AxiosResponse<T = unknown> {
    data: T
    status: number
    statusText: string
    headers: Record<string, string>
    config: InternalAxiosRequestConfig
  }

  export interface AxiosError<T = unknown> extends Error {
    config: InternalAxiosRequestConfig
    code?: string
    request?: unknown
    response?: AxiosResponse<T>
    isAxiosError: boolean
  }

  export interface InternalAxiosRequestConfig extends AxiosRequestConfig {
    headers: Record<string, string | number | boolean> & { Authorization?: string }
  }

  export interface AxiosInstance {
    <T = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
    post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
    put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
    interceptors: {
      request: {
        use(
          fulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
          rejected?: (error: unknown) => unknown
        ): number
      }
      response: {
        use(
          fulfilled: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
          rejected?: (error: AxiosError) => unknown
        ): number
      }
    }
    create(config?: AxiosRequestConfig): AxiosInstance
  }

  declare const axios: AxiosInstance
  export default axios
}
