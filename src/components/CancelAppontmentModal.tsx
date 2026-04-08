import { X } from 'lucide-react'
import type { Appointment } from '../routes/AppointmentsPage'

type CancelAppointmentModalProps = {
  appointment: Appointment | null
  onClose: () => void
  onConfirm: () => void
}

export default function CancelAppointmentModal({
  appointment,
  onClose,
  onConfirm,
}: CancelAppointmentModalProps) {
  if (!appointment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[720px] rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-9 py-7">
          <h3 className="text-[28px] font-semibold text-slate-900">
            Отмена записи
          </h3>

          <button
            onClick={onClose}
            className="text-gray-500 transition hover:text-slate-900"
          >
            <X size={34} />
          </button>
        </div>

        <div className="px-9 py-10">
          <p className="text-[20px] text-slate-800">
            Вы уверены, что хотите отменить запись?
          </p>

          <div className="mt-8 rounded-2xl bg-gray-100 px-6 py-7">
            <h4 className="text-[20px] font-semibold text-slate-900">
              {appointment.doctorName}
            </h4>

            <p className="mt-2 text-[18px] text-gray-500">
              {appointment.date} в {appointment.time}
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-gray-300 bg-white px-6 py-4 text-[18px] font-semibold text-slate-900 transition hover:bg-gray-50"
            >
              Назад
            </button>

            <button
              onClick={onConfirm}
              className="flex-1 rounded-2xl bg-red-500 px-6 py-4 text-[18px] font-semibold text-white transition hover:bg-red-600"
            >
              Отменить запись
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}