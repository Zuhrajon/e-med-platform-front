export type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export type WorkingDay = {
  day: WeekDay
  startTime: string
  endTime: string
}

export type ScheduleException = {
  id: string
  date: string // YYYY-MM-DD
  reason: string
}

export type AppointmentSettings = {
  appointmentDuration: number // minutes
  breakBetweenAppointments: number // minutes
  maxAppointmentsPerDay: number | null // null = without limit
}

export type DoctorSchedule = {
  workingDays: WorkingDay[]
  exceptions: ScheduleException[]
  settings: AppointmentSettings
}