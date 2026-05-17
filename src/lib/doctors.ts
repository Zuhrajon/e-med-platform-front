import { apiRequest } from './api'
import { getCachedDoctorDescription } from './doctorDescription'
import { getCachedDoctorPhoto } from './doctorPhoto'

export type BackendSpecialty = {
  id: string
  name: string
  is_active: boolean
}

export type BackendDoctor = {
  user_id: string
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
  is_active: boolean
}

export type DoctorListItem = {
  id: string
  name: string
  specialty: string
  rating: number
  reviewsCount: number
  experience: string
  description: string
  photoUrl: string
  price: number
  email: string
  phone: string
  specialtyId: string
  isActive: boolean
}

export function mapDoctorFromBackend(item: BackendDoctor): DoctorListItem {
  const cachedDescription = getCachedDoctorDescription(item.user_id)

  return {
    id: item.user_id,
    name:
      item.full_name ||
      [item.last_name, item.first_name, item.middle_name].filter(Boolean).join(' '),
    specialty: item.specialty_name,
    rating: 4.8,
    reviewsCount: 0,
    experience: `${item.work_experience_years} лет`,
    description:
      cachedDescription ||
      `Специализация: ${item.specialty_name}. Контактный телефон: ${item.phone_number || 'не указан'}.`,
    photoUrl: getCachedDoctorPhoto(item.user_id),
    price: Number(item.appointment_fee),
    email: item.email,
    phone: item.phone_number,
    specialtyId: item.specialty_id,
    isActive: item.is_active,
  }
}

export async function getSpecialties(accessToken: string) {
  return apiRequest<BackendSpecialty[]>('/api/v1/specialties', {
    method: 'GET',
    token: accessToken,
  })
}

export async function getDoctors(
  accessToken: string,
  params?: {
    search?: string
    specialtyId?: string
  },
) {
  const query = new URLSearchParams()
  query.set('role', 'doctor')

  if (params?.search?.trim()) {
    query.set('search', params.search.trim())
  }

  if (params?.specialtyId?.trim()) {
    query.set('specialty_id', params.specialtyId.trim())
  }

  return apiRequest<BackendDoctor[]>(`/api/v1/users/staff?${query.toString()}`, {
    method: 'GET',
    token: accessToken,
  })
}
