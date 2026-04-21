import { apiRequest } from './api'

export type VisitStatus = 'created' | 'confirmed' | 'completed' | 'cancelled'

export type Visit = {
  visit_id: string
  patient_user_id: string
  patient_full_name: string
  patient_phone_number: string
  doctor_user_id: string
  doctor_full_name: string
  specialty_id: string
  specialty_name: string
  scheduled_at: string
  status: VisitStatus
  created_at: string
}

export type AvailableSlot = {
  start_at: string
  end_at: string
}

export type CreateVisitResponse = {
  visit_id: string
  status: VisitStatus
  scheduled_at: string
  doctor_user_id: string
  patient_user_id: string
}

export type UpdateVisitStatusResponse = {
  visit_id: string
  status: VisitStatus
}

export type RescheduleVisitResponse = {
  visit_id: string
  status: VisitStatus
  scheduled_at: string
}

export function listVisits(
  accessToken: string,
  params: {
    status?: VisitStatus
    date?: string
  } = {},
) {
  const query = new URLSearchParams()

  if (params.status) {
    query.set('status', params.status)
  }

  if (params.date) {
    query.set('date', params.date)
  }

  const suffix = query.toString() ? `?${query.toString()}` : ''

  return apiRequest<Visit[]>(`/api/v1/visits/${suffix}`, {
    method: 'GET',
    token: accessToken,
  })
}

export function getAvailableSlots(accessToken: string, doctorUserID: string, date: string) {
  const query = new URLSearchParams({
    doctor_user_id: doctorUserID,
    date,
  })

  return apiRequest<AvailableSlot[]>(`/api/v1/visits/available-slots?${query.toString()}`, {
    method: 'GET',
    token: accessToken,
  })
}

export function createVisit(accessToken: string, payload: { doctor_user_id: string; scheduled_at: string }) {
  return apiRequest<CreateVisitResponse>('/api/v1/visits/', {
    method: 'POST',
    token: accessToken,
    body: payload,
  })
}

export function updateVisitStatus(
  accessToken: string,
  visitID: string,
  status: 'confirmed' | 'completed' | 'cancelled',
) {
  return apiRequest<UpdateVisitStatusResponse>(`/api/v1/visits/${visitID}/status`, {
    method: 'PATCH',
    token: accessToken,
    body: { status },
  })
}

export function rescheduleVisit(accessToken: string, visitID: string, scheduledAt: string) {
  return apiRequest<RescheduleVisitResponse>(`/api/v1/visits/${visitID}/reschedule`, {
    method: 'PATCH',
    token: accessToken,
    body: { scheduled_at: scheduledAt },
  })
}

export function getVisitStatusLabel(status: VisitStatus) {
  switch (status) {
    case 'created':
      return 'Создана'
    case 'confirmed':
      return 'Подтверждена'
    case 'completed':
      return 'Пройдена'
    case 'cancelled':
      return 'Отменена'
  }
}

export function getVisitStatusTone(status: VisitStatus) {
  switch (status) {
    case 'created':
      return 'bg-amber-50 text-amber-700'
    case 'confirmed':
      return 'bg-sky-50 text-sky-700'
    case 'completed':
      return 'bg-emerald-50 text-emerald-700'
    case 'cancelled':
      return 'bg-rose-50 text-rose-700'
  }
}

export function toDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function toClinicDateInputValue(value: string) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return formatter.format(new Date(value))
}

export function formatVisitDateTime(value: string) {
  const date = new Date(value)

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Moscow',
  }).format(date)
}

export function formatVisitTime(value: string) {
  const date = new Date(value)

  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  }).format(date)
}

export function formatVisitDate(value: string) {
  const date = new Date(value)

  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Moscow',
  }).format(date)
}
