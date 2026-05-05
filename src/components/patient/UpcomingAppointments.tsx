import { Calendar, Clock } from 'lucide-react'

export type UpcomingAppointmentItem = {
  id: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: string
  reason: string
}

type UpcomingAppointmentsProps = {
  appointments: UpcomingAppointmentItem[]
  onCancelClick?: (appointment: UpcomingAppointmentItem) => void
  variant?: 'compact' | 'detailed'
  title?: string
  showAllLink?: boolean
  onShowAllClick?: () => void
}

export default function UpcomingAppointments({
  appointments,
  onCancelClick,
  variant = 'detailed',
  title = 'Предстоящие приёмы',
  showAllLink = false,
  onShowAllClick,
}: UpcomingAppointmentsProps) {
  const getInitials = (doctorName: string) =>
    doctorName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Подтверждена':
        return 'bg-sky-100 text-sky-700'
      case 'Создана':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <section className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-[28px] font-semibold text-slate-900">{title}</h2>

        {showAllLink ? (
          <button
            type="button"
            onClick={onShowAllClick}
            className="text-[16px] font-semibold text-slate-900"
          >
            Все записи
          </button>
        ) : null}
      </div>

      <div
        className={
          variant === 'compact'
            ? 'flex flex-col gap-4'
            : 'grid grid-cols-1 gap-6 md:grid-cols-2'
        }
      >
        {appointments.length ? (
          appointments.map((appointment) => {
            const initials = getInitials(appointment.doctorName)

            return (
              <div
                key={appointment.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[22px] font-medium text-slate-800">
                      {initials}
                    </div>

                    <div>
                      <h3 className="text-[20px] font-semibold leading-tight text-slate-900">
                        {appointment.doctorName}
                      </h3>

                      <p className="mt-3 text-[16px] text-gray-500">{appointment.specialty}</p>

                      {variant === 'compact' ? (
                        <p className="mt-2 text-[16px] text-gray-500">
                          {appointment.date}
                          {appointment.time ? ` в ${appointment.time}` : ''}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-5 py-2 text-[16px] font-medium ${getStatusStyles(appointment.status)}`}
                  >
                    {appointment.status}
                  </span>
                </div>

                {variant === 'detailed' ? (
                  <>
                    <div className="mt-6 flex items-center gap-8 text-[16px] text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={22} />
                        <span>{appointment.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={22} />
                        <span>{appointment.time}</span>
                      </div>
                    </div>

                    <p className="mt-5 text-[16px] text-gray-500">Причина: {appointment.reason}</p>

                    <div className="my-5 border-t border-gray-200" />

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => onCancelClick?.(appointment)}
                        className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-[16px] font-semibold text-slate-900 transition hover:bg-gray-50"
                      >
                        Отменить запись
                      </button>

                      <button
                        type="button"
                        className="flex-1 rounded-xl bg-sky-600 px-4 py-3 text-[16px] font-semibold text-white transition hover:bg-sky-700"
                      >
                        Перенести
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            )
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-8 text-[16px] text-gray-500">
            Предстоящих приёмов пока нет.
          </div>
        )}
      </div>
    </section>
  )
}
