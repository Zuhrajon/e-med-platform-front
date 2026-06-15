import type { CreateStaffPayload, Specialty, StaffMember } from '../../lib/admin'

export type CreateStaffForm = Omit<
  CreateStaffPayload,
  'passport_files' | 'diploma_files' | 'employment_record_files'
> & {
  passport_files: File[]
  diploma_files: File[]
  employment_record_files: File[]
  avatar_file: File | null
}

export type EditStaffForm = {
  user_id: string
  role: StaffMember['role']
  full_name: string
  email: string
  phone_number: string
  specialty_id: string
  appointment_fee: string
  work_experience_years: string
  description: string
  avatar_url: string
  documents: NonNullable<StaffMember['documents']>
  is_active: boolean
}

export const initialCreateStaffForm: CreateStaffForm = {
  role: 'doctor',
  email: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  phone_number: '',
  gender_id: '1',
  passport_number: '',
  address: '',
  date_of_birth: '',
  specialty_id: '',
  work_experience_years: '',
  appointment_fee: '',
  passport_files: [],
  diploma_files: [],
  employment_record_files: [],
  avatar_file: null,
}

export function fileNames(files: File[]) {
  return files.map((file) => file.name).join(', ')
}

export function roleLabel(role: StaffMember['role']) {
  if (role === 'doctor') return 'Врач'
  if (role === 'laborant') return 'Лаборатория'
  return 'Регистратура'
}

export function roleBadgeClass(role: StaffMember['role']) {
  if (role === 'doctor') return 'bg-sky-50 text-sky-700'
  if (role === 'laborant') return 'bg-violet-50 text-violet-700'
  return 'bg-amber-50 text-amber-700'
}

export function toEditStaffForm(item: StaffMember): EditStaffForm {
  return {
    user_id: item.user_id,
    role: item.role,
    full_name: item.full_name,
    email: item.email,
    phone_number: item.phone_number,
    specialty_id: item.specialty_id,
    appointment_fee: item.appointment_fee,
    work_experience_years: String(item.work_experience_years ?? ''),
    description: item.description || '',
    avatar_url: item.avatar_url || '',
    documents: item.documents || [],
    is_active: item.is_active,
  }
}

export function nextSpecialtyID(specialties: Specialty[]) {
  return specialties.find((item) => item.is_active)?.id ?? ''
}
