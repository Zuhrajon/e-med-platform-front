const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string
  headers?: Record<string, string>
}

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, token, headers = {} } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')

  const data = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null)

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof (data as { error?: unknown }).error === 'string'
        ? (data as { error: string }).error
        : `Request failed with status ${response.status}`

    throw new ApiError(message, response.status, data)
  }

  return data as T
}

export { API_BASE_URL }