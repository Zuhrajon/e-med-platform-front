import { useEffect, useState } from 'react'
import type { Appointment } from '../../context/AppointmentsContext'

type ProtocolModalProps = {
  isOpen: boolean
  appointment: Appointment | null
  readOnly?: boolean
  onClose: () => void
  onSave: (payload: {
    complaint: string
    diagnosis: string
    treatment: string
    recommendations: string
  }) => void
}

export default function ProtocolModal({
  isOpen,
  appointment,
  readOnly = false,
  onClose,
  onSave,
}: ProtocolModalProps) {
  const [complaint, setComplaint] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [treatment, setTreatment] = useState('')
  const [recommendations, setRecommendations] = useState('')

  useEffect(() => {
    if (appointment) {
      setComplaint(appointment.protocol?.complaint || '')
      setDiagnosis(appointment.protocol?.diagnosis || '')
      setTreatment(appointment.protocol?.treatment || '')
      setRecommendations(appointment.protocol?.recommendations || '')
    }
  }, [appointment])

  if (!isOpen || !appointment) return null

  const handleSave = () => {
    onSave({
      complaint,
      diagnosis,
      treatment,
      recommendations,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
          <h2 className="text-[24px] font-semibold text-slate-900">
            Протокол приёма
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-[32px] leading-none text-gray-500"
          >
            ×
          </button>
        </div>

        <div className="max-h-[calc(90vh-88px)] overflow-y-auto px-8 py-8">
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 rounded-3xl bg-gray-50 p-6 md:grid-cols-2">
              <div>
                <p className="text-[18px] text-gray-500">Пациент</p>
                <p className="mt-3 text-[22px] font-semibold text-slate-900">
                  {appointment.patientName}
                </p>
              </div>

              <div>
                <p className="text-[18px] text-gray-500">Дата и время</p>
                <p className="mt-3 text-[22px] font-semibold text-slate-900">
                  {appointment.date} в {appointment.time}
                </p>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-[18px] font-semibold text-slate-900">
                Жалобы
              </label>
              <textarea
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                rows={5}
                disabled={readOnly}
                placeholder="Опишите жалобы пациента..."
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-[18px] outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-3 block text-[18px] font-semibold text-slate-900">
                Диагноз
              </label>
              <input
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                disabled={readOnly}
                placeholder="Укажите диагноз..."
                className="h-16 w-full rounded-2xl border border-gray-200 px-5 text-[18px] outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-3 block text-[18px] font-semibold text-slate-900">
                Лечение
              </label>
              <textarea
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                rows={5}
                disabled={readOnly}
                placeholder="Назначенное лечение..."
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-[18px] outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-3 block text-[18px] font-semibold text-slate-900">
                Рекомендации
              </label>
              <textarea
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                rows={5}
                disabled={readOnly}
                placeholder="Рекомендации для пациента..."
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-[18px] outline-none disabled:bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={onClose}
                className="h-16 rounded-2xl border border-gray-200 text-[18px] font-semibold text-slate-900"
              >
                {readOnly ? 'Закрыть' : 'Отмена'}
              </button>

              {!readOnly && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="h-16 rounded-2xl bg-sky-600 text-[18px] font-semibold text-white"
                >
                  Сохранить протокол
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}