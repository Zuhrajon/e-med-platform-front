import type { UserProfile } from '../context/UserContext'
import { apiRequest } from './api'
import type { BackendRole } from './auth'

export type BackendDoctorProfile = {
  specialty_id: string
  specialty_name: string
  work_experience_years: number
  appointment_fee: string
  description: string
  avatar_file_id: string
  avatar_url: string
}

export type BackendProfile = {
  user_id: string
  role: string
  email: string
  first_name: string
  last_name: string
  middle_name: string
  phone_number: string
  gender_id: number
  passport_number: string
  address: string
  date_of_birth: string
  is_active: boolean
  doctor_profile?: BackendDoctorProfile
}

export type UpdateProfilePayload = {
  first_name?: string
  last_name?: string
  middle_name?: string
  phone_number?: string
  gender_id?: number
  passport_number?: string
  address?: string
  date_of_birth?: string
  description?: string
}

export function getMyProfile(accessToken: string) {
  return apiRequest<BackendProfile>('/api/v1/profile/me', {
    method: 'GET',
    token: accessToken,
  })
}

export function updateMyProfile(accessToken: string, payload: UpdateProfilePayload) {
  return apiRequest<BackendProfile>('/api/v1/profile/me', {
    method: 'PATCH',
    token: accessToken,
    body: payload,
  })
}

export function uploadMyAvatar(accessToken: string, file: File) {
  const formData = new FormData()
  formData.set('file', file)

  return apiRequest<BackendProfile>('/api/v1/profile/me/avatar', {
    method: 'POST',
    token: accessToken,
    body: formData,
  })
}

export function deleteMyAvatar(accessToken: string) {
  return apiRequest<BackendProfile>('/api/v1/profile/me/avatar', {
    method: 'DELETE',
    token: accessToken,
  })
}

export function genderIdToLabel(genderId: number) {
  return genderId === 2 ? 'Женский' : 'Мужской'
}

export function genderLabelToId(gender: string) {
  return gender === 'Женский' ? 2 : 1
}

export function mergeUserProfileFromBackend(
  current: UserProfile,
  backendRole: BackendRole,
  profile: BackendProfile,
): UserProfile {
  const isDoctor = backendRole === 'doctor'

  return {
    ...current,
    userId: profile.user_id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    middleName: profile.middle_name,
    phone: profile.phone_number,
    gender: genderIdToLabel(profile.gender_id),
    birthDate: profile.date_of_birth,
    address: profile.address,
    documentNumber: profile.passport_number,
    position:
      backendRole === 'superuser'
        ? 'Администратор'
        : backendRole === 'receptionist'
          ? 'Ресепшен'
          : backendRole === 'laborant'
            ? 'Лаборатория'
            : isDoctor
              ? 'Врач'
              : '',
    officeNumber: '',
    department: '',
    specialization: isDoctor ? profile.doctor_profile?.specialty_name || '' : '',
    qualification: isDoctor ? `${profile.doctor_profile?.work_experience_years ?? 0} лет стажа` : '',
    description: isDoctor ? profile.doctor_profile?.description || '' : '',
    avatar: isDoctor ? profile.doctor_profile?.avatar_url || null : current.avatar,
  }
}
