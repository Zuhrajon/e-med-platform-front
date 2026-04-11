import type {
  AppointmentSettings,
  DoctorSchedule,
  WeekDay,
  WorkingDay,
} from '../type/schedule'

export const WEEK_DAYS: { value: WeekDay; label: string }[] = [
  { value: 'monday', label: 'Понедельник' },
  { value: 'tuesday', label: 'Вторник' },
  { value: 'wednesday', label: 'Среда' },
  { value: 'thursday', label: 'Четверг' },
  { value: 'friday', label: 'Пятница' },
  { value: 'saturday', label: 'Суббота' },
  { value: 'sunday', label: 'Воскресенье' },
]

export const DEFAULT_APPOINTMENT_SETTINGS: AppointmentSettings = {
  appointmentDuration: 30,
  breakBetweenAppointments: 5,
  maxAppointmentsPerDay: 10,
}

export const DEFAULT_DOCTOR_SCHEDULE: DoctorSchedule = {
  workingDays: [
    { day: 'monday', startTime: '09:00', endTime: '17:00' },
    { day: 'tuesday', startTime: '09:00', endTime: '17:00' },
    { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
    { day: 'thursday', startTime: '09:00', endTime: '17:00' },
    { day: 'friday', startTime: '09:00', endTime: '14:00' },
  ],
  exceptions: [
    {
      id: crypto.randomUUID(),
      date: '2026-05-01',
      reason: 'Праздничный день',
    },
  ],
  settings: DEFAULT_APPOINTMENT_SETTINGS,
}

export function getWeekDayLabel(day: WeekDay) {
  return WEEK_DAYS.find((item) => item.value === day)?.label ?? day
}

export function sortWorkingDays(days: WorkingDay[]) {
  const order: Record<WeekDay, number> = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  }

  return [...days].sort((a, b) => order[a.day] - order[b.day])
}

export function formatExceptionDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date)
}

export function toInputDate(date: Date) {
  return date.toISOString().split('T')[0]
}

export function getWeekDayFromDate(date: Date): WeekDay {
  const jsDay = date.getDay()

  const map: Record<number, WeekDay> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  }

  return map[jsDay]
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  appointmentDuration: number,
  breakBetweenAppointments: number,
) {
  const slots: string[] = []

  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  let current = startHour * 60 + startMinute
  const end = endHour * 60 + endMinute

  while (current + appointmentDuration <= end) {
    const hours = Math.floor(current / 60)
    const minutes = current % 60

    slots.push(
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
    )

    current += appointmentDuration + breakBetweenAppointments
  }

  return slots
}