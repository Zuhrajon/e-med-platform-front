import { useState } from 'react'
import UpcomingAppointments from '../components/UpcomingAppointments'
import CompletedAppointments from '../components/CompletedAppointments'
import CancelledAppointments from '../components/CancelledAppointments'
import CancelAppointmentModal from '../components/CancelAppontmentModal'
import { useAppointments, type Appointment } from '../context/AppointmentsContext'

export default function AppointmentsPage() {
  const {
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    cancelAppointment,
  } = useAppointments()

  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null)

  const handleOpenCancelModal = (appointment: Appointment) => {
    setAppointmentToCancel(appointment)
  }

  const handleCloseCancelModal = () => {
    setAppointmentToCancel(null)
  }

  const handleConfirmCancel = () => {
    if (!appointmentToCancel) return

    cancelAppointment(appointmentToCancel.id)
    setAppointmentToCancel(null)
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] px-8 py-10">
      <h1 className="text-[32px] font-semibold text-slate-900">Мои записи</h1>
      <p className="mt-3 text-[18px] text-gray-500">
        Управляйте своими визитами к врачам
      </p>

      <div className="mt-12">
        <UpcomingAppointments
          appointments={upcomingAppointments}
          onCancelClick={handleOpenCancelModal}
          variant="detailed"
        />
      </div>

      <div className="mt-14">
        <CompletedAppointments appointments={completedAppointments} />
      </div>

      {cancelledAppointments.length > 0 && (
        <div className="mt-14">
          <CancelledAppointments appointments={cancelledAppointments} />
        </div>
      )}

      <CancelAppointmentModal
        appointment={appointmentToCancel}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
      />
    </div>
  )
}