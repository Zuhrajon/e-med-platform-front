import { useNavigate } from 'react-router-dom'
import type { DoctorTodayAppointment } from '../../type/doctor'

type TodayAppointmentsSectionProps = {
  appointments: DoctorTodayAppointment[]
}

export default function TodayAppointmentsSection({
  appointments,
}: TodayAppointmentsSectionProps) {
  const navigate = useNavigate()

  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-9 py-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-[24px] font-semibold text-slate-900">
          Приёмы на сегодня
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
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between rounded-3xl border border-gray-200 px-6 py-6"
            >
              <div className="flex items-center gap-6">
                <div className="min-w-[90px] border-r border-gray-200 pr-6">
                  <p className="text-[16px] text-gray-500">Время</p>
                  <p className="text-[20px] font-semibold text-slate-900">
                    {appointment.time}
                  </p>
                </div>

                <div>
                  <h3 className="text-[22px] font-semibold text-slate-900">
                    {appointment.patientName}
                  </h3>
                  <p className="mt-2 text-[18px] text-gray-500">
                    {appointment.complaint}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 px-6 py-10 text-center text-[18px] text-gray-500">
            На сегодня приёмов нет
          </div>
        )}
      </div>
    </section>
  )
}