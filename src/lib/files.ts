import { API_BASE_URL, ApiError } from './api'

export async function downloadFile(accessToken: string, fileID: string, fallbackName: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/files/${fileID}/download`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const data = (await response.json()) as { error?: string }
      if (typeof data?.error === 'string') {
        message = data.error
      }

      throw new ApiError(message, response.status, data)
    } catch {
      throw new ApiError(message, response.status, null)
    }
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fallbackName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.URL.revokeObjectURL(url)
}
