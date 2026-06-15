import { apiRequest } from './api'

export type MedicalCardFile = {
  file_id: string
  file_name: string
  content_type: string
  size_bytes: number
}

export type MedicalCardRecord = {
  record_id: string
  patient_user_id: string
  visit_id: string
  doctor_user_id: string
  doctor_full_name: string
  doctor_avatar_file_id?: string
  doctor_avatar_url?: string
  protocol_text: string
  created_at: string
  files: MedicalCardFile[]
}

export type CreateMedicalRecordResponse = {
  record_id: string
  patient_user_id: string
  visit_id: string
  protocol_text: string
}

export type AddMedicalRecordFilesResponse = {
  record_id: string
  file_count: number
}

export type ProtocolSections = {
  complaints: string
  diagnosis: string
  treatment: string
  recommendations: string
}

const sectionOrder: Array<keyof ProtocolSections> = [
  'complaints',
  'diagnosis',
  'treatment',
  'recommendations',
]

const sectionLabels: Record<keyof ProtocolSections, string> = {
  complaints: 'Жалобы',
  diagnosis: 'Диагноз',
  treatment: 'Лечение',
  recommendations: 'Рекомендации',
}

export function listMedicalCardRecords(accessToken: string, patientUserID: string) {
  return apiRequest<MedicalCardRecord[]>(`/api/v1/patients/${patientUserID}/medical-card`, {
    method: 'GET',
    token: accessToken,
  })
}

export function createMedicalRecord(accessToken: string, visitID: string, protocolText: string) {
  return apiRequest<CreateMedicalRecordResponse>(`/api/v1/visits/${visitID}/medical-records`, {
    method: 'POST',
    token: accessToken,
    body: {
      protocol_text: protocolText,
    },
  })
}

export function addMedicalRecordFiles(
  accessToken: string,
  visitID: string,
  recordID: string,
  files: File[],
) {
  const formData = new FormData()

  files.forEach((file) => {
    formData.append('files', file)
  })

  return apiRequest<AddMedicalRecordFilesResponse>(
    `/api/v1/visits/${visitID}/medical-records/${recordID}/files`,
    {
      method: 'POST',
      token: accessToken,
      body: formData,
    },
  )
}

export function buildProtocolText(sections: ProtocolSections) {
  return sectionOrder
    .map((key) => `${sectionLabels[key]}:\n${sections[key].trim() || 'Не указано'}`)
    .join('\n\n')
}

export function parseProtocolText(protocolText: string): ProtocolSections {
  const normalized = protocolText.trim()
  const parsed: ProtocolSections = {
    complaints: '',
    diagnosis: '',
    treatment: '',
    recommendations: '',
  }

  for (let index = 0; index < sectionOrder.length; index += 1) {
    const currentKey = sectionOrder[index]
    const currentLabel = sectionLabels[currentKey]
    const nextKey = sectionOrder[index + 1]
    const startIndex = normalized.indexOf(`${currentLabel}:`)

    if (startIndex === -1) {
      continue
    }

    const contentStart = startIndex + currentLabel.length + 1
    const nextIndex = nextKey ? normalized.indexOf(`${sectionLabels[nextKey]}:`) : -1
    parsed[currentKey] = normalized
      .slice(contentStart, nextIndex === -1 ? undefined : nextIndex)
      .trim()
  }

  if (!parsed.complaints && !parsed.diagnosis && !parsed.treatment && !parsed.recommendations) {
    return {
      complaints: normalized,
      diagnosis: '',
      treatment: '',
      recommendations: '',
    }
  }

  return parsed
}

export function formatFileSize(sizeBytes: number) {
  if (sizeBytes < 1024) return `${sizeBytes} Б`
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} КБ`

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} МБ`
}
