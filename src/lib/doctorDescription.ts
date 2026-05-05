const STORAGE_KEY = 'doctor-description-cache'

type DoctorDescriptionCache = Record<string, string>

function readCache(): DoctorDescriptionCache {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}

  try {
    return JSON.parse(raw) as DoctorDescriptionCache
  } catch {
    return {}
  }
}

function writeCache(cache: DoctorDescriptionCache) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
}

export function getCachedDoctorDescription(userID: string) {
  if (!userID) return ''
  return readCache()[userID] || ''
}

export function saveCachedDoctorDescription(userID: string, description: string) {
  if (!userID) return

  const cache = readCache()
  cache[userID] = description.trim()
  writeCache(cache)
}
