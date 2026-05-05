import { apiRequest } from './api'

export type PatientListItem = {
  user_id: string
  email: string
  first_name: string
  last_name: string
  middle_name: string
  full_name: string
  phone_number: string
  gender_id: number
  passport_number: string
  address: string
  date_of_birth: string
  is_active: boolean
  is_verified: boolean
  verified_by_user_id: string
  verified_by_full_name: string
  verified_at?: string
  verification_visit_id: string
}

export type CreatePatientPayload = {
  email: string
  first_name: string
  last_name: string
  middle_name: string
  phone_number: string
  gender_id: number
  passport_number: string
  address: string
  date_of_birth: string
}

export type CreatePatientResponse = {
  user_id: string
  email: string
  role: string
  patient_profile_id?: string
  verified?: boolean
}

export type UpdatePatientPayload = {
  email?: string
  first_name?: string
  last_name?: string
  middle_name?: string
  phone_number?: string
  gender_id?: number
  passport_number?: string
  address?: string
  date_of_birth?: string
}

export type VerifyPatientResponse = {
  user_id: string
  is_verified: boolean
  verified_by_user_id: string
  verified_at: string
  verification_visit_id: string
}

export function createPatient(token: string, payload: CreatePatientPayload) {
  return apiRequest<CreatePatientResponse>('/api/v1/patients/', {
    method: 'POST',
    token,
    body: payload,
  })
}

export function listPatients(
  token: string,
  filters: {
    search?: string
    verified?: boolean | ''
  } = {},
) {
  const params = new URLSearchParams()

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim())
  }

  if (filters.verified !== '') {
    if (typeof filters.verified === 'boolean') {
      params.set('verified', String(filters.verified))
    }
  }

  const query = params.toString()

  return apiRequest<PatientListItem[]>(`/api/v1/patients/${query ? `?${query}` : ''}`, {
    method: 'GET',
    token,
  })
}

export function getPatientByID(token: string, patientUserID: string) {
  return apiRequest<PatientListItem>(`/api/v1/patients/${patientUserID}`, {
    method: 'GET',
    token,
  })
}

export function updatePatient(token: string, patientUserID: string, payload: UpdatePatientPayload) {
  return apiRequest<PatientListItem>(`/api/v1/patients/${patientUserID}`, {
    method: 'PATCH',
    token,
    body: payload,
  })
}

export function verifyPatient(token: string, patientUserID: string, visitID: string) {
  return apiRequest<VerifyPatientResponse>(`/api/v1/patients/${patientUserID}/verify`, {
    method: 'POST',
    token,
    body: {
      visit_id: visitID,
    },
  })
}
