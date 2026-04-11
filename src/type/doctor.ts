export type DoctorDashboardStats = {
  appointmentsToday: number
  waitingPatients: number
  patientsThisMonth: number
  rating: number
}

export type DoctorTodayAppointment = {
  id: string
  patientId: string
  patientName: string
  complaint: string
  time: string
}

export type DoctorProtocol = {
  id: string
  patientId: string
  patientName: string
  diagnosis: string
  createdAt: string
}