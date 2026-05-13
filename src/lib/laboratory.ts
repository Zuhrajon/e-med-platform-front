import { apiRequest } from './api'

export type LaboratoryStatus = 'created' | 'accepted' | 'completed' | 'cancelled'

export type LaboratoryTestType = {
  id: string
  name: string
  description: string
  is_active: boolean
}

export type LaboratoryOrderItem = {
  order_item_id: string
  test_type_id: string
  test_type_name: string
  notes: string
  result_text: string
}

export type LaboratoryOrderResultFile = {
  file_id: string
  file_name: string
  content_type: string
  size_bytes: number
  download_url: string
}

export type LaboratoryOrder = {
  order_id: string
  patient_user_id: string
  patient_full_name: string
  patient_phone_number: string
  doctor_user_id: string
  doctor_full_name: string
  visit_id: string
  status: LaboratoryStatus
  doctor_comment: string
  laboratory_comment: string
  accepted_by_user_id: string
  completed_by_user_id: string
  accepted_at: string | null
  completed_at: string | null
  created_at: string
  items: LaboratoryOrderItem[]
  result_files: LaboratoryOrderResultFile[]
}

export type CreateLaboratoryOrderPayload = {
  doctor_comment: string
  items: Array<{
    test_type_id: string
    notes: string
  }>
}

export type CompleteLaboratoryOrderPayload = {
  laboratory_comment: string
  items: Array<{
    test_type_id: string
    result_text: string
  }>
}

export function listLaboratoryTestTypes(accessToken: string) {
  return apiRequest<LaboratoryTestType[]>('/api/v1/laboratory/test-types/', {
    method: 'GET',
    token: accessToken,
  })
}

export function createLaboratoryTestType(
  accessToken: string,
  payload: { name: string; description: string },
) {
  return apiRequest<LaboratoryTestType>('/api/v1/laboratory/test-types/', {
    method: 'POST',
    token: accessToken,
    body: payload,
  })
}

export function updateLaboratoryTestType(
  accessToken: string,
  testTypeID: string,
  payload: { name?: string; description?: string; is_active?: boolean },
) {
  return apiRequest<LaboratoryTestType>(`/api/v1/laboratory/test-types/${testTypeID}`, {
    method: 'PATCH',
    token: accessToken,
    body: payload,
  })
}

export function deleteLaboratoryTestType(accessToken: string, testTypeID: string) {
  return apiRequest<void>(`/api/v1/laboratory/test-types/${testTypeID}`, {
    method: 'DELETE',
    token: accessToken,
  })
}

export function listLaboratoryOrders(
  accessToken: string,
  params: {
    status?: LaboratoryStatus
  } = {},
) {
  const query = new URLSearchParams()
  if (params.status) {
    query.set('status', params.status)
  }

  const suffix = query.toString() ? `?${query.toString()}` : ''
  return apiRequest<LaboratoryOrder[]>(`/api/v1/laboratory/orders/${suffix}`, {
    method: 'GET',
    token: accessToken,
  })
}

export function getLaboratoryOrderByID(accessToken: string, orderID: string) {
  return apiRequest<LaboratoryOrder>(`/api/v1/laboratory/orders/${orderID}`, {
    method: 'GET',
    token: accessToken,
  })
}

export function createLaboratoryOrder(
  accessToken: string,
  visitID: string,
  payload: CreateLaboratoryOrderPayload,
) {
  return apiRequest<{
    order_id: string
    patient_user_id: string
    visit_id: string
    status: LaboratoryStatus
    doctor_comment: string
    items: LaboratoryOrderItem[]
  }>(`/api/v1/visits/${visitID}/lab-orders`, {
    method: 'POST',
    token: accessToken,
    body: payload,
  })
}

export function acceptLaboratoryOrder(accessToken: string, orderID: string) {
  return apiRequest<{
    order_id: string
    status: LaboratoryStatus
    accepted_by_user_id: string
    accepted_at: string | null
  }>(`/api/v1/laboratory/orders/${orderID}/accept`, {
    method: 'PATCH',
    token: accessToken,
  })
}

export function completeLaboratoryOrder(
  accessToken: string,
  orderID: string,
  payload: CompleteLaboratoryOrderPayload,
) {
  return apiRequest<{
    order_id: string
    status: LaboratoryStatus
    completed_by_user_id: string
    completed_at: string | null
    laboratory_comment: string
  }>(`/api/v1/laboratory/orders/${orderID}/complete`, {
    method: 'PATCH',
    token: accessToken,
    body: payload,
  })
}

export function addLaboratoryOrderFiles(accessToken: string, orderID: string, files: File[]) {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  return apiRequest<{ order_id: string; file_count: number }>(
    `/api/v1/laboratory/orders/${orderID}/files`,
    {
      method: 'POST',
      token: accessToken,
      body: formData,
    },
  )
}

export function getLaboratoryStatusLabel(status: LaboratoryStatus) {
  switch (status) {
    case 'created':
      return 'Создано'
    case 'accepted':
      return 'В работе'
    case 'completed':
      return 'Готово'
    case 'cancelled':
      return 'Отменено'
  }
}

export function getLaboratoryStatusTone(status: LaboratoryStatus) {
  switch (status) {
    case 'created':
      return 'bg-amber-50 text-amber-700'
    case 'accepted':
      return 'bg-sky-50 text-sky-700'
    case 'completed':
      return 'bg-emerald-50 text-emerald-700'
    case 'cancelled':
      return 'bg-rose-50 text-rose-700'
  }
}
