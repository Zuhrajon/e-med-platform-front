import { apiRequest } from './api'

export type BackendRole = 'patient' | 'doctor' | 'superuser' | 'receptionist' | 'laborant'
export type AppRole = 'patient' | 'doctor' | 'admin' | 'receptionist' | 'laboratory'

export type AuthResponse = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  must_change_password: boolean
  role: BackendRole
}

export type ForgotPasswordResponse = {
  processed: boolean
  temporary_password_sent: boolean
  next_step: 'check_email_if_exists' | 'temporary_password_sent' | 'contact_administrator' | 'contact_developers'
}

export type RegisterPatientPayload = {
  email: string
  password: string
  first_name: string
  last_name: string
  middle_name: string
  phone_number: string
  gender_id: number
  passport_number: string
  address: string
  date_of_birth: string
}

export function mapBackendRoleToAppRole(role: BackendRole): AppRole {
  if (role === 'doctor') return 'doctor'
  if (role === 'patient') return 'patient'
  if (role === 'receptionist') return 'receptionist'
  if (role === 'laborant') return 'laboratory'

  return 'admin'
}

export async function loginRequest(email: string, password: string) {
  return apiRequest<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export async function forgotPasswordRequest(email: string) {
  return apiRequest<ForgotPasswordResponse>('/api/v1/auth/forgot-password', {
    method: 'POST',
    body: { email },
  })
}

export async function registerPatientRequest(payload: RegisterPatientPayload) {
  return apiRequest<
    AuthResponse & {
      user_id: string
      patient_profile_id: string
      verified: boolean
    }
  >('/api/v1/auth/register/patient', {
    method: 'POST',
    body: payload,
  })
}

export async function refreshRequest(refreshToken: string) {
  return apiRequest<AuthResponse>('/api/v1/auth/refresh', {
    method: 'POST',
    body: { refresh_token: refreshToken },
  })
}

export async function logoutRequest(refreshToken: string) {
  return apiRequest<null>('/api/v1/auth/logout', {
    method: 'POST',
    body: { refresh_token: refreshToken },
  })
}

export async function changePasswordRequest(
  accessToken: string,
  oldPassword: string,
  newPassword: string,
) {
  return apiRequest<AuthResponse>('/api/v1/auth/change-password', {
    method: 'POST',
    token: accessToken,
    body: {
      old_password: oldPassword,
      new_password: newPassword,
    },
  })
}
