import { Calendar, Clock } from 'lucide-react'
import type { Appointment } from '../routes/AppointmentsPage'

type CancelledAppointmentsProps = {
  appointments: Appointment[]
}

export default function CancelledAppointments({
  appointments,
}: CancelledAppointmentsProps) {
  const getInitials = (doctorName: string) =>
    doctorName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)

  return (
    <section className="w-full">
      <h2 className="mb-8 text-[28px] font-semibold text-slate-900">
        Отменённые записи
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {appointments.map((appointment) => {
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

                    <p className="mt-3 text-[16px] text-gray-500">
                      {appointment.specialty}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-red-100 px-5 py-2 text-[16px] font-medium text-red-500">
                  {appointment.status}
                </span>
              </div>

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

              <p className="mt-5 text-[16px] text-gray-500">
                Причина: {appointment.reason}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}