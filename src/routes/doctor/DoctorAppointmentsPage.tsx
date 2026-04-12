import { useMemo, useState } from 'react'
import TodayAppointmentsSection from '../../components/doctor/TodayAppointmentsSection'
import DoctorDayStatsCard from '../../components/doctor/DoctorDayStatsCard'
import PrescriptionModal from '../../components/doctor/PrescriptionModal'
import ProtocolModal from '../../components/doctor/ProtocolModal'
import { useAppointments, type Appointment } from '../../context/AppointmentsContext'

export default function DoctorAppointmentsPage() {
  const {
    getDoctorAppointmentsByDate,
    getDoctorDayStats,
    saveProtocol,
    savePrescription,
    uploadFiles,
  } = useAppointments()

  const today = '13 апреля'

  const appointments = useMemo(
    () => getDoctorAppointmentsByDate(today),
    [getDoctorAppointmentsByDate, today],
  )

  const stats = useMemo(
    () => getDoctorDayStats(today),
    [getDoctorDayStats, today],
  )

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [protocolModalOpen, setProtocolModalOpen] = useState(false)
  const [protocolViewOpen, setProtocolViewOpen] = useState(false)
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false)

  return (
    <div className="w-full bg-[#f7f7f8] px-6 py-10">
      <header>
        <h1 className="text-[28px] font-semibold text-slate-900">Мои приёмы</h1>
        <p className="mt-3 text-[18px] text-gray-500">
          Управляйте приёмами пациентов
        </p>
      </header>

      <div className="mt-10 space-y-8">
        <TodayAppointmentsSection
          appointments={appointments}
          variant="expanded"
          onOpenProtocol={(appointment) => {
            setSelectedAppointment(appointment)
            setProtocolModalOpen(true)
          }}
          onOpenPrescription={(appointment) => {
            setSelectedAppointment(appointment)
            setPrescriptionModalOpen(true)
          }}
          onViewProtocol={(appointment) => {
            setSelectedAppointment(appointment)
            setProtocolViewOpen(true)
          }}
          onUploadFiles={(appointmentId, files) => {
            uploadFiles(appointmentId, files)
          }}
        />

        <DoctorDayStatsCard
          total={stats.total}
          completed={stats.completed}
          waiting={stats.waiting}
        />
      </div>

      <ProtocolModal
        isOpen={protocolModalOpen}
        appointment={selectedAppointment}
        onClose={() => {
          setProtocolModalOpen(false)
          setSelectedAppointment(null)
        }}
        onSave={(payload) => {
          if (!selectedAppointment) return

          saveProtocol(selectedAppointment.id, payload)
          setProtocolModalOpen(false)
          setSelectedAppointment(null)
        }}
      />

      <ProtocolModal
        isOpen={protocolViewOpen}
        appointment={selectedAppointment}
        readOnly
        onClose={() => {
          setProtocolViewOpen(false)
          setSelectedAppointment(null)
        }}
        onSave={() => { }}
      />

      <PrescriptionModal
        isOpen={prescriptionModalOpen}
        appointment={selectedAppointment}
        onClose={() => {
          setPrescriptionModalOpen(false)
          setSelectedAppointment(null)
        }}
        onSave={(payload) => {
          if (!selectedAppointment) return

          savePrescription(selectedAppointment.id, payload)
          setPrescriptionModalOpen(false)
          setSelectedAppointment(null)
        }}
      />
    </div>
  )
}