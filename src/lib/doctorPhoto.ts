const STORAGE_KEY = 'doctor-photo-cache'

type DoctorPhotoCache = Record<string, string>

function readCache(): DoctorPhotoCache {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}

  try {
    return JSON.parse(raw) as DoctorPhotoCache
  } catch {
    return {}
  }
}

function writeCache(cache: DoctorPhotoCache) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
}

export function getCachedDoctorPhoto(userID: string) {
  if (!userID) return ''
  return readCache()[userID] || ''
}

export function saveCachedDoctorPhoto(userID: string, photoDataUrl: string) {
  if (!userID) return

  const cache = readCache()
  cache[userID] = photoDataUrl
  writeCache(cache)
}

export function removeCachedDoctorPhoto(userID: string) {
  if (!userID) return

  const cache = readCache()
  delete cache[userID]
  writeCache(cache)
}
