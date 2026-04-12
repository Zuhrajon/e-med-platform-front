import { useEffect, useState } from 'react'
import type { Appointment } from '../../context/AppointmentsContext'

type PrescriptionModalProps = {
  isOpen: boolean
  appointment: Appointment | null
  onClose: () => void
  onSave: (payload: { text: string }) => void
}

export default function PrescriptionModal({
  isOpen,
  appointment,
  onClose,
  onSave,
}: PrescriptionModalProps) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (appointment) {
      setText(appointment.prescription?.text || '')
    }
  }, [appointment])

  if (!isOpen || !appointment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
          <h2 className="text-[24px] font-semibold text-slate-900">Рецепт</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[32px] leading-none text-gray-500"
          >
            ×
          </button>
        </div>

        <div className="px-8 py-8">
          <div className="space-y-6">
            <div>
              <p className="text-[18px] text-gray-500">Пациент</p>
              <p className="mt-2 text-[22px] font-semibold text-slate-900">
                {appointment.patientName}
              </p>
            </div>

            <div>
              <label className="mb-3 block text-[18px] font-semibold text-slate-900">
                Текст рецепта
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                placeholder="Укажите назначенные препараты и схему приёма..."
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-[18px] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={onClose}
                className="h-16 rounded-2xl border border-gray-200 text-[18px] font-semibold text-slate-900"
              >
                Отмена
              </button>

              <button
                type="button"
                onClick={() => onSave({ text })}
                className="h-16 rounded-2xl bg-sky-600 text-[18px] font-semibold text-white"
              >
                Сохранить рецепт
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}