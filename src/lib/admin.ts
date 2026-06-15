import { refreshRequest } from './auth'
import { API_BASE_URL, ApiError } from './api'

export type Specialty = {
  id: string
  name: string
  is_active: boolean
}

export type DoctorStaff = {
  user_id: string
  role?: string
  email?: string
  phone_number?: string
  first_name: string
  last_name: string
  middle_name: string
  full_name: string
  specialty_id: string
  specialty_name: string
  work_experience_years: number
  appointment_fee: string
  description?: string
  avatar_file_id?: string
  avatar_url?: string
  is_active?: boolean
}

export type StaffDocument = {
  document_type: string
  file_id: string
  file_name: string
  content_type: string
  size_bytes: number
  download_url: string
}

export type StaffMember = {
  user_id: string
  role: 'doctor' | 'receptionist' | 'laborant'
  email: string
  phone_number: string
  first_name: string
  last_name: string
  middle_name: string
  full_name: string
  specialty_id: string
  specialty_name: string
  work_experience_years: number
  appointment_fee: string
  description?: string
  avatar_file_id?: string
  avatar_url?: string
  is_active: boolean
  documents?: StaffDocument[]
}

export type Holiday = {
  id: string
  date: string
  name: string
}

export type WorkingDayStatus = {
  date: string
  is_working: boolean
  is_holiday: boolean
  holiday_name: string
}

export type FakeDataUser = {
  user_id: string
  role: string
  email: string
  password: string
  first_name: string
  last_name: string
  middle_name: string
  full_name: string
}

export type FakeDataSpecialty = {
  specialty_id: string
  name: string
}

export type FakeDataHoliday = {
  holiday_id: string
  date: string
  name: string
}

export type FakeDataSnapshot = {
  users: FakeDataUser[]
  specialties: FakeDataSpecialty[]
  holidays: FakeDataHoliday[]
  lab_test_types?: Array<{
    lab_test_type_id: string
    name: string
  }>
}

export type FakeDataDeleteResponse = {
  deleted_users: number
  deleted_specialties: number
  deleted_holidays: number
  deleted_lab_test_types?: number
}

export type AdminDashboardStats = {
  users: {
    total: number
    doctors: number
    receptionists: number
    laborants: number
    patients: number
    active_staff: number
    inactive_staff: number
    unverified_patients: number
  }
  visits: {
    total: number
    created: number
    confirmed: number
    completed: number
    cancelled: number
  }
  laboratory: {
    created: number
    accepted: number
    completed: number
  }
  catalogs: {
    specialties: number
  }
}

export type CreateStaffPayload = {
  role: 'doctor' | 'receptionist' | 'laborant'
  email: string
  first_name: string
  last_name: string
  middle_name: string
  phone_number: string
  gender_id: string
  passport_number: string
  address: string
  date_of_birth: string
  specialty_id: string
  work_experience_years: string
  appointment_fee: string
  passport_files: File[]
  diploma_files: File[]
  employment_record_files: File[]
  avatar_file?: File | null
}

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'
const SESSION_STORAGE_KEY = 'auth-session'

type StoredSession = {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  mustChangePassword: boolean
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')

  return isJson
    ? response.json().catch(() => null)
    : response.text().catch(() => null)
}

function getStoredSession(): StoredSession | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as StoredSession
  } catch {
    return null
  }
}

function persistSession(session: StoredSession) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

async function adminRequest<T>(
  path: string,
  token: string,
  options: {
    method?: RequestMethod
    body?: BodyInit
    headers?: Record<string, string>
  } = {},
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options
  const requestWithToken = (authToken: string) =>
    fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...headers,
      },
      body,
    })

  const storedSession = getStoredSession()
  const initialToken = storedSession?.accessToken || token
  let response = await requestWithToken(initialToken)
  let data = await parseResponse(response)

  if (response.status === 401 && storedSession?.refreshToken) {
    try {
      const refreshed = await refreshRequest(storedSession.refreshToken)
      const nextSession: StoredSession = {
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token,
        tokenType: refreshed.token_type,
        expiresIn: refreshed.expires_in,
        mustChangePassword: refreshed.must_change_password,
      }

      persistSession(nextSession)
      response = await requestWithToken(nextSession.accessToken)
      data = await parseResponse(response)
    } catch {
      // Keep the original 401 path below if refresh also fails.
    }
  }

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

function jsonRequest<T>(
  path: string,
  token: string,
  method: Exclude<RequestMethod, 'GET'>,
  body?: unknown,
) {
  return adminRequest<T>(path, token, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export function listSpecialties(token: string) {
  return adminRequest<Specialty[]>('/api/v1/specialties/', token)
}

export function createSpecialty(token: string, name: string) {
  return jsonRequest<Specialty>('/api/v1/specialties/', token, 'POST', { name })
}

export function updateSpecialty(
  token: string,
  specialtyID: string,
  payload: { name?: string; is_active?: boolean },
) {
  return jsonRequest<Specialty>(
    `/api/v1/specialties/${specialtyID}`,
    token,
    'PATCH',
    payload,
  )
}

export function deleteSpecialty(token: string, specialtyID: string) {
  return adminRequest<void>(`/api/v1/specialties/${specialtyID}`, token, {
    method: 'DELETE',
  })
}

export function listDoctors(
  token: string,
  filters: {
    search?: string
    specialtyId?: string
  } = {},
) {
  const params = new URLSearchParams({ role: 'doctor' })

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.specialtyId) {
    params.set('specialty_id', filters.specialtyId)
  }

  return adminRequest<DoctorStaff[]>(
    `/api/v1/users/staff?${params.toString()}`,
    token,
  )
}

export function listStaff(
  token: string,
  filters: {
    search?: string
    role?: '' | 'doctor' | 'receptionist' | 'laborant'
    specialtyId?: string
  } = {},
) {
  const params = new URLSearchParams()

  if (filters.role) {
    params.set('role', filters.role)
  }

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.specialtyId) {
    params.set('specialty_id', filters.specialtyId)
  }

  const query = params.toString()
  return adminRequest<StaffMember[]>(
    `/api/v1/users/staff${query ? `?${query}` : ''}`,
    token,
  )
}

export function createDoctorStaff(token: string, payload: CreateStaffPayload) {
  const formData = new FormData()

  formData.set('role', payload.role)
  formData.set('email', payload.email)
  formData.set('first_name', payload.first_name)
  formData.set('last_name', payload.last_name)
  formData.set('middle_name', payload.middle_name)
  formData.set('phone_number', payload.phone_number)
  formData.set('gender_id', payload.gender_id)
  formData.set('passport_number', payload.passport_number)
  formData.set('address', payload.address)
  formData.set('date_of_birth', payload.date_of_birth)
  formData.set('specialty_id', payload.specialty_id)
  formData.set('work_experience_years', payload.work_experience_years)
  formData.set('appointment_fee', payload.appointment_fee)

  payload.passport_files.forEach((file) => {
    formData.append('passport_files', file)
  })
  payload.diploma_files.forEach((file) => {
    formData.append('diploma_files', file)
  })
  payload.employment_record_files.forEach((file) => {
    formData.append('employment_record_files', file)
  })
  if (payload.avatar_file) {
    formData.append('avatar_file', payload.avatar_file)
  }

  return adminRequest<{
    user_id: string
    role: string
    email: string
    temporary_password_sent: boolean
    must_change_password: boolean
  }>('/api/v1/users/staff', token, {
    method: 'POST',
    body: formData,
  })
}

export function updateStaff(
  token: string,
  userID: string,
  payload: {
    email?: string
    first_name?: string
    last_name?: string
    middle_name?: string
    phone_number?: string
    gender_id?: number
    passport_number?: string
    address?: string
    date_of_birth?: string
    specialty_id?: string
    work_experience_years?: number
    appointment_fee?: string
    description?: string
    is_active?: boolean
  },
) {
  return jsonRequest<StaffMember>(`/api/v1/users/staff/${userID}`, token, 'PATCH', payload)
}

export function getStaffByID(token: string, userID: string) {
  return adminRequest<StaffMember>(`/api/v1/users/staff/${userID}`, token)
}

export function updateStaffStatus(token: string, userID: string, isActive: boolean) {
  return jsonRequest<StaffMember>(`/api/v1/users/staff/${userID}/status`, token, 'PATCH', {
    is_active: isActive,
  })
}

export function resetStaffPassword(token: string, userID: string) {
  return adminRequest<{
    user_id: string
    email: string
    temporary_password_sent: boolean
    must_change_password: boolean
  }>(`/api/v1/users/staff/${userID}/forgot-password`, token, {
    method: 'POST',
  })
}

export function deleteStaff(token: string, userID: string) {
  return adminRequest<void>(`/api/v1/users/staff/${userID}`, token, {
    method: 'DELETE',
  })
}

export function getAdminDashboard(token: string) {
  return adminRequest<AdminDashboardStats>('/api/v1/admin/dashboard', token)
}

export function getFakeData(token: string) {
  return adminRequest<FakeDataSnapshot>('/api/v1/fake-data/', token)
}

export function populateFakeData(token: string) {
  return adminRequest<FakeDataSnapshot>('/api/v1/fake-data/populate', token, {
    method: 'POST',
  })
}

export function deleteFakeData(token: string) {
  return adminRequest<FakeDataDeleteResponse>('/api/v1/fake-data/', token, {
    method: 'DELETE',
  })
}

export function listHolidays(token: string, year?: number) {
  const params = new URLSearchParams()

  if (year) {
    params.set('year', String(year))
  }

  const query = params.toString()
  return adminRequest<Holiday[]>(
    `/api/v1/calendar/holidays/${query ? `?${query}` : ''}`,
    token,
  )
}

export function createHoliday(token: string, payload: { date: string; name: string }) {
  return jsonRequest<Holiday>('/api/v1/calendar/holidays/', token, 'POST', payload)
}

export function updateHoliday(
  token: string,
  holidayID: string,
  payload: { date?: string; name?: string },
) {
  return jsonRequest<Holiday>(
    `/api/v1/calendar/holidays/${holidayID}`,
    token,
    'PATCH',
    payload,
  )
}

export function deleteHoliday(token: string, holidayID: string) {
  return adminRequest<void>(`/api/v1/calendar/holidays/${holidayID}`, token, {
    method: 'DELETE',
  })
}

export function checkWorkingDay(token: string, date: string) {
  const params = new URLSearchParams({ date })
  return adminRequest<WorkingDayStatus>(
    `/api/v1/calendar/working-day?${params.toString()}`,
    token,
  )
}
