import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Paperclip, Pill } from 'lucide-react'
import type { Appointment, AppointmentFile } from '../../context/AppointmentsContext'

type TodayAppointmentsSectionProps = {
  appointments: Appointment[]
  variant?: 'compact' | 'expanded'
  onOpenProtocol?: (appointment: Appointment) => void
  onOpenPrescription?: (appointment: Appointment) => void
  onViewProtocol?: (appointment: Appointment) => void
  onUploadFiles?: (appointmentId: string, files: AppointmentFile[]) => void
}

export default function TodayAppointmentsSection({
  appointments,
  variant = 'compact',
  onOpenProtocol,
  onOpenPrescription,
  onViewProtocol,
  onUploadFiles,
}: TodayAppointmentsSectionProps) {
  const navigate = useNavigate()
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const isExpanded = variant === 'expanded'

  const handleFileChange = (
    appointmentId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const fileList = event.target.files
    if (!fileList || !onUploadFiles) return

    const files: AppointmentFile[] = Array.from(fileList).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
    }))

    onUploadFiles(appointmentId, files)
    event.target.value = ''
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-9 py-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-[24px] font-semibold text-slate-900">
          {isExpanded ? 'Сегодня - 12 апреля' : 'Приёмы на сегодня'}
        </h2>

        <button
          type="button"
          onClick={() => navigate('/doctor/appointments')}
          className="text-[18px] font-semibold text-slate-900 transition hover:text-sky-600"
        >
          Все приёмы
        </button>
      </div>

      <div className="space-y-5">
        {appointments.length > 0 ? (
          appointments.map((appointment) => {
            const isReadyToView =
              Boolean(appointment.protocol) && Boolean(appointment.prescription)

            return (
              <div
                key={appointment.id}
                className="rounded-3xl border border-gray-200 px-6 py-6"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="min-w-[90px] border-r border-gray-200 pr-6">
                      {isExpanded && (
                        <p className="mb-2 text-[16px] text-gray-500">Время</p>
                      )}
                      <p className="text-[20px] font-semibold text-slate-900">
                        {appointment.time}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-[22px] font-semibold text-slate-900">
                        {appointment.patientName || appointment.doctorName}
                      </h3>

                      {isExpanded ? (
                        <>
                          <p className="mt-2 text-[18px] text-gray-500">
                            ID: {appointment.patientCode || '—'}
                          </p>
                          <p className="mt-4 text-[18px] text-gray-500">
                            Причина: {appointment.reason}
                          </p>
                        </>
                      ) : (
                        <p className="mt-2 text-[18px] text-gray-500">
                          {appointment.reason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-6 border-t border-gray-200 pt-5">
                    {isReadyToView ? (
                      <button
                        type="button"
                        onClick={() => onViewProtocol?.(appointment)}
                        className="rounded-2xl border border-gray-200 px-6 py-4 text-[18px] font-semibold text-slate-900 transition hover:bg-gray-50"
                      >
                        Посмотреть протокол
                      </button>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <button
                          type="button"
                          onClick={() => onOpenProtocol?.(appointment)}
                          className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 text-[18px] font-semibold text-slate-900 transition hover:bg-gray-50"
                        >
                          <FileText className="h-5 w-5" />
                          Заполнить протокол
                        </button>

                        <>
                          <input
                            ref={(el) => {
                              inputRefs.current[appointment.id] = el
                            }}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(event) =>
                              handleFileChange(appointment.id, event)
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              inputRefs.current[appointment.id]?.click()
                            }
                            className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 text-[18px] font-semibold text-slate-900 transition hover:bg-gray-50"
                          >
                            <Paperclip className="h-5 w-5" />
                            Загрузить файлы
                          </button>
                        </>

                        <button
                          type="button"
                          onClick={() => onOpenPrescription?.(appointment)}
                          className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 text-[18px] font-semibold text-slate-900 transition hover:bg-gray-50"
                        >
                          <Pill className="h-5 w-5" />
                          Выписать рецепт
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 px-6 py-10 text-center text-[18px] text-gray-500">
            На сегодня приёмов нет
          </div>
        )}
      </div>
    </section>
  )
}