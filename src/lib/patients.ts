import { apiRequest } from './api'

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

export function createPatient(token: string, payload: CreatePatientPayload) {
  return apiRequest<CreatePatientResponse>('/api/v1/patients/', {
    method: 'POST',
    token,
    body: payload,
  })
}
